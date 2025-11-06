import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useState } from "react";
import FetchStudyDialog from "./FetchStudyDialog";

function Header() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<div className="w-10/12 m-auto">
			<div className="flex items-center justify-between my-6">
				<h2 className="text-xl font-sm">Studies</h2>
				<Button variant="contained" startIcon={<CloudDownloadIcon />} onClick={() => setDialogOpen(true)}>
					Orthanc
				</Button>

				<FetchStudyDialog open={dialogOpen} setOpen={setDialogOpen} />
			</div>
		</div>
	);
}

export default Header;
