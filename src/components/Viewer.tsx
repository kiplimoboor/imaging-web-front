import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";

const URL = "https://radiology.mtrh.go.ke";

function Viewer() {
	const { uid } = useParams();
	const viewerUrl = `${URL}/ohif/viewer/StudyInstanceUIDs=${uid}`;
	const editorUrl = `${URL}/test/${uid}`;

	const [notePanelOpen, setNotePanelOpen] = useState(true);

	return (
		<div className="flex h-screen w-full">
			<div className={`h-full ${notePanelOpen ? "w-8/12" : "w-full"}`}>
				<iframe src={viewerUrl} className="h-full w-full" />
			</div>
			{notePanelOpen && (
				<div className="absolute right-5 top-1/2 -translate-y-1/2 bg-gray-300 rounded-lg">
					<IconButton onClick={() => setNotePanelOpen(false)}>
						<CloseIcon />
					</IconButton>
				</div>
			)}

			{!notePanelOpen && (
				<div className="absolute right-5 top-1/2 -translate-y-1/2 bg-cyan-300 rounded-lg">
					<IconButton onClick={() => setNotePanelOpen(true)}>
						<EditNoteIcon />
					</IconButton>
				</div>
			)}

			<div className={`h-full overflow-hidden ${notePanelOpen ? "w-10/12" : "w-0"}`}>
				<iframe src={editorUrl} className="h-full w-full" />
			</div>
		</div>
	);
}
export default Viewer;
