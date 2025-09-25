import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
// import { studies } from "../data/test";

const API_URL = import.meta.env.VITE_API_URL;

interface Study {
  id: number;
  dicom_uid: string;
  patient_id: string;
  patient_name: string;
  study_date: string;
  modalities: string[];
  status: 0 | 1 | 2;
  radiologist: number | null;
  student: number;
  radiologist_name: string | null;
}

type AssignmentCreate = { dicom_uid: string; radiologist_id: number };

function useStudies() {
  return useQuery<Study[]>({
    queryKey: ["studies", "all"],
    queryFn: () => getStudies(),
  });
}

function useStudentStudies() {
  const { user } = useAuth();
  return useQuery<Study[]>({
    queryKey: ["studies", user?.id],
    queryFn: () => getStudentStudies(user?.id),
  });
}

function useRadiologistStudies() {
  const { user } = useAuth();
  return useQuery<Study[]>({
    queryKey: ["studies", user?.id],
    queryFn: () => getStudies(user?.id),
  });
}

function useNewStudies() {
  const { data: allStudies } = useStudies();

  const newStudies = useMemo(() => {
    if (!allStudies) return [];
    return allStudies.filter((study) => study.status === 0);
  }, [allStudies]);

  return { data: newStudies };
}

async function getStudies(radiologist?: number): Promise<Study[]> {
  const url_params = new URLSearchParams();
  if (radiologist) url_params.append("radiologist", radiologist.toString());
  const res = await fetch(API_URL + "/studies?" + url_params, { credentials: "include" });
  const data: Study[] = await res.json();
  return data;
}

async function getStudentStudies(student?: number): Promise<Study[]> {
  const url_params = new URLSearchParams();
  if (student) url_params.append("student", student.toString());
  const res = await fetch(API_URL + "/studies/student?" + url_params, { credentials: "include" });
  const data: Study[] = await res.json();
  return data;
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
  useRadiologistStudies,
  useStudentAssignment,
  useStudentStudies,
  useStudies,
  type Study,
};
