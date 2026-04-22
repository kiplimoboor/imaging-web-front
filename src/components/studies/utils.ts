import type { Study } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

async function studyUpdate(id: number, values: Study) {
  const { patient_id, patient_name, examination, dob, gender } = values;
  await fetch(API_URL + "/studies/" + id, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient_id, patient_name, examination, dob, gender }),
  });
}

export { studyUpdate };
