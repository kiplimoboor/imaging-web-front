import type { MRT_Row, MRT_TableInstance } from "material-react-table";

type User = {
	id: number;
	full_name: string;
	email: string;
	status: number;
	role: string;
	admin: boolean;
};

type UserTableInstance = MRT_TableInstance<User>;

type Study = {
	id: number;
	dicom_uid: string;
	patient_id: string;
	patient_name: string;
	gender: string;
	dob: string;
	examination: string;
	study_date: string;
	modalities: string[];
	status: 0 | 1 | 2 | 3 | 4;
	radiologist: number | null;
	student: number;
	radiologist_name: string | null;
	student_name: string | null;
	note: string | null;
};

type StudyTableInstance = MRT_TableInstance<Study>;

type Actions = "assign" | "self-assign" | "edit" | "pdf" | "review";

type RowActionsProps = { table?: StudyTableInstance; row: MRT_Row<Study>; actions?: Actions[] };

type StudyStatusDetails = {
	text: string;
	color: "warning" | "primary" | "success" | "error" | "secondary";
};

type StudyStatusMap = Record<number, StudyStatusDetails>;

type EditingRowSaveArgs = { values: Study; table: MRT_TableInstance<Study>; row: MRT_Row<Study> };

export type {
	User,
	Study,
	StudyStatusMap,
	Actions,
	RowActionsProps,
	EditingRowSaveArgs,
	UserTableInstance,
	StudyTableInstance,
};
