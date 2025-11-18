import Alert from "@mui/material/Alert";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";

interface SnackbarProps {
	open: boolean;
	setOpen: (state: boolean) => void;
	message: string;
	type: "info" | "success" | "error";
}

function SnackbarAlert({ open, setOpen, message, type }: SnackbarProps) {
	const handleClose = (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
		if (reason == "clickaway") return;
		setOpen(false);
	};

	return (
		<Snackbar
			open={open}
			onClose={handleClose}
			autoHideDuration={2000}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
}

export default SnackbarAlert;
