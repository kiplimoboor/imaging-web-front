import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";
import { loginRedirect } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function useUsers() {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch(API_URL + "/users", { credentials: "include" });
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

type UserUpdateFields = { full_name?: string; email?: string; role?: string; status?: number };
type UserUpdatePayload = { id: number; data: UserUpdateFields };
function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: UserUpdatePayload) => {
			await fetch("http://127.0.0.1:3000/users/" + id, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
	});
}

export { useCreateUser, useUpdateUser, useUsers };
