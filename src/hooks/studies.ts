import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { Study } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

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
      const res = await fetch(API_URL + "/studies?" + searchParams.toString(), {
        credentials: "include",
      });
      const data: Study[] = await res.json();
      return data;
    },
  });
}

type StudyUpdateFields = {
  patient_id?: string;
  patient_name?: string;
  examination?: string;
  dob?: string;
  gender?: string;
  student?: number | null;
  radiologist?: number | null;
  status?: number;
};

type UpdateStudyPayload = { id: number; data: StudyUpdateFields };
function useUpdateStudy() {
  return useMutation({
    mutationFn: async ({ id, data }: UpdateStudyPayload) => {
      const { patient_id, patient_name, examination, dob, gender, student, radiologist, status } = data;
      await fetch(API_URL + "/studies/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ patient_id, patient_name, examination, dob, gender, student, radiologist, status }),
      });
    },
  });
}

export { useStudies, useUpdateStudy };
