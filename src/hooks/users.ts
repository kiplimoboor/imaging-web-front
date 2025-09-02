import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { users } from "../data/test";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  full_name: string;
  email: string;
  status: number;
  role: string;
}

type UserCreate = {
  full_name: string;
  email: string;
  role: string;
};
type UserUpdate = {
  id: number;
  field: string;
  value: string;
};

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

function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    // queryFn: async (): Promise<User[]> => users,
    staleTime: Infinity,
    queryFn: async (): Promise<User[]> => {
      const res = await fetch(API_URL + "/users");
      const data: User[] = await res.json();
      return data;
    },
  });
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

export { useCreateUser, useGetUsers, useUpdateUser, type User };
