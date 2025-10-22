import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from "material-react-table";
import React, { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { type Study, useRadiologistStudies } from "../hooks/studies";
import { studyStatusMap } from "../utils/constants";
import { handlePrint } from "../utils/printer";
import BaseTable from "./BaseTable";
import PatientDetailsModal from "./PatientDetailsModal";
import StatusPill from "./StatusPill";

function CompletedStudies() {
	const { data: studies } = useRadiologistStudies();
	const [patientModalOpen, setPatientModalOpen] = useState(false);
	const [currentStudy, setCurrentStudy] = useState<Study | null>(null);

	const memoizedModalSet = useCallback(setPatientModalOpen, []);
	const memoizedStudySet = useCallback(setCurrentStudy, []);

	const queryClient = useQueryClient();

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		return [
			{ accessorKey: "patient_id", header: "MRN", size: 50 },
			{ accessorKey: "patient_name", header: "Patient Name" },
			{ accessorKey: "dob", header: "Date of Birth", size: 50 },
			{ accessorKey: "gender", header: "Gender", size: 50 },
			{
				accessorKey: "study_date",
				header: "Study Date",
				size: 50,
				enableEditing: false,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
			{
				header: "Examination",
				accessorFn: (row): string => {
					if (!row.modalities) return row.examination;
					if (!row.examination) return String(row.modalities);
					return row.modalities + " - " + row.examination.replace("^MTRH", " ");
				},
				enableEditing: false,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
			{
				header: "Status",
				id: "status",
				size: 50,
				accessorFn: (row) => studyStatusMap[row.status].text,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={studyStatusMap} />,
				enableEditing: false,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
			{
				accessorKey: "radiologist_name",
				header: "Radiologist",
				size: 50,
				enableEditing: false,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
			{ accessorKey: "examination", header: "Examination", size: 50 },
			{
				accessorKey: "dicom_uid",
				header: "UID",
				size: 50,
				enableEditing: false,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
		];
	}, []);

	const renderRowActions = useCallback(
		({ row, table }: { row: MRT_Row<Study>; table: MRT_TableInstance<Study> }) => (
			<RowActions row={row} setPatientModalOpen={memoizedModalSet} setCurrentStudy={memoizedStudySet} table={table} />
		),
		[memoizedModalSet, memoizedStudySet],
	);

	const moreTableProps = {
		editDisplayMode: "modal",
		onEditingRowSave: async ({ values, table }: { values: Study; table: MRT_TableInstance<Study> }) => {
			const { patient_id, patient_name, examination, dob, dicom_uid, gender } = values;

			await fetch("https://radiology.mtrh.go.ke/api/studies/modify/" + dicom_uid, {
				method: "PUT",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ patient_id, patient_name, examination, dob, gender }),
			});

			queryClient.invalidateQueries({ queryKey: ["studies", "all"] });
			table.setEditingRow(null);
		},
	};

	const initial = { columnVisibility: { examination: false, dob: false, dicom_uid: false, gender: false } };

	return (
		<>
			<BaseTable
				data={studies}
				columns={columns}
				rowActions={renderRowActions}
				others={moreTableProps}
				intial={initial}
			/>
			<PatientDetailsModal open={patientModalOpen} setOpen={setPatientModalOpen} study={currentStudy} />
		</>
	);
}

type RowActionsProps = {
	table: MRT_TableInstance<Study>;
	row: MRT_Row<Study>;
	setPatientModalOpen: Dispatch<SetStateAction<boolean>>;
	setCurrentStudy: Dispatch<SetStateAction<Study | null>>;
};

const RowActions = React.memo(({ row, setPatientModalOpen, setCurrentStudy, table }: RowActionsProps) => {
	const [_, setPdfLoading] = useState(false);
	const rowData = row.original;

	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<IconButton onClick={() => window.open("viewer/" + rowData.dicom_uid)}>
					<Tooltip title="View Study">
						<VisibilityIcon />
					</Tooltip>
				</IconButton>

				<IconButton onClick={() => handlePrint({ setPdfLoading, rowData, setCurrentStudy, setPatientModalOpen })}>
					<span style={{ display: "flex", width: "100%", height: "100%" }}>
						<PictureAsPdfIcon />
					</span>
				</IconButton>

				<IconButton onClick={() => table.setEditingRow(row)}>
					<span style={{ display: "flex", width: "100%", height: "100%" }}>
						<EditIcon />
					</span>
				</IconButton>
			</Box>
		</>
	);
});

export default CompletedStudies;
