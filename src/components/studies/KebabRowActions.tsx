import { Delete, Edit, NoteAlt, PersonAdd, PersonRemove, PictureAsPdf, Visibility } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Menu,
	MenuItem,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { MRT_ActionMenuItem, type MRT_Row, type MRT_TableInstance } from "material-react-table";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateStudy } from "@/hooks/studies";
import { useUsers } from "@/hooks/users";
import type { Study, User } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

function rowActions(table: MRT_TableInstance<Study>, row: MRT_Row<Study>) {
	const { status, accession } = row.original;
	const actions = [<View key="view" table={table} study={row.original} />];
	if (/^\d{7}$/.test(accession)) {
		actions.push(<RequestNote accession={accession} key="request" table={table} />);
	}
	if (status == 0) {
		actions.push(<Assign id={row.original.id} key="assign" table={table} />);
	}
	if (status > 0) {
		actions.push(<Unassign id={row.original.id} key="remove" table={table} />);
	}
	actions.push(
		<MRT_ActionMenuItem
			icon={<Edit />}
			key="edit"
			label="Edit"
			onClick={() => table.setEditingRow(row)}
			table={table}
		/>,
	);
	if (status === 4) {
		actions.push(<GeneratePdf key="pdf" row={row} table={table} />);
	}
	actions.push(<DeleteStudy study={row.original} table={table} key="delete" />);
	return actions;
}

function View({ study, table }: { study: Study; table: MRT_TableInstance<Study> }) {
	const { user } = useAuth();

	const handleClick = () => {
		// due to the orthanc crash on march 6 2026, images before the date are archived
		const archived = new Date(study.created_at) < new Date("2026-02-06T00:00:00.000Z");
		if (study.status === 0 || (user?.role === "Guest" && study.status != 4)) {
			window.open(
				`https://radiology.mtrh.go.ke/images${archived ? "-archive" : ""}/viewer?StudyInstanceUIDs=${study.dicom_uid}`,
			);
		} else {
			window.open(`viewer?viewer=images${archived ? "-archive" : ""}&uid=${study.dicom_uid}`);
		}
	};

	return <MRT_ActionMenuItem icon={<Visibility />} label="View" table={table} onClick={handleClick} />;
}

function RequestNote({ accession, table }: { accession: string; table: MRT_TableInstance<Study> }) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [notes, setNotes] = useState("");

	const fetchNotes = async (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		const procedure = "HLC-CPR-20" + accession.slice(0, 2) + "-" + accession.slice(2);
		const url = `https://portal.mtrh.go.ke/api/resource/Clinical Procedure?filters=[["name", "=", "${procedure}"]]&fields=["notes"]`;
		try {
			const res = await fetch(url);
			if (!res.ok) {
				return;
			}

			const { data } = await res.json();
			if (data && data.length > 0) {
				setNotes(data[0].notes);
			}
		} catch (error) {
			console.error("failed to fetch notes:", error);
		}
	};

	return (
		<>
			<MRT_ActionMenuItem icon={<NoteAlt />} label="Notes" table={table} onClick={(e) => fetchNotes(e)} />
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				slotProps={{
					paper: { style: { minWidth: anchorEl ? anchorEl.clientWidth : "180px", maxWidth: "300px", maxHeight: 450 } },
				}}
			>
				<div className="p-2 w-72">
					<h1 className="font-bold mb-2">Request Note</h1>
					<p className="whitespace-pre-wrap">{notes}</p>
				</div>
			</Menu>
		</>
	);
}

function Assign({ table, id }: { table: MRT_TableInstance<Study>; id: number }) {
	const { data } = useUsers();
	const queryClient = useQueryClient();
	const mutation = useUpdateStudy();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const radiologists = data?.filter((user) => {
		return user.status == 1 && (user.role === "Radiologist" || user.role === "Registrar");
	});

	const handleAssign = (radiologist: User) => {
		const isRegistrar = radiologist.role === "Registrar";
		let updateData: any = {};
		if (isRegistrar) {
			updateData.student = radiologist.id;
			updateData.status = 2;
		} else {
			updateData.radiologist = radiologist.id;
			updateData.status = 1;
		}
		mutation.mutate(
			{ id, data: updateData },
			{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies"] }) },
		);
		setAnchorEl(null);
	};

	return (
		<>
			<MRT_ActionMenuItem
				icon={<PersonAdd />}
				key="assign"
				label="Assign"
				onClick={(e) => setAnchorEl(e.currentTarget)}
				table={table}
			/>

			<Menu
				slotProps={{
					paper: { style: { minWidth: anchorEl ? anchorEl.clientWidth : "180px", maxWidth: "300px", maxHeight: 450 } },
				}}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: "top", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
			>
				{radiologists &&
					radiologists.map((radiologist) => {
						return (
							<MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist)}>
								{radiologist.full_name}
							</MenuItem>
						);
					})}
			</Menu>
		</>
	);
}

function Unassign({ id, table }: { id: number; table: MRT_TableInstance<Study> }) {
	const queryClient = useQueryClient();
	const mutation = useUpdateStudy();
	const handleRemoveAssign = () => {
		mutation.mutate(
			{ id, data: { status: 0, radiologist: null, student: null } },
			{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies"] }) },
		);
	};

	return (
		<MRT_ActionMenuItem
			icon={<PersonRemove />}
			key="remove"
			label="Unassign"
			table={table}
			onClick={handleRemoveAssign}
		/>
	);
}

function GeneratePdf({ row, table }: { row: MRT_Row<Study>; table: MRT_TableInstance<Study> }) {
	const [loading, setLoading] = useState(false);

	const handlePdf = async () => {
		const study = row.original;
		const requiredFields = ["patient_name", "patient_id", "dob", "gender", "examination", "study_date"];
		if (!requiredFields.every((field) => Boolean(study[field as keyof Study]))) return table.setEditingRow(row);

		setLoading(true);
		try {
			const noteRes = await fetch(API_URL + "/notes/" + study.dicom_uid, { credentials: "include" });
			const { note } = await noteRes.json();
			const res = await fetch(API_URL + "/pdf", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...study, report: note }),
			});
			const data = await res.json();
			setLoading(false);
			window.open(API_URL + "/pdf?filename=" + data.filename, "_blank");
		} catch (e) {
			setLoading(false);
			console.error("PDF generation failed:", e);
		}
	};

	return (
		<MRT_ActionMenuItem icon={<PictureAsPdf />} label={loading ? "..." : "Report"} onClick={handlePdf} table={table} />
	);
}

function DeleteStudy({ study, table }: { study: Study; table: MRT_TableInstance<Study> }) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleClick = async (confirm: boolean) => {
		if (confirm) {
			const res = await fetch(API_URL + "/studies/" + study.id, { method: "DELETE", credentials: "include" });
			if (res.status == 200) {
				queryClient.invalidateQueries({ queryKey: ["studies"] });
			}
		}
		setOpen(false);
	};

	return (
		<>
			<MRT_ActionMenuItem
				icon=<Delete color="error" />
				key="delete"
				label="Delete"
				onClick={() => setOpen(true)}
				table={table}
			/>

			<Dialog open={open} onClose={setOpen} role="alertdialog">
				<DialogTitle>{`Delete Study for Patient ${study.patient_id} (${study.patient_name.replaceAll("^", "")})?`}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This action is irreversible and will delete the study alongside the report generated for it. Only proceed if
						you are sure.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleClick(false)}>Keep</Button>
					<Button onClick={() => handleClick(true)} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default rowActions;
