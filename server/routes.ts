import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTutorProfileSchema, 
  insertStudentProfileSchema,
  insertSessionSchema,
  insertPaymentSchema,
  insertContentSchema,
  insertReviewSchema
} from "@shared/schema";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { WebSocketServer } from "ws";

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "afrilearn_secret_key"; // Use env var in production
const JWT_EXPIRES_IN = "24h";

// Auth Middleware
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Auth middlewares
const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };
    
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based access middleware
const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

// Rate limiting middleware (simple implementation)
const requestCounts = new Map<string, { count: number, resetTime: number }>();
const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const requestData = requestCounts.get(ip)!;
    
    if (now > requestData.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (requestData.count >= maxRequests) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    
    requestData.count++;
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time features (chat, notifications)
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log('Received message:', parsedMessage);
        
        // Handle different message types
        switch (parsedMessage.type) {
          case 'chat':
            // Broadcast chat message to all connected clients
            wss.clients.forEach((client) => {
              if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat',
                  data: parsedMessage.data
                }));
              }
            });
            break;
            
          case 'notification':
            // Send notification to specific user(s)
            // Implementation would require user identification/authentication for WebSockets
            break;
            
          default:
            console.log('Unknown message type:', parsedMessage.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Auth Routes
  app.post('/api/auth/register', rateLimit(10, 60 * 1000), async (req: Request, res: Response) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const userData = validationResult.data;
      
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      if (userData.phone) {
        const existingUserByPhone = await storage.getUserByPhone(userData.phone);
        if (existingUserByPhone) {
          return res.status(409).json({ message: "Phone number already registered" });
        }
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post('/api/auth/login', rateLimit(10, 60 * 1000), async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: "Account has been deactivated" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      // Update last login timestamp
      const loginDate = new Date();
      await storage.updateUser(user.id, { 
        updatedAt: loginDate
        // lastLoginAt is handled directly in the database updateUser method
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  });

  app.post('/api/auth/refresh-token', async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
      
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: number };
      
      // Find user
      const user = await storage.getUser(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      
      // Generate new access token
      const newToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      res.status(200).json({
        message: "Token refreshed successfully",
        token: newToken
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({ message: "Invalid or expired refresh token" });
    }
  });

  // User Routes
  app.get('/api/users/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch('/api/users/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      // Validate the update data
      const updateSchema = insertUserSchema.partial();
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const updateData = validationResult.data;
      
      // Don't allow role updates through this endpoint
      if (updateData.role) {
        delete updateData.role;
      }
      
      // Hash password if provided
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json({
        message: "User updated successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin user management routes
  app.get('/api/admin/users', authenticate, requireRole(['admin']), async (req: Request, res: Response) => {
    try {
      // Implementation would involve pagination and filtering
      // This is a placeholder for the admin endpoint
      res.status(200).json({ message: "Admin users endpoint" });
    } catch (error) {
      console.error("Admin get users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Tutor Profile Routes
  app.post('/api/tutor-profiles', authenticate, requireRole(['tutor']), async (req: AuthRequest, res: Response) => {
    try {
      // First, add the userId to the request body
      const profileDataWithUserId = {
        ...req.body,
        userId: req.user!.id
      };
      
      const validationResult = insertTutorProfileSchema.safeParse(profileDataWithUserId);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const profileData = validationResult.data;
      
      // Check if profile already exists
      const existingProfile = await storage.getTutorProfileByUserId(req.user!.id);
      if (existingProfile) {
        return res.status(409).json({ message: "Tutor profile already exists" });
      }
      
      const profile = await storage.createTutorProfile(profileData);
      
      res.status(201).json({
        message: "Tutor profile created successfully",
        profile
      });
    } catch (error) {
      console.error("Create tutor profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/tutor-profiles/me', authenticate, requireRole(['tutor']), async (req: AuthRequest, res: Response) => {
    try {
      const profile = await storage.getTutorProfileByUserId(req.user!.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }
      
      res.status(200).json(profile);
    } catch (error) {
      console.error("Get tutor profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/tutors', async (req: Request, res: Response) => {
    try {
      // This would include filters for subject, rating, etc.
      // Implementation would involve pagination
      
      // Example filter by subject
      const subject = req.query.subject as string;
      if (subject) {
        const tutors = await storage.getTutorsBySubject(subject);
        return res.status(200).json(tutors);
      }
      
      // Example filter by rating
      const rating = parseInt(req.query.rating as string);
      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        const tutors = await storage.getTutorsByRating(rating);
        return res.status(200).json(tutors);
      }
      
      // Default response
      res.status(200).json({ message: "Tutors list endpoint" });
    } catch (error) {
      console.error("Get tutors error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Student Profile Routes
  app.post('/api/student-profiles', authenticate, requireRole(['student']), async (req: AuthRequest, res: Response) => {
    try {
      // First, add the userId to the request body
      const profileDataWithUserId = {
        ...req.body,
        userId: req.user!.id
      };
      
      const validationResult = insertStudentProfileSchema.safeParse(profileDataWithUserId);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const profileData = validationResult.data;
      
      // Check if profile already exists
      const existingProfile = await storage.getStudentProfileByUserId(req.user!.id);
      if (existingProfile) {
        return res.status(409).json({ message: "Student profile already exists" });
      }
      
      const profile = await storage.createStudentProfile(profileData);
      
      res.status(201).json({
        message: "Student profile created successfully",
        profile
      });
    } catch (error) {
      console.error("Create student profile error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Session Routes
  app.post('/api/sessions', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      // Fix date parsing issues by converting strings to Date objects
      const requestData = {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime)
      };
      
      // For students, we need to set the studentId
      if (req.user!.role === 'student') {
        requestData.studentId = req.user!.id;
      } else if (req.user!.role === 'tutor') {
        requestData.tutorId = req.user!.id;
      }
      
      const validationResult = insertSessionSchema.safeParse(requestData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const sessionData = validationResult.data;
      
      // Check for double-booking
      // This would involve checking for existing sessions in the time range
      
      // Add additional properties not in the schema but needed for the database
      const sessionToCreate = {
        ...sessionData,
        meetingLink: `https://meet.afrilearn.com/${Math.random().toString(36).substring(2, 15)}`
      };
      
      const session = await storage.createSession(sessionToCreate);
      
      res.status(201).json({
        message: "Session created successfully",
        session
      });
    } catch (error) {
      console.error("Create session error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/sessions/upcoming', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const sessions = await storage.getUpcomingSessions(req.user!.id);
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Get upcoming sessions error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/sessions/past', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const sessions = await storage.getPastSessions(req.user!.id);
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Get past sessions error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch('/api/sessions/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      
      if (isNaN(sessionId)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      // Verify session ownership
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      if (session.studentId !== req.user!.id && 
          session.tutorId !== req.user!.id && 
          req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Not authorized to update this session" });
      }
      
      // Validate update data
      const updateSchema = insertSessionSchema.partial();
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const updateData = validationResult.data;
      
      // Restrict fields that can be updated based on role
      if (req.user!.role !== 'admin') {
        delete updateData.price;
        delete updateData.currency;
        // Only allow status changes to 'cancelled'
        if (updateData.status && updateData.status !== 'cancelled') {
          delete updateData.status;
        }
      }
      
      const updatedSession = await storage.updateSession(sessionId, updateData);
      
      res.status(200).json({
        message: "Session updated successfully",
        session: updatedSession
      });
    } catch (error) {
      console.error("Update session error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/sessions/:id/attendance', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      
      if (isNaN(sessionId)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      // Verify session exists
      const session = await storage.getSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      // Record attendance
      const attendance = await storage.recordAttendance({
        sessionId,
        userId: req.user!.id,
        joinTime: new Date(),
        leaveTime: undefined,
        duration: 0
      });
      
      res.status(201).json({
        message: "Attendance recorded successfully",
        attendance
      });
    } catch (error) {
      console.error("Record attendance error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Payment Routes
  app.post('/api/payments', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      // First, add the userId to the request body
      const paymentDataWithUser = {
        ...req.body,
        userId: req.user!.id
      };
      
      // Add placeholder processing fee (5% of amount)
      const processingFee = req.body.amount * 0.05;
      
      // Set release date for escrow (24 hours after payment)
      const releaseDate = new Date();
      releaseDate.setHours(releaseDate.getHours() + 24);
      
      // Add these fields to the payment data
      const fullPaymentData = {
        ...paymentDataWithUser,
        processingFee,
        releaseDate
      };
      
      const validationResult = insertPaymentSchema.safeParse(fullPaymentData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const paymentData = validationResult.data;
      
      // In production, this would integrate with payment gateways
      // For now, we'll simulate a successful payment
      const payment = await storage.createPayment(paymentData);
      
      res.status(201).json({
        message: "Payment created successfully",
        payment
      });
    } catch (error) {
      console.error("Create payment error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/payments', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const payments = await storage.getPaymentsByUser(req.user!.id);
      res.status(200).json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Placeholder for payment gateway webhook
  app.post('/api/webhooks/payment', async (req: Request, res: Response) => {
    try {
      // In production, verify webhook signature
      // const signature = req.headers['x-payment-signature'];
      // const isValid = verifySignature(signature, req.body);
      
      // if (!isValid) {
      //   return res.status(400).json({ message: "Invalid webhook signature" });
      // }
      
      const { reference, status, transactionId } = req.body;
      
      // Update payment status
      // Implementation would involve finding the payment by reference/transactionId
      
      res.status(200).json({ message: "Webhook received successfully" });
    } catch (error) {
      console.error("Payment webhook error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Content Routes
  app.post('/api/content', authenticate, async (req: AuthRequest, res: Response) => {
    try {
      // Map contentType to type if needed
      const contentDataWithCreator = {
        ...req.body,
        creatorId: req.user!.id,
        type: req.body.contentType || req.body.type // Accept either field
      };
      
      const validationResult = insertContentSchema.safeParse(contentDataWithCreator);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const contentData = validationResult.data;
      
      // In production, this would involve uploading files to S3/CDN
      // and setting the URL accordingly
      
      const contentItem = await storage.createContent(contentData);
      
      res.status(201).json({
        message: "Content created successfully",
        content: contentItem
      });
    } catch (error) {
      console.error("Create content error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/content/public', async (req: Request, res: Response) => {
    try {
      const publicContent = await storage.getPublicContent();
      res.status(200).json(publicContent);
    } catch (error) {
      console.error("Get public content error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/content/offline', authenticate, async (req: Request, res: Response) => {
    try {
      const offlineContent = await storage.getOfflineAvailableContent();
      res.status(200).json(offlineContent);
    } catch (error) {
      console.error("Get offline content error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Review Routes
  app.post('/api/reviews', authenticate, requireRole(['student']), async (req: AuthRequest, res: Response) => {
    try {
      // First, add the studentId to the request body
      const reviewDataWithStudent = {
        ...req.body,
        studentId: req.user!.id
      };
      
      const validationResult = insertReviewSchema.safeParse(reviewDataWithStudent);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationResult.error.format() 
        });
      }
      
      const reviewData = validationResult.data;
      
      // Verify session exists and student participated in it
      if (reviewData.sessionId) {
        const session = await storage.getSession(reviewData.sessionId);
        
        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }
        
        if (session.studentId !== req.user!.id) {
          return res.status(403).json({ message: "Not authorized to review this session" });
        }
      }
      
      const review = await storage.createReview(reviewData);
      
      // Update tutor's rating average
      // This would involve fetching all reviews and calculating the new average
      
      res.status(201).json({
        message: "Review submitted successfully",
        review
      });
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/tutors/:id/reviews', async (req: Request, res: Response) => {
    try {
      const tutorId = parseInt(req.params.id);
      
      if (isNaN(tutorId)) {
        return res.status(400).json({ message: "Invalid tutor ID" });
      }
      
      const reviews = await storage.getReviewsByTutor(tutorId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Get tutor reviews error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return httpServer;
}
