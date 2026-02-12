import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api, buildUrl, type ReviewCreateInput, type ReviewUpdateInput } from "@shared/routes";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useReviews() {
  return useQuery({
    queryKey: [api.reviews.list.path],
    queryFn: async () => {
      const res = await fetch(api.reviews.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return parseWithLogging(api.reviews.list.responses[200], await res.json(), "reviews.list");
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReviewCreateInput) => {
      const validated = api.reviews.create.input.parse(data);
      const res = await fetch(api.reviews.create.path, {
        method: api.reviews.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.reviews.create.responses[400], await res.json(), "reviews.create.400");
          throw new Error(err.message);
        }
        if (res.status === 401) {
          const err = parseWithLogging(api.reviews.create.responses[401], await res.json(), "reviews.create.401");
          throw new Error(err.message);
        }
        throw new Error("Failed to create review");
      }

      return parseWithLogging(api.reviews.create.responses[201], await res.json(), "reviews.create.201");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.reviews.list.path] });
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ReviewUpdateInput }) => {
      const validated = api.reviews.update.input.parse(updates);
      const url = buildUrl(api.reviews.update.path, { id });
      const res = await fetch(url, {
        method: api.reviews.update.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.reviews.update.responses[400], await res.json(), "reviews.update.400");
          throw new Error(err.message);
        }
        if (res.status === 401) {
          const err = parseWithLogging(api.reviews.update.responses[401], await res.json(), "reviews.update.401");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.reviews.update.responses[404], await res.json(), "reviews.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update review");
      }

      return parseWithLogging(api.reviews.update.responses[200], await res.json(), "reviews.update.200");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.reviews.list.path] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.reviews.delete.path, { id });
      const res = await fetch(url, { method: api.reviews.delete.method, credentials: "include" });

      if (!res.ok) {
        if (res.status === 401) {
          const err = parseWithLogging(api.reviews.delete.responses[401], await res.json(), "reviews.delete.401");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.reviews.delete.responses[404], await res.json(), "reviews.delete.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to delete review");
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.reviews.list.path] });
    },
  });
}
