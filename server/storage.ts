import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  inquiries,
  puppies,
  reviews,
  users,
  type CreateInquiryRequest,
  type CreatePuppyRequest,
  type CreateReviewRequest,
  type Inquiry,
  type Puppy,
  type Review,
  type UpdatePuppyRequest,
  type UpdateReviewRequest,
  type CurrentUserResponse,
  type User,
  type InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCurrentUser(): Promise<CurrentUserResponse>;

  // Puppies
  listPuppies(params?: { availableOnly?: boolean }): Promise<Puppy[]>;
  getPuppy(id: string): Promise<Puppy | undefined>;
  createPuppy(input: CreatePuppyRequest): Promise<Puppy>;
  updatePuppy(id: string, updates: UpdatePuppyRequest): Promise<Puppy | undefined>;
  deletePuppy(id: string): Promise<boolean>;

  // Inquiries
  listInquiries(): Promise<Inquiry[]>;
  createInquiry(input: CreateInquiryRequest): Promise<Inquiry>;

  // Reviews
  listReviews(params?: { featuredOnly?: boolean; limit?: number }): Promise<Review[]>;
  createReview(input: CreateReviewRequest): Promise<Review>;
  updateReview(id: string, updates: UpdateReviewRequest): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [row] = await db.select().from(users).where(eq(users.id, id));
    return row;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [row] = await db.select().from(users).where(eq(users.email, email));
    return row;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [row] = await db.insert(users).values(insertUser).returning();
    return row;
  }

  async getCurrentUser(): Promise<CurrentUserResponse> {
    // Return null since setupAuth handles current user retrieval via req.user
    return null;
  }

  async listPuppies(params?: { availableOnly?: boolean }): Promise<Puppy[]> {
    const where = params?.availableOnly ? eq(puppies.isAvailable, true) : undefined;
    const rows = where
      ? await db.select().from(puppies).where(where).orderBy(desc(puppies.createdAt))
      : await db.select().from(puppies).orderBy(desc(puppies.createdAt));
    return rows;
  }

  async getPuppy(id: string): Promise<Puppy | undefined> {
    const [row] = await db.select().from(puppies).where(eq(puppies.id, id));
    return row;
  }

  async createPuppy(input: CreatePuppyRequest): Promise<Puppy> {
    const [row] = await db.insert(puppies).values(input).returning();
    return row;
  }

  async updatePuppy(id: string, updates: UpdatePuppyRequest): Promise<Puppy | undefined> {
    const [row] = await db
      .update(puppies)
      .set(updates)
      .where(eq(puppies.id, id))
      .returning();
    return row;
  }

  async deletePuppy(id: string): Promise<boolean> {
    const [row] = await db.delete(puppies).where(eq(puppies.id, id)).returning();
    return !!row;
  }

  async listInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(input: CreateInquiryRequest): Promise<Inquiry> {
    const [row] = await db.insert(inquiries).values(input).returning();
    return row;
  }

  async listReviews(params?: { featuredOnly?: boolean; limit?: number }): Promise<Review[]> {
    const where = params?.featuredOnly ? eq(reviews.isFeatured, true) : undefined;
    const q = where ? db.select().from(reviews).where(where) : db.select().from(reviews);
    const ordered = q.orderBy(desc(reviews.createdAt));
    if (typeof params?.limit === "number") {
      return await ordered.limit(params.limit);
    }
    return await ordered;
  }

  async createReview(input: CreateReviewRequest): Promise<Review> {
    const [row] = await db.insert(reviews).values(input).returning();
    return row;
  }

  async updateReview(id: string, updates: UpdateReviewRequest): Promise<Review | undefined> {
    const [row] = await db
      .update(reviews)
      .set(updates)
      .where(eq(reviews.id, id))
      .returning();
    return row;
  }

  async deleteReview(id: string): Promise<boolean> {
    const [row] = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    return !!row;
  }
}

export const storage = new DatabaseStorage();
