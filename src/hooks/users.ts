import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";
import { loginRedirect } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL + "/users";

function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    staleTime: Infinity,
    refetchOnWindowFocus: "always",
    refetchOnMount: false,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await fetch(API_URL, { credentials: "include" });
      if (res.status === 401) loginRedirect();
      const data: User[] = await res.json();
      return data.map((user) => {
        if (user.role === "System User") return { ...user, role: "Radiologist" };
        return user;
      });
    },
  });
}

type UserCreate = { full_name: string; email: string; role: string };
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ full_name, email, role }: UserCreate) => {
      await fetch(API_URL, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, role }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: () => loginRedirect(),
  });
}

type UserUpdateFields = { full_name?: string; email?: string; role?: string; status?: number };
type UserUpdatePayload = { id: number; data: UserUpdateFields };
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: UserUpdatePayload) => {
      await fetch(`${API_URL}/${id}`, {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export { useCreateUser, useUpdateUser, useUsers };
