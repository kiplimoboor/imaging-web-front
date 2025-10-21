type User = {
	id: number;
	full_name: string;
	email: string;
	status: number;
	role: string;
	admin: boolean;
};

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

export type { User, Study };
