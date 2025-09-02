import { type Study } from "../hooks/studies";
import { type User } from "../hooks/users";

const users: User[] = [
  { id: 1, full_name: "John", email: "john@test.com", role: "Administrator", status: 0 },
  { id: 2, full_name: "Jane", email: "jane@test.com", role: "Administrator", status: 1 },
  { id: 3, full_name: "Peter", email: "peter@test.com", role: "System User", status: 1 },
  { id: 4, full_name: "Sarah", email: "sarah@test.com", role: "System User", status: 1 },
  { id: 5, full_name: "David", email: "david@test.com", role: "System User", status: 0 },
];

const studies: Study[] = [
  {
    id: 1,
    dicom_uid: "1.2.3",
    status: 0,
    patient_name: "John Doe",
    modalities: ["DX", "CT"],
    study_date: "20230521",
    patient_id: "12",
  },
  {
    id: 2,
    dicom_uid: "1.2.4",
    status: 1,
    patient_name: "Jane Smith",
    modalities: ["MR", "US"],
    study_date: "20230615",
    patient_id: "13",
  },
  {
    id: 3,
    dicom_uid: "1.2.5",
    status: 2,
    patient_name: "Robert Johnson",
    modalities: ["CT"],
    study_date: "20230702",
    patient_id: "14",
  },
  {
    id: 4,
    dicom_uid: "1.2.6",
    status: 0,
    patient_name: "Emily Davis",
    modalities: ["US"],
    study_date: "20230810",
    patient_id: "15",
  },
  {
    id: 5,
    dicom_uid: "1.2.7",
    status: 1,
    patient_name: "Michael Brown",
    modalities: ["MR"],
    study_date: "20230905",
    patient_id: "16",
  },
  {
    id: 6,
    dicom_uid: "1.2.8",
    status: 2,
    patient_name: "Jessica Wilson",
    modalities: ["DX", "US"],
    study_date: "20231018",
    patient_id: "17",
  },
  {
    id: 7,
    dicom_uid: "1.2.9",
    status: 0,
    patient_name: "William Miller",
    modalities: ["CT", "MR"],
    study_date: "20231125",
    patient_id: "18",
  },
  {
    id: 8,
    dicom_uid: "1.2.10",
    status: 1,
    patient_name: "Olivia Moore",
    modalities: ["DX"],
    study_date: "20231201",
    patient_id: "19",
  },
  {
    id: 9,
    dicom_uid: "1.2.11",
    status: 2,
    patient_name: "James Taylor",
    modalities: ["MR"],
    study_date: "20240108",
    patient_id: "20",
  },
  {
    id: 10,
    dicom_uid: "1.2.12",
    status: 0,
    patient_name: "Sophia Anderson",
    modalities: ["CT", "US"],
    study_date: "20240214",
    patient_id: "21",
  },
];

const studyStatusMap: Record<number, { text: string; color: "warning" | "primary" | "success" }> = {
  0: { text: "New Study", color: "primary" },
  1: { text: "Assigned", color: "warning" },
  2: { text: "Completed", color: "success" },
};

const userStatusMap: Record<number, { text: string; color: "error" | "primary" }> = {
  0: { text: "Inactive", color: "error" },
  1: { text: "Active", color: "primary" },
};

export { studies, studyStatusMap, users, userStatusMap };
