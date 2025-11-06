import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import * as React from "react";

const API_URL = import.meta.env.VITE_API_URL + "/studies/retrieve";

type FetchDialogProps = { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };
function FetchStudyDialog({ open, setOpen }: FetchDialogProps) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries((formData as any).entries());
		const res = await fetch(API_URL, {
			credentials: "include",
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formJson),
		});

		if (res.status === 200) setSuccess(true);
		else setSuccess(false);

		setModalOpen(true);
		setOpen(false);
	};

	return (
		<React.Fragment>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Retrieve Study</DialogTitle>
				<DialogContent>
					<DialogContentText>Enter Patient ID and Study Date as it appears in Orthanc</DialogContentText>
					<form onSubmit={handleSubmit} id="subscription-form">
						<TextField
							autoFocus
							required
							margin="dense"
							id="patient_id"
							name="PatientID"
							label="Patient ID"
							type="text"
							fullWidth
							variant="standard"
						/>

						<TextField
							autoFocus
							required
							margin="dense"
							id="study_date"
							name="StudyDate"
							label="Study Date"
							type="text"
							fullWidth
							variant="standard"
						/>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button type="submit" form="subscription-form">
						Retrieve
					</Button>
				</DialogActions>
			</Dialog>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
					}}
				>
					{success ? <DoneIcon color="success" /> : <ClearIcon color="error" />}
					<p>{success ? "Successfully Retrieved Studies" : "No studies to retrieve"}</p>
				</Box>
			</Modal>
		</React.Fragment>
	);
}

export default FetchStudyDialog;
