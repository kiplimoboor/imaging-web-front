import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRedirect } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  full_name: string;
  email: string;
  status: number;
  role: string;
  admin: boolean;
  studies: number;
}

type UserCreate = { full_name: string; email: string; role: string };
type UserUpdate = { id: number; field: string; value: string };

function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(API_URL + "/users", { credentials: "include" });
      if (res.status === 401) loginRedirect();
      const data: User[] = await res.json();
      return data;
    },
  });
}

function useActiveUsers() {
  return useQuery<User[]>({
    queryKey: ["activeUsers"],
    queryFn: async () => {
      const res = await fetch(API_URL + "/users/active", { credentials: "include" });
      if (res.status === 401) loginRedirect();
      const data: User[] = await res.json();
      return data;
    },
  });
}

function useActiveStudents() {
  return useQuery<User[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await fetch(API_URL + "/users/students/active", { credentials: "include" });
      if (res.status === 401) loginRedirect();
      const data: User[] = await res.json();
      return data;
    },
  });
}

function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ full_name, email, role }: UserCreate) => {
      await fetch(API_URL + "/users", {
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

function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, field, value }: UserUpdate) => {
      const res = await fetch(API_URL + "/users", {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value }),
      });

      return res.status;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["activeUsers"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => loginRedirect(),
  });
}

export { useActiveStudents, useActiveUsers, useCreateUser, useUpdateUser, useUsers, type User };
