import { type Study } from "../hooks/studies";
import { type User } from "../hooks/users";

const users: User[] = [
  { id: 1, full_name: "John Doe", email: "john@test.com", role: "Support", status: 1, admin: true, studies: 2 },
  { id: 2, full_name: "Jane", email: "jane@test.com", role: "Administrator", status: 1, admin: false, studies: 0 },
  { id: 3, full_name: "Peter", email: "peter@test.com", role: "System User", status: 1, admin: true, studies: 0 },
  { id: 4, full_name: "Sarah", email: "sarah@test.com", role: "System User", status: 1, admin: true, studies: 0 },
  { id: 5, full_name: "David", email: "david@test.com", role: "System User", status: 0, admin: false, studies: 0 },
];

const studies: Study[] = [
  {
    id: 1,
    dicom_uid: "1.2.3",
    status: 1,
    patient_name: "John Doe",
    modalities: ["DX", "CT"],
    study_date: "20230521",
    patient_id: "12",
    radiologist: 1,
    radiologist_name: "John Doe",
    student: 1,
  },
];

type StudyStatus = Record<number, { text: string; color: "warning" | "primary" | "success" | "error" | "secondary" }>;
const studyStatusMap: StudyStatus = {
  0: { text: "New Study", color: "primary" },
  1: { text: "Assigned", color: "warning" },
  2: { text: "Resident", color: "secondary" },
  3: { text: "Draft", color: "error" },
  4: { text: "Completed", color: "success" },
};

const userStatusMap: Record<number, { text: string; color: "error" | "primary" }> = {
  0: { text: "Inactive", color: "error" },
  1: { text: "Active", color: "primary" },
};

export { studies, studyStatusMap, users, userStatusMap };
