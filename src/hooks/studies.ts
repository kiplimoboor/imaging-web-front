import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Study } from "@/types";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

type GetStudiesFilters = { radiologist?: number; student?: number; status?: number };
function useGetStudies(filters?: GetStudiesFilters) {
	const { radiologist, student, status } = filters ?? {};
	const filterParams = [];
	const searchParams = new URLSearchParams();
	if (radiologist !== undefined) {
		searchParams.append("radiologist", radiologist.toString());
		filterParams.push(radiologist);
	}
	if (student !== undefined) {
		searchParams.append("student", student.toString());
		filterParams.push(student);
	}
	if (status !== undefined) {
		searchParams.append("status", status.toString());
		filterParams.push(status);
	}
	return useQuery<Study[]>({
		queryKey: ["studies", filterParams],
		queryFn: async () => {
			const res = await fetch(API_URL + "/studies?" + searchParams.toString(), { credentials: "include" });
			const data: Study[] = await res.json();
			return data;
		},
	});
}

function useUserStudies() {
	const { user } = useAuth();
	const { data: allStudies } = useGetStudies({});
	const isRadiologist = user?.role === "System User" || user?.role === "Administrator";

	const newStudies = useMemo(() => {
		if (!allStudies) return [];
		return allStudies.filter((study) => (isRadiologist ? study.radiologist === user?.id : study.student == user?.id));
	}, [allStudies]);

	return { data: newStudies };
}

type StudyUpdateFields = { patient_id?: string; student?: number; radiologist?: number; status?: number };
type UpdateStudyPayload = { id: number; data: StudyUpdateFields };
function useUpdateStudy() {
	return useMutation({
		mutationFn: async ({ id, data }: UpdateStudyPayload) => {
			await fetch(API_URL + "/studies/" + id, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(data),
			});
		},
	});
}

function useNewStudies() {
	const { data: allStudies } = useGetStudies({ status: 0 });

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

export { useNewStudies, useGetStudies, useUserStudies, useCompleteStudies, useUpdateStudy, type Study };
