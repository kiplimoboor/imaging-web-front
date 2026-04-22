import type { MRT_Row, MRT_TableInstance } from "material-react-table";

type User = {
  id: number;
  full_name: string;
  email: string;
  status: number;
  role:
    | "Administrator"
    | "Registrar"
    | "Support"
    | "Secretary"
    | "Radiologist"
    | "Guest"
    | "System User"
    | "Radiographer"
    | "Auditor";
  admin: boolean;
};

type UserTableInstance = MRT_TableInstance<User>;

type Study = {
  accession: string;
  id: number;
  dicom_uid: string;
  patient_id: string;
  patient_name: string;
  gender: string;
  dob: string;
  examination: string;
  study_date: string;
  modalities: string;
  status: 0 | 1 | 2 | 3 | 4;
  radiologist: number | null;
  student: number | null;
  radiologist_name: string | null;
  student_name: string | null;
  note: string | null;
  created_at: string;
};

type StudyTableInstance = MRT_TableInstance<Study>;

type Actions = "assign" | "self-assign" | "edit" | "pdf" | "review" | "note";

type RowActionsProps = { table?: StudyTableInstance; row: MRT_Row<Study>; actions?: Actions[] };

type StudyStatusDetails = {
  text: string;
  color: "warning" | "primary" | "success" | "error" | "secondary" | "info";
};

type StudyStatusMap = Record<number, StudyStatusDetails>;

type EditingRowSaveArgs = { values: Study; table: MRT_TableInstance<Study>; row: MRT_Row<Study> };

type AlertFunction = (type: "info" | "success" | "error", message: string) => void;

export type {
  Actions,
  AlertFunction,
  EditingRowSaveArgs,
  RowActionsProps,
  Study,
  StudyStatusMap,
  StudyTableInstance,
  User,
  UserTableInstance,
};
