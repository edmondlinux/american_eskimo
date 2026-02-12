import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api, type InquiryCreateInput } from "@shared/routes";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useInquiries() {
  return useQuery({
    queryKey: [api.inquiries.list.path],
    queryFn: async () => {
      const res = await fetch(api.inquiries.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) {
          const err = parseWithLogging(api.inquiries.list.responses[401], await res.json(), "inquiries.list.401");
          throw new Error(err.message);
        }
        throw new Error("Failed to fetch inquiries");
      }
      return parseWithLogging(api.inquiries.list.responses[200], await res.json(), "inquiries.list.200");
    },
  });
}

export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: InquiryCreateInput) => {
      const validated = api.inquiries.create.input.parse(data);
      const res = await fetch(api.inquiries.create.path, {
        method: api.inquiries.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(api.inquiries.create.responses[400], await res.json(), "inquiries.create.400");
          throw new Error(err.message);
        }
        throw new Error("Failed to send inquiry");
      }

      return parseWithLogging(api.inquiries.create.responses[201], await res.json(), "inquiries.create.201");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.inquiries.list.path] });
    },
  });
}
