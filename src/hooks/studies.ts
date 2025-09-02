import { useMutation, useQuery } from "@tanstack/react-query";
import { studies } from "../data/test";

const API_URL = import.meta.env.VITE_API_URL;

interface Study {
  id: number;
  dicom_uid: string;
  patient_id: string;
  patient_name: string;
  study_date: string;
  modalities: string[];
  status: 0 | 1 | 2;
}

type AssignmentCreate = {
  dicom_uid: string;
  radiologist_id: number;
};

function useGetStudies() {
  return useQuery<Study[]>({
    queryKey: ["studies"],
    queryFn: getStudies,
    // staleTime: Infinity,
    // queryFn: async (): Promise<Study[]> => studies,
  });
}

function useAssignment() {
  return useMutation({
    mutationFn: async ({ dicom_uid, radiologist_id }: AssignmentCreate) => {
      const res = await fetch(API_URL + "/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dicom_uid, radiologist_id }),
      });
      return res.status;
    },
  });
}

async function getStudies(): Promise<Study[]> {
  const res = await fetch(API_URL + "/assignments");
  const data: Study[] = await res.json();
  return data;
}

export { useAssignment, useGetStudies, type Study };
