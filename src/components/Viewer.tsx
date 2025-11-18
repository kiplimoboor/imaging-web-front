import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
import Editor from "@/components/editor/Editor";

const URL = "https://radiology.mtrh.go.ke";

function Viewer() {
	const { uid } = useParams();
	const viewerUrl = `${URL}/ohif/viewer?StudyInstanceUIDs=${uid}`;
	const [notePanelOpen, setNotePanelOpen] = useState(true);

	return (
		<div className="flex h-screen w-full">
			<div className={`h-full ${notePanelOpen ? "w-8/12" : "w-full"}`}>
				<iframe src={viewerUrl} className="h-full w-full" />
			</div>

			{notePanelOpen && (
				<div className="fixed right-5 top-1/2 -translate-y-1/2 bg-gray-300 rounded-lg z-50">
					<IconButton onClick={() => setNotePanelOpen(false)}>
						<CloseIcon />
					</IconButton>
				</div>
			)}

			{!notePanelOpen && (
				<div className="fixed right-5 top-1/2 -translate-y-1/2 bg-cyan-300 rounded-lg z-50">
					<IconButton onClick={() => setNotePanelOpen(true)}>
						<EditNoteIcon />
					</IconButton>
				</div>
			)}

			<div className={`h-full ${notePanelOpen ? "w-4/12" : "w-0 overflow-hidden"}`}>
				<div className={`h-full w-full overflow-y-scroll ${notePanelOpen ? "opacity-100" : "opacity-0"}`}>
					<Editor />
				</div>
			</div>
		</div>
	);
}
export default Viewer;
