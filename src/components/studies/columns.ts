import type { MRT_ColumnDef } from "material-react-table";
import type { Study } from "@/types";

const hiddenEdit = { style: { display: "none" } };
const commonColumns: MRT_ColumnDef<Study>[] = [
	{ accessorKey: "patient_id", header: "MRN", size: 50 },
	{ accessorKey: "patient_name", header: "Patient Name" },
	{ accessorKey: "study_date", header: "Study Date", size: 50, muiEditTextFieldProps: hiddenEdit },
	{
		header: "Examination",
		accessorFn: (row) => {
			const { modalities, examination } = row;
			if (!modalities) return examination ?? "";
			if (!examination) return String(modalities);
			return `${modalities}-${examination.replace("^MTRH", " ")}`;
		},
		muiEditTextFieldProps: hiddenEdit,
	},
];

const hiddenColumns: MRT_ColumnDef<Study>[] = [
	{ accessorKey: "dob", header: "Date of Birth" },
	{ accessorKey: "gender", header: "Gender" },
	{ accessorKey: "examination", header: "Examination" },
];

const commonInitialHide = { columnVisibility: { examination: false, dob: false, dicom_uid: false, gender: false } };

export { commonColumns, hiddenColumns, commonInitialHide, hiddenEdit };
