import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CurrentUserResponse } from "@shared/schema";

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: ["/api/user"],
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
    },
  });
}
