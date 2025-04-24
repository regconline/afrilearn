import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  pgEnum, 
  uniqueIndex, 
  doublePrecision,
  date,
  time,
  json,
  jsonb
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'tutor', 'parent', 'admin']);
export const currencyEnum = pgEnum('currency', ['NGN', 'KES', 'ZAR', 'XOF', 'USD', 'EUR']);
export const languageEnum = pgEnum('language', ['en', 'fr', 'sw']);
export const sessionStatusEnum = pgEnum('session_status', ['scheduled', 'in_progress', 'completed', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded', 'held_in_escrow']);
export const paymentGatewayEnum = pgEnum('payment_gateway', ['flutterwave', 'mpesa', 'paystack']);
export const contentTypeEnum = pgEnum('content_type', ['pdf', 'video', 'image', 'text', 'audio', 'link']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default('student'),
  languagePreference: languageEnum("language_preference").notNull().default('en'),
  profileImage: text("profile_image"),
  bio: text("bio"),
  country: text("country"),
  city: text("city"),
  timezone: text("timezone").default('UTC'),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  refreshToken: text("refresh_token"),
  oauthProvider: text("oauth_provider"),
  oauthId: text("oauth_id"),
  // Additional fields for specific roles
  // Tutor specific
  isTutorVerified: boolean("is_tutor_verified").default(false),
  hourlyRate: doublePrecision("hourly_rate"),
  currency: currencyEnum("currency"),
  // Student specific
  learningGoals: text("learning_goals"),
  // Parent specific
  childrenIds: text("children_ids").array(),
  // Common
  deviceTokens: text("device_tokens").array(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  tutorProfiles: many(tutorProfiles),
  studentProfiles: many(studentProfiles),
  sessions: many(sessions, { relationName: "userSessions" }),
  tutoredSessions: many(sessions, { relationName: "tutorSessions" }),
  payments: many(payments),
  content: many(content),
}));

// Tutor Profiles table
export const tutorProfiles = pgTable("tutor_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  education: text("education"),
  certifications: text("certifications").array(),
  experience: integer("experience").default(0), // in years
  subjects: text("subjects").array(),
  availability: jsonb("availability"), // JSON with days and hours
  ratingAverage: doublePrecision("rating_average").default(0),
  ratingsCount: integer("ratings_count").default(0),
  completedSessions: integer("completed_sessions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tutor profiles relations
export const tutorProfilesRelations = relations(tutorProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [tutorProfiles.userId],
    references: [users.id],
  }),
  sessions: many(sessions),
  reviews: many(reviews),
}));

// Student Profiles table
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  grade: text("grade"),
  school: text("school"),
  subjects: text("subjects").array(),
  learningStyle: text("learning_style"),
  parentId: integer("parent_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student profiles relations
export const studentProfilesRelations = relations(studentProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
  parent: one(users, {
    fields: [studentProfiles.parentId],
    references: [users.id],
  }),
  sessions: many(sessions),
}));

// Sessions table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  tutorId: integer("tutor_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: sessionStatusEnum("status").default('scheduled'),
  meetingLink: text("meeting_link"),
  recordingUrl: text("recording_url"),
  notes: text("notes"),
  subject: text("subject").notNull(),
  price: doublePrecision("price").notNull(),
  currency: currencyEnum("currency").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: text("recurring_pattern"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions relations
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  student: one(users, {
    fields: [sessions.studentId],
    references: [users.id],
    relationName: "userSessions",
  }),
  tutor: one(users, {
    fields: [sessions.tutorId],
    references: [users.id],
    relationName: "tutorSessions",
  }),
  payment: many(payments),
  content: many(content),
  attendance: many(sessionAttendance),
}));

// Session Attendance table
export const sessionAttendance = pgTable("session_attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id),
  joinTime: timestamp("join_time"),
  leaveTime: timestamp("leave_time"),
  duration: integer("duration"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Session attendance relations
export const sessionAttendanceRelations = relations(sessionAttendance, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionAttendance.sessionId],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [sessionAttendance.userId],
    references: [users.id],
  }),
}));

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => sessions.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  currency: currencyEnum("currency").notNull(),
  gateway: paymentGatewayEnum("gateway").notNull(),
  status: paymentStatusEnum("status").default('pending'),
  transactionId: text("transaction_id"),
  gatewayReference: text("gateway_reference"),
  metaData: jsonb("meta_data"),
  releaseDate: timestamp("release_date"), // date to release from escrow
  processingFee: doublePrecision("processing_fee").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  session: one(sessions, {
    fields: [payments.sessionId],
    references: [sessions.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

// Payouts table
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  tutorId: integer("tutor_id").notNull().references(() => users.id),
  amount: doublePrecision("amount").notNull(),
  currency: currencyEnum("currency").notNull(),
  status: paymentStatusEnum("status").default('pending'),
  paymentMethod: text("payment_method").notNull(), // bank, mobile_money, etc.
  accountDetails: jsonb("account_details"),
  reference: text("reference"),
  processingFee: doublePrecision("processing_fee").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Payouts relations
export const payoutsRelations = relations(payouts, ({ one }) => ({
  tutor: one(users, {
    fields: [payouts.tutorId],
    references: [users.id],
  }),
}));

// Content table
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  sessionId: integer("session_id").references(() => sessions.id),
  title: text("title").notNull(),
  description: text("description"),
  type: contentTypeEnum("type").notNull(),
  url: text("url").notNull(),
  fileSize: integer("file_size"), // in bytes
  duration: integer("duration"), // for videos/audio (in seconds)
  isPublic: boolean("is_public").default(false),
  isOfflineAvailable: boolean("is_offline_available").default(false),
  language: languageEnum("language").default('en'),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content relations
export const contentRelations = relations(content, ({ one }) => ({
  creator: one(users, {
    fields: [content.creatorId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [content.sessionId],
    references: [sessions.id],
  }),
}));

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  tutorId: integer("tutor_id").notNull().references(() => users.id),
  sessionId: integer("session_id").references(() => sessions.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  student: one(users, {
    fields: [reviews.studentId],
    references: [users.id],
  }),
  tutor: one(users, {
    fields: [reviews.tutorId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [reviews.sessionId],
    references: [sessions.id],
  }),
}));

// Create insert schemas for each table
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  refreshToken: true,
});

export const insertTutorProfileSchema = createInsertSchema(tutorProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ratingAverage: true,
  ratingsCount: true,
  completedSessions: true,
});

export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions, {
  // Customize validators as needed
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  processingFee: true,
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  processingFee: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Export types for use in the application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TutorProfile = typeof tutorProfiles.$inferSelect;
export type InsertTutorProfile = z.infer<typeof insertTutorProfileSchema>;

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

export type SessionAttendance = typeof sessionAttendance.$inferSelect;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
