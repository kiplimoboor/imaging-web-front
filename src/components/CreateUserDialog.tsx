import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import type { SetStateAction } from "react";
import { useCreateUser } from "../hooks/users";

type CreateDialogProps = { open: boolean; setOpen: React.Dispatch<SetStateAction<boolean>> };

function CreateUserDialog({ open, setOpen }: CreateDialogProps) {
	const createMutation = useCreateUser();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const formJson = Object.fromEntries((formData as any).entries());
		const { full_name, email, role } = formJson;
		createMutation.mutate({ full_name, email, role }, { onSuccess: () => setOpen(false) });
	};

	return (
		<Dialog open={open}>
			<DialogTitle>Add a User</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To allow a user access and utilize the system, enter their MTRH ERP details below.
				</DialogContentText>
				<form id="new-user" onSubmit={handleSubmit}>
					<TextField
						autoFocus
						required
						margin="dense"
						id="full_name"
						name="full_name"
						label="Full Name"
						type="text"
						fullWidth
						variant="standard"
					/>

					<TextField
						required
						margin="dense"
						id="email"
						name="email"
						label="Email Address"
						type="email"
						fullWidth
						variant="standard"
					/>

					<FormControl fullWidth required margin="dense" variant="standard">
						<InputLabel id="role-label">Select Role</InputLabel>
						<Select labelId="role-label" id="role" name="role" defaultValue="">
							<MenuItem value="System User">Radiologist</MenuItem>
							<MenuItem value="Administrator">Administrator</MenuItem>
							<MenuItem value="Student">Student</MenuItem>
							<MenuItem value="Support">Support</MenuItem>
						</Select>
					</FormControl>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button type="submit" form="new-user">
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateUserDialog;
