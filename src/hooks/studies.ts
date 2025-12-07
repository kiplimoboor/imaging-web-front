import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { Study } from "@/types";

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

type FilterProp = { id: string; value: unknown };
function useStudies(filters: FilterProp[] = []) {
	return useQuery<Study[]>({
		queryKey: ["studies", filters],
		staleTime: Infinity,
		refetchOnWindowFocus: "always",
		refetchOnMount: false,
		placeholderData: keepPreviousData,
		queryFn: async () => {
			const searchParams = new URLSearchParams();
			filters.forEach((parameter) => searchParams.set(parameter.id, String(parameter.value)));
			const res = await fetch("https://radiology.mtrh.go.ke/api/studies?" + searchParams.toString(), {
				credentials: "include",
			});
			const data: Study[] = await res.json();
			return data;
		},
	});
}

type StudyUpdateFields = { patient_id?: string; student?: number | null; radiologist?: number | null; status?: number };
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

export { useGetStudies, useUpdateStudy, useStudies };
