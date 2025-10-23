import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { type User, useActiveUsers } from "@/hooks/users";
import { type Study, useStudentStudies } from "../hooks/studies";
import { studyStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import StatusPill from "./StatusPill";

const API_URL = import.meta.env.VITE_API_URL;

function StudentStudies() {
	const { data: studies } = useStudentStudies();
	const queryClient = useQueryClient();
	const { user } = useAuth();

	// NOTE: Column Definition
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
				accessorFn: (row) => studyStatusMap[row.status].text,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={studyStatusMap} />,
			},
			{ accessorKey: "radiologist_name", header: "Reviewer", size: 50 },
		];
	}, []);

	// NOTE: Row Actions Definition
	const RowActions = ({ row }: { row: MRT_Row<Study> }) => {
		const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
		const { data: radiologists } = useActiveUsers();

		const chooseReviewer = async (study: Study, radiologist: User) => {
			await fetch(API_URL + "/studies/review", {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ radiologist: radiologist.id, dicom_uid: study.dicom_uid }),
			});

			queryClient.setQueryData(["studies", user?.id], (old: Study[]) =>
				old.map((study) => {
					if (study.id === row.original.id) return { ...study, radiologist_name: radiologist.full_name };
					return study;
				}),
			);

			setMenuAnchor(null);
		};

		return (
			<>
				<Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton onClick={() => window.open("viewer/" + row.original.dicom_uid)}>
							<Tooltip title="View Study">
								<VisibilityIcon />
							</Tooltip>
						</IconButton>

						<IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
							<Tooltip title="Request for Review">
								<PersonAddIcon />
							</Tooltip>
						</IconButton>
					</Box>
				</Box>

				<Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} keepMounted>
					<Box sx={{ px: 2, py: 1 }}>
						<Typography variant="subtitle1" color="textSecondary">
							Available Radiologists
						</Typography>
					</Box>
					{radiologists?.map((radiologist) => (
						<MenuItem key={radiologist.id} onClick={() => chooseReviewer(row.original, radiologist)}>
							{radiologist.full_name}
						</MenuItem>
					))}
				</Menu>
			</>
		);
	};

	return <BaseTable data={studies} columns={columns} rowActions={RowActions} />;
}
export default StudentStudies;
