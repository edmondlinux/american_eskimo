import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import type { CurrentUserResponse } from "@shared/schema";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

// No route manifest entry provided for /api/me, but implementation notes require it.
// Keep runtime-safe parsing with a local schema that matches shared/schema.ts.
const currentUserSchema: z.ZodType<CurrentUserResponse> = z.union([
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.union([z.literal("admin"), z.literal("user")]),
  }),
  z.null(),
]);

export function useCurrentUser() {
  return useQuery({
    queryKey: ["/api/me"],
    retry: false,
    queryFn: async () => {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch current user");
      const json = await res.json();
      return parseWithLogging(currentUserSchema, json, "auth.me");
    },
  });
}
