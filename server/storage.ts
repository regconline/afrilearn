import { 
  users, 
  tutorProfiles, 
  studentProfiles, 
  sessions, 
  sessionAttendance,
  payments,
  payouts,
  content,
  reviews,
  type User, 
  type InsertUser,
  type TutorProfile,
  type InsertTutorProfile,
  type StudentProfile,
  type InsertStudentProfile,
  type Session,
  type InsertSession,
  type SessionAttendance,
  type Payment,
  type InsertPayment,
  type Payout,
  type InsertPayout,
  type Content,
  type InsertContent,
  type Review,
  type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql, between, gte, lte, inArray } from "drizzle-orm";

// Comprehensive storage interface for all entities
export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deactivateUser(id: number): Promise<boolean>;
  
  // Tutor Profile Management
  getTutorProfile(id: number): Promise<TutorProfile | undefined>;
  getTutorProfileByUserId(userId: number): Promise<TutorProfile | undefined>;
  createTutorProfile(profile: InsertTutorProfile): Promise<TutorProfile>;
  updateTutorProfile(id: number, profile: Partial<InsertTutorProfile>): Promise<TutorProfile | undefined>;
  getTutorsBySubject(subject: string): Promise<TutorProfile[]>;
  getTutorsByRating(minRating: number): Promise<TutorProfile[]>;
  
  // Student Profile Management
  getStudentProfile(id: number): Promise<StudentProfile | undefined>;
  getStudentProfileByUserId(userId: number): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(id: number, profile: Partial<InsertStudentProfile>): Promise<StudentProfile | undefined>;
  getStudentsByParent(parentId: number): Promise<StudentProfile[]>;
  
  // Session Management
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, session: Partial<InsertSession>): Promise<Session | undefined>;
  getSessionsByStudent(studentId: number): Promise<Session[]>;
  getSessionsByTutor(tutorId: number): Promise<Session[]>;
  getUpcomingSessions(userId: number): Promise<Session[]>;
  getPastSessions(userId: number): Promise<Session[]>;
  
  // Session Attendance Management
  recordAttendance(attendance: Omit<SessionAttendance, "id" | "createdAt">): Promise<SessionAttendance>;
  getSessionAttendance(sessionId: number): Promise<SessionAttendance[]>;
  
  // Payment Management
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  getPaymentsBySession(sessionId: number): Promise<Payment[]>;
  getPaymentsInEscrow(): Promise<Payment[]>;
  
  // Payout Management
  getPayout(id: number): Promise<Payout | undefined>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: number, payout: Partial<InsertPayout>): Promise<Payout | undefined>;
  getPayoutsByTutor(tutorId: number): Promise<Payout[]>;
  
  // Content Management
  getContent(id: number): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined>;
  getContentBySession(sessionId: number): Promise<Content[]>;
  getContentByCreator(creatorId: number): Promise<Content[]>;
  getPublicContent(): Promise<Content[]>;
  getOfflineAvailableContent(): Promise<Content[]>;
  
  // Review Management
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByTutor(tutorId: number): Promise<Review[]>;
  getReviewsByStudent(studentId: number): Promise<Review[]>;
  getReviewsBySession(sessionId: number): Promise<Review[]>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({...userData, updatedAt: new Date()})
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deactivateUser(id: number): Promise<boolean> {
    const [updatedUser] = await db
      .update(users)
      .set({isActive: false, updatedAt: new Date()})
      .where(eq(users.id, id))
      .returning();
    return !!updatedUser;
  }

  // Tutor Profile Management
  async getTutorProfile(id: number): Promise<TutorProfile | undefined> {
    const [profile] = await db.select().from(tutorProfiles).where(eq(tutorProfiles.id, id));
    return profile;
  }

  async getTutorProfileByUserId(userId: number): Promise<TutorProfile | undefined> {
    const [profile] = await db.select().from(tutorProfiles).where(eq(tutorProfiles.userId, userId));
    return profile;
  }

  async createTutorProfile(profile: InsertTutorProfile): Promise<TutorProfile> {
    const [createdProfile] = await db.insert(tutorProfiles).values(profile).returning();
    return createdProfile;
  }

  async updateTutorProfile(id: number, profileData: Partial<InsertTutorProfile>): Promise<TutorProfile | undefined> {
    const [updatedProfile] = await db
      .update(tutorProfiles)
      .set({...profileData, updatedAt: new Date()})
      .where(eq(tutorProfiles.id, id))
      .returning();
    return updatedProfile;
  }

  async getTutorsBySubject(subject: string): Promise<TutorProfile[]> {
    // This is a simplified implementation; in reality, we'd need a more complex query
    // that searches the subjects array for the given subject
    return db.select().from(tutorProfiles).where(
      sql`${tutorProfiles.subjects} @> ARRAY[${subject}]::text[]`
    );
  }

  async getTutorsByRating(minRating: number): Promise<TutorProfile[]> {
    return db.select().from(tutorProfiles).where(gte(tutorProfiles.ratingAverage, minRating));
  }

  // Student Profile Management
  async getStudentProfile(id: number): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.id, id));
    return profile;
  }

  async getStudentProfileByUserId(userId: number): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const [createdProfile] = await db.insert(studentProfiles).values(profile).returning();
    return createdProfile;
  }

  async updateStudentProfile(id: number, profileData: Partial<InsertStudentProfile>): Promise<StudentProfile | undefined> {
    const [updatedProfile] = await db
      .update(studentProfiles)
      .set({...profileData, updatedAt: new Date()})
      .where(eq(studentProfiles.id, id))
      .returning();
    return updatedProfile;
  }

  async getStudentsByParent(parentId: number): Promise<StudentProfile[]> {
    return db.select().from(studentProfiles).where(eq(studentProfiles.parentId, parentId));
  }

  // Session Management
  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [createdSession] = await db.insert(sessions).values(session).returning();
    return createdSession;
  }

  async updateSession(id: number, sessionData: Partial<InsertSession>): Promise<Session | undefined> {
    const [updatedSession] = await db
      .update(sessions)
      .set({...sessionData, updatedAt: new Date()})
      .where(eq(sessions.id, id))
      .returning();
    return updatedSession;
  }

  async getSessionsByStudent(studentId: number): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.studentId, studentId));
  }

  async getSessionsByTutor(tutorId: number): Promise<Session[]> {
    return db.select().from(sessions).where(eq(sessions.tutorId, tutorId));
  }

  async getUpcomingSessions(userId: number): Promise<Session[]> {
    const now = new Date();
    return db.select().from(sessions).where(
      and(
        or(
          eq(sessions.studentId, userId),
          eq(sessions.tutorId, userId)
        ),
        gte(sessions.startTime, now)
      )
    ).orderBy(sessions.startTime);
  }

  async getPastSessions(userId: number): Promise<Session[]> {
    const now = new Date();
    return db.select().from(sessions).where(
      and(
        or(
          eq(sessions.studentId, userId),
          eq(sessions.tutorId, userId)
        ),
        lte(sessions.endTime, now)
      )
    ).orderBy(desc(sessions.endTime));
  }

  // Session Attendance Management
  async recordAttendance(attendance: Omit<SessionAttendance, "id" | "createdAt">): Promise<SessionAttendance> {
    const [createdAttendance] = await db.insert(sessionAttendance).values(attendance).returning();
    return createdAttendance;
  }

  async getSessionAttendance(sessionId: number): Promise<SessionAttendance[]> {
    return db.select().from(sessionAttendance).where(eq(sessionAttendance.sessionId, sessionId));
  }

  // Payment Management
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [createdPayment] = await db.insert(payments).values(payment).returning();
    return createdPayment;
  }

  async updatePayment(id: number, paymentData: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set({...paymentData, updatedAt: new Date()})
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }

  async getPaymentsBySession(sessionId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.sessionId, sessionId));
  }

  async getPaymentsInEscrow(): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.status, 'held_in_escrow'));
  }

  // Payout Management
  async getPayout(id: number): Promise<Payout | undefined> {
    const [payout] = await db.select().from(payouts).where(eq(payouts.id, id));
    return payout;
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    const [createdPayout] = await db.insert(payouts).values(payout).returning();
    return createdPayout;
  }

  async updatePayout(id: number, payoutData: Partial<InsertPayout>): Promise<Payout | undefined> {
    const [updatedPayout] = await db
      .update(payouts)
      .set(payoutData)
      .where(eq(payouts.id, id))
      .returning();
    return updatedPayout;
  }

  async getPayoutsByTutor(tutorId: number): Promise<Payout[]> {
    return db.select().from(payouts).where(eq(payouts.tutorId, tutorId));
  }

  // Content Management
  async getContent(id: number): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.id, id));
    return contentItem;
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const [createdContent] = await db.insert(content).values(contentData).returning();
    return createdContent;
  }

  async updateContent(id: number, contentData: Partial<InsertContent>): Promise<Content | undefined> {
    const [updatedContent] = await db
      .update(content)
      .set({...contentData, updatedAt: new Date()})
      .where(eq(content.id, id))
      .returning();
    return updatedContent;
  }

  async getContentBySession(sessionId: number): Promise<Content[]> {
    return db.select().from(content).where(eq(content.sessionId, sessionId));
  }

  async getContentByCreator(creatorId: number): Promise<Content[]> {
    return db.select().from(content).where(eq(content.creatorId, creatorId));
  }

  async getPublicContent(): Promise<Content[]> {
    return db.select().from(content).where(eq(content.isPublic, true));
  }

  async getOfflineAvailableContent(): Promise<Content[]> {
    return db.select().from(content).where(eq(content.isOfflineAvailable, true));
  }

  // Review Management
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [createdReview] = await db.insert(reviews).values(reviewData).returning();
    return createdReview;
  }

  async getReviewsByTutor(tutorId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.tutorId, tutorId));
  }

  async getReviewsByStudent(studentId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.studentId, studentId));
  }

  async getReviewsBySession(sessionId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
