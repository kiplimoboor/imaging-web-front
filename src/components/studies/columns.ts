import type { MRT_ColumnDef } from "material-react-table";
import type { Study } from "@/types";

const hiddenEdit = { style: { display: "none" } };

const commonColumns: MRT_ColumnDef<Study>[] = [
	{ accessorKey: "patient_id", header: "MRN", size: 50 },
	{ accessorKey: "patient_name", header: "Patient Name" },
	{
		accessorKey: "study_date",
		header: "Study Date",
		size: 50,
		muiEditTextFieldProps: { style: { display: "none" } },
		enableColumnFilter: false,
	},
	{
		header: "Examination",
		accessorFn: (row) => {
			const { modalities, examination } = row;

			const formattedModalities = modalities ? modalities.split("\\")[0] : "";
			let formattedExamination = "";

			if (examination) {
				let tempExamination = examination.replace(/^MTRH|\^MTRH/i, " ").trim();
				const internalDupeRegex = /^(\w+)\s*(\1\s*)(.*)$/i;
				const match = tempExamination.match(internalDupeRegex);
				if (match) {
					const word1 = match[1];
					const restOfString = match[3] ? match[3].trim() : "";
					formattedExamination = `${word1} ${restOfString}`.trim();
				} else formattedExamination = tempExamination.split(/\s+/).slice(0, 3).join(" ");
			}
			if (!examination) return formattedModalities;
			if (!modalities) return formattedExamination;

			return `${formattedModalities}-${formattedExamination}`;
		},
		muiEditTextFieldProps: { style: { display: "none" } },
		enableColumnFilter: false,
	},
];

const commonInitialHide = { columnVisibility: { examination: false, dob: false, dicom_uid: false, gender: false } };

const hiddenColumns: MRT_ColumnDef<Study>[] = [
	{ accessorKey: "dob", header: "Date of Birth" },
	{ accessorKey: "gender", header: "Gender" },
	{ accessorKey: "examination", header: "Examination" },
];

export { commonColumns, hiddenColumns, commonInitialHide, hiddenEdit };
