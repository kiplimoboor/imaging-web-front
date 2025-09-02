import { useMutation, useQuery } from "@tanstack/react-query";

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

function useGetStudies(radiologist?: number) {
  return useQuery<Study[]>({
    queryKey: ["studies"],
    queryFn: () => getStudies(radiologist),
    // staleTime: Infinity,
    // queryFn: async (): Promise<Study[]> => studies,
  });
}

async function getStudies(radiologist?: number): Promise<Study[]> {
  const url_params = new URLSearchParams();
  if (radiologist) url_params.append("radiologist", radiologist.toString());
  const res = await fetch(API_URL + "/assignments?" + url_params);
  const data: Study[] = await res.json();
  return data;
}

function useAssignment() {
  return useMutation({
    mutationFn: async ({ dicom_uid, radiologist_id }: AssignmentCreate) => {
      const res = await fetch(API_URL + "/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dicom_uid, radiologist: radiologist_id }),
      });
      return res.status;
    },
  });
}

export { useAssignment, useGetStudies, type Study };
