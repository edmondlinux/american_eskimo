import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api, buildUrl, type PuppyCreateInput, type PuppyUpdateInput } from "@shared/routes";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function usePuppies(params?: { availableOnly?: boolean }) {
  return useQuery({
    queryKey: [api.puppies.list.path, params?.availableOnly ? "availableOnly=true" : "availableOnly=false"],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.availableOnly !== undefined) sp.set("availableOnly", String(params.availableOnly));
      const url = sp.toString() ? `${api.puppies.list.path}?${sp}` : api.puppies.list.path;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch puppies");
      return parseWithLogging(api.puppies.list.responses[200], await res.json(), "puppies.list");
    },
  });
}

export function usePuppy(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: [api.puppies.get.path, id ?? ""],
    queryFn: async () => {
      const url = buildUrl(api.puppies.get.path, { id: id as string });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch puppy");
      return parseWithLogging(api.puppies.get.responses[200], await res.json(), "puppies.get");
    },
  });
}

export function useCreatePuppy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PuppyCreateInput) => {
      const validated = api.puppies.create.input.parse(data);
      const res = await fetch(api.puppies.create.path, {
        method: api.puppies.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.puppies.create.responses[400], await res.json(), "puppies.create.400");
          throw new Error(err.message);
        }
        if (res.status === 401) {
          const err = parseWithLogging(api.puppies.create.responses[401], await res.json(), "puppies.create.401");
          throw new Error(err.message);
        }
        throw new Error("Failed to create puppy");
      }

      return parseWithLogging(api.puppies.create.responses[201], await res.json(), "puppies.create.201");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.puppies.list.path] });
    },
  });
}

export function useUpdatePuppy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PuppyUpdateInput }) => {
      const validated = api.puppies.update.input.parse(updates);
      const url = buildUrl(api.puppies.update.path, { id });
      const res = await fetch(url, {
        method: api.puppies.update.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.puppies.update.responses[400], await res.json(), "puppies.update.400");
          throw new Error(err.message);
        }
        if (res.status === 401) {
          const err = parseWithLogging(api.puppies.update.responses[401], await res.json(), "puppies.update.401");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.puppies.update.responses[404], await res.json(), "puppies.update.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to update puppy");
      }

      return parseWithLogging(api.puppies.update.responses[200], await res.json(), "puppies.update.200");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.puppies.list.path] });
    },
  });
}

export function useDeletePuppy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.puppies.delete.path, { id });
      const res = await fetch(url, { method: api.puppies.delete.method, credentials: "include" });

      if (!res.ok) {
        if (res.status === 401) {
          const err = parseWithLogging(api.puppies.delete.responses[401], await res.json(), "puppies.delete.401");
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(api.puppies.delete.responses[404], await res.json(), "puppies.delete.404");
          throw new Error(err.message);
        }
        throw new Error("Failed to delete puppy");
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.puppies.list.path] });
    },
  });
}
