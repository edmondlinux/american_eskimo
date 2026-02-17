import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =============================
// Tables
// =============================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
});

export const puppies = pgTable("puppies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  sex: text("sex").notNull(),
  age: text("age").notNull(),
  temperament: text("temperament").notNull(),
  price: integer("price").notNull(),
  depositAmount: integer("deposit_amount").notNull().default(0),
  imageUrl: text("image_url"),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  selectedPuppyId: varchar("selected_puppy_id").references(() => puppies.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewerName: text("reviewer_name").notNull(),
  rating: integer("rating").notNull(),
  testimonialText: text("testimonial_text").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// =============================
// Insert schemas
// =============================

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertPuppySchema = createInsertSchema(puppies, {
  price: z.coerce.number().min(0),
  depositAmount: z.coerce.number().min(0),
}).omit({
  id: true,
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// =============================
// Base types
// =============================

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Puppy = typeof puppies.$inferSelect;
export type InsertPuppy = z.infer<typeof insertPuppySchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// =============================
// Explicit API contract types
// =============================

export type CreatePuppyRequest = InsertPuppy;
export type UpdatePuppyRequest = Partial<InsertPuppy>;
export type PuppyResponse = Puppy;
export type PuppiesListResponse = Puppy[];

export type CreateInquiryRequest = InsertInquiry;
export type InquiryResponse = Inquiry;
export type InquiriesListResponse = Inquiry[];

export type CreateReviewRequest = InsertReview;
export type UpdateReviewRequest = Partial<InsertReview>;
export type ReviewResponse = Review;
export type ReviewsListResponse = Review[];

export type CurrentUserResponse =
  | {
      id: string;
      name: string;
      email: string;
      role: "admin" | "user";
    }
  | null;

export const USER_ROLES = ["admin", "user"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  total?: number;
}
