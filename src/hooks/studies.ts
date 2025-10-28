import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Study } from "@/types";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

type AssignmentCreate = { dicom_uid: string; radiologist_id: number };

function useGetStudies() {
	return useQuery<Study[]>({
		queryKey: ["studies", "all"],
		queryFn: async () => {
			const res = await fetch(API_URL + "/studies", { credentials: "include" });
			const data: Study[] = await res.json();
			return data;
		},
	});
}

function useUserStudies() {
	const { user } = useAuth();
	return useQuery<Study[]>({
		queryKey: ["studies", user?.id],
		queryFn: async (): Promise<Study[]> => {
			let url;
			if (user?.role === "System User" || user?.role === "Administrator") {
				url = API_URL + "/studies?radiologist=" + user.id;
			} else url = API_URL + "/studies?student=" + user?.id;
			const res = await fetch(url, { credentials: "include" });
			const data: Study[] = await res.json();
			return data;
		},
	});
}

function useNewStudies() {
	const { data: allStudies } = useGetStudies();

	const newStudies = useMemo(() => {
		if (!allStudies) return [];
		return allStudies.filter((study) => study.status === 0);
	}, [allStudies]);

	return { data: newStudies };
}

function useCompleteStudies() {
	return useQuery<Study[]>({
		queryKey: ["studies", "complete"],
		queryFn: async (): Promise<Study[]> => {
			const res = await fetch(API_URL + "/studies?status=4", { credentials: "include" });
			const data: Study[] = await res.json();
			return data;
		},
	});
}

function useAssignment() {
	return useMutation({
		mutationFn: async ({ dicom_uid, radiologist_id }: AssignmentCreate) => {
			const res = await fetch(API_URL + "/studies", {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ dicom_uid, radiologist: radiologist_id }),
			});
			return res;
		},
	});
}

function useStudentAssignment() {
	return useMutation({
		mutationFn: async ({ dicom_uid, radiologist_id }: AssignmentCreate) => {
			const res = await fetch(API_URL + "/studies/student", {
				credentials: "include",
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ dicom_uid, student: radiologist_id }),
			});
			return res;
		},
	});
}

export {
	useAssignment,
	useNewStudies,
	useStudentAssignment,
	useGetStudies,
	useUserStudies,
	useCompleteStudies,
	type Study,
};
