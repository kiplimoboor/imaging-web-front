import CheckIcon from "@mui/icons-material/Check";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import React, { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import { useAuth } from "../context/AuthContext";
import { type Study, useAssignment, useStudentAssignment, useStudies } from "../hooks/studies";
import { type User, useActiveUsers } from "../hooks/users";
import type { StudyStatus } from "../utils/constants";
import { handlePrint } from "../utils/printer";
import PatientDetailsModal from "./PatientDetailsModal";
import StatusPill from "./StatusPill";

function AllStudies() {
	const { data: studies } = useStudies();
	const [patientModalOpen, setPatientModalOpen] = useState(false);
	const [currentStudy, setCurrentStudy] = useState<Study | null>(null);

	const memoizedModalSet = useCallback(setPatientModalOpen, []);
	const memoizedStudySet = useCallback(setCurrentStudy, []);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		return [
			{ accessorKey: "patient_id", header: "MRN", size: 50 },
			{ accessorKey: "patient_name", header: "Patient Name" },
			{ accessorKey: "study_date", header: "Study Date", size: 50 },
			{
				header: "Examination",
				accessorFn: (row): string => {
					if (!row.modalities) return row.examination;
					if (!row.examination) return String(row.modalities);
					return row.modalities + " - " + row.examination.replace("^MTRH", " ");
				},
			},
			{
				header: "Status",
				id: "status",
				size: 50,
				Cell: ({ row }) => {
					const statusMap: StudyStatus = {
						0: { text: "New Study", color: "primary" },
						1: { text: "Assigned", color: "warning" },
						2: { text: "Resident", color: "secondary" },
						3: row.original.student ? { text: "Resident", color: "secondary" } : { text: "Assigned", color: "warning" },
						4: { text: "Completed", color: "success" },
					};
					return <StatusPill status={row.original.status} map={statusMap} />;
				},
			},
			{
				header: "Radiologist",
				accessorFn: (row) => (row.student_name ? row.student_name : row.radiologist_name),
			},
		];
	}, []);

	const renderRowActions = useCallback(
		({ row }: { row: MRT_Row<Study> }) => (
			<RowActions row={row} setPatientModalOpen={memoizedModalSet} setCurrentStudy={memoizedStudySet} />
		),
		[memoizedModalSet, memoizedStudySet],
	);

	return (
		<>
			<BaseTable data={studies} columns={columns} rowActions={renderRowActions} />
			<PatientDetailsModal open={patientModalOpen} setOpen={setPatientModalOpen} study={currentStudy} />
		</>
	);
}

type RowActionsProps = {
	row: MRT_Row<Study>;
	setPatientModalOpen: Dispatch<SetStateAction<boolean>>;
	setCurrentStudy: Dispatch<SetStateAction<Study | null>>;
};

const RowActions = React.memo(({ row, setPatientModalOpen, setCurrentStudy }: RowActionsProps) => {
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
	const [pdfLoading, setPdfLoading] = useState(false);
	const { data: radiologists } = useActiveUsers();
	const queryClient = useQueryClient();
	const radiologistMutation = useAssignment();
	const registrarMutation = useStudentAssignment();
	const rowData = row.original;
	const { user, isPrivileged } = useAuth();

	const handleAssign = (radiologist: User, dicom_uid: string) => {
		queryClient.setQueryData(["studies", "all"], (old: Study[]) =>
			old.map((study) => {
				if (study.id === rowData.id) {
					if (radiologist.role === "Registrar") return { ...study, status: 2, student_name: radiologist.full_name };
					return { ...study, status: 1, radiologist_name: radiologist.full_name };
				} else {
					return study;
				}
			}),
		);

		if (radiologist.role === "Registrar") {
			registrarMutation.mutate(
				{ dicom_uid, radiologist_id: radiologist.id },
				{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies", user?.id] }) },
			);
		} else {
			radiologistMutation.mutate(
				{ dicom_uid, radiologist_id: radiologist.id },
				{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies", user?.id] }) },
			);
		}
		setMenuAnchor(null);
	};

	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => {
						if (rowData.status === 0) {
							return window.open("https://radiology.mtrh.go.ke/ohif/viewer?StudyInstanceUIDs=" + rowData.dicom_uid);
						}
						return window.open("viewer/" + rowData.dicom_uid);
					}}
				>
					<Tooltip title="View Study">
						<VisibilityIcon />
					</Tooltip>
				</IconButton>
				{isPrivileged && (
					<IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} disabled={rowData.status > 1}>
						<Tooltip title="Assign to Radiologist">
							<PersonAddIcon />
						</Tooltip>
					</IconButton>
				)}

				{user && (
					<IconButton onClick={() => handleAssign(user, rowData.dicom_uid)} disabled={rowData.status > 0}>
						<Tooltip title="Self Assign">
							<CheckIcon />
						</Tooltip>
					</IconButton>
				)}
				{rowData.status === 4 && (
					<IconButton onClick={() => handlePrint({ setPdfLoading, rowData, setCurrentStudy, setPatientModalOpen })}>
						<span style={{ display: "flex", width: "100%", height: "100%" }}>
							{pdfLoading ? <CircularProgress size="1rem" /> : <PictureAsPdfIcon />}
						</span>
					</IconButton>
				)}

				<Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} keepMounted>
					<Box sx={{ px: 2, py: 1 }}>
						<Typography variant="subtitle1" color="textSecondary">
							Available Radiologists
						</Typography>
					</Box>
					{radiologists?.map((radiologist) => (
						<MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist, rowData.dicom_uid)}>
							{radiologist.full_name}
						</MenuItem>
					))}
				</Menu>
			</Box>
		</>
	);
});

export default AllStudies;
