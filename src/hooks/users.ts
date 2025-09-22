import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
// import { users } from "../data/test";

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

function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ full_name, email, role }: UserCreate) => {
      await fetch(API_URL + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, role }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

function useUsers() {
  return useQuery<User[]>({ queryKey: ["users"], staleTime: Infinity, queryFn: () => fetchUsers() });
}

function useActiveUsers() {
  const { data: users } = useUsers();

  const activeUsers = useMemo(() => users?.filter((user) => user.status === 1), [users]);
  return { data: activeUsers };
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(API_URL + "/users");
  const data: User[] = await res.json();
  return data;
  // return new Promise((resolve) => setTimeout(() => resolve(users), 500));
}

function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ id, field, value }: UserUpdate) => {
      const res = await fetch(API_URL + "/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value }),
      });
      return res.status;
    },
  });
}

export { useActiveUsers, useCreateUser, useUpdateUser, useUsers, type User };
