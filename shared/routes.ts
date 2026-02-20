import { z } from "zod";
import {
  insertInquirySchema,
  insertPuppySchema,
  insertReviewSchema,
  type Inquiry,
  type Puppy,
  type Review,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

const puppySchema = z.custom<Puppy>();
const inquirySchema = z.custom<Inquiry>();
const reviewSchema = z.custom<Review>();

export const api = {
  puppies: {
    list: {
      method: "GET" as const,
      path: "/api/puppies" as const,
      input: z
        .object({
          availableOnly: z
            .union([z.literal("true"), z.literal("false")])
            .optional(),
        })
        .optional(),
      responses: {
        200: z.array(puppySchema),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/puppies/:id" as const,
      responses: {
        200: puppySchema,
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/puppies" as const,
      input: insertPuppySchema,
      responses: {
        201: puppySchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/puppies/:id" as const,
      input: insertPuppySchema.partial(),
      responses: {
        200: puppySchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/puppies/:id" as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  inquiries: {
    list: {
      method: "GET" as const,
      path: "/api/inquiries" as const,
      responses: {
        200: z.array(inquirySchema),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/inquiries" as const,
      input: insertInquirySchema,
      responses: {
        201: inquirySchema,
        400: errorSchemas.validation,
      },
    },
  },
  reviews: {
    list: {
      method: "GET" as const,
      path: "/api/reviews" as const,
      responses: {
        200: z.array(reviewSchema),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/reviews" as const,
      input: insertReviewSchema,
      responses: {
        201: reviewSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/reviews/:id" as const,
      input: insertReviewSchema.partial(),
      responses: {
        200: reviewSchema,
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/reviews/:id" as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  settings: {
    list: {
      method: "GET" as const,
      path: "/api/settings" as const,
      responses: {
        200: z.array(z.object({ key: z.string(), value: z.string() })),
      },
    },
    update: {
      method: "POST" as const,
      path: "/api/settings" as const,
      input: z.object({ key: z.string(), value: z.string() }),
      responses: {
        200: z.object({ key: z.string(), value: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PuppyCreateInput = z.infer<typeof api.puppies.create.input>;
export type PuppyUpdateInput = z.infer<typeof api.puppies.update.input>;
export type PuppiesListResponse = z.infer<typeof api.puppies.list.responses[200]>;
export type PuppyResponse = z.infer<typeof api.puppies.get.responses[200]>;

export type InquiryCreateInput = z.infer<typeof api.inquiries.create.input>;
export type InquiriesListResponse = z.infer<
  typeof api.inquiries.list.responses[200]
>;
export type InquiryResponse = z.infer<typeof api.inquiries.create.responses[201]>;

export type ReviewsListResponse = z.infer<typeof api.reviews.list.responses[200]>;
export type ReviewResponse = z.infer<typeof api.reviews.create.responses[201]>;
export type ReviewCreateInput = z.infer<typeof api.reviews.create.input>;
export type ReviewUpdateInput = z.infer<typeof api.reviews.update.input>;

export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type UnauthorizedError = z.infer<typeof errorSchemas.unauthorized>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
