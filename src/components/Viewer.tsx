import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useStudies } from "../hooks/studies";

const URL = "https://radiology.mtrh.go.ke";

function Viewer() {
	const { data } = useStudies();
	const { uid } = useParams();
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const [notePanelOpen, setNotePanelOpen] = useState(true);
	const study = data?.find((study) => study.dicom_uid === uid);

	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe || !study) return;

		const load = () => iframe.contentWindow?.postMessage({ type: "STUDY_DATA", payload: study }, URL + "/editor/");
		iframe.addEventListener("load", load);
		if (iframe.contentDocument?.readyState === "complete") load();

		return () => iframe.removeEventListener("load", load);
	}, [study]);

	return (
		<div className="flex h-screen w-full">
			<div className={`h-full ${notePanelOpen ? "w-8/12" : "w-full"}`}>
				<iframe src={URL + `/ohif/viewer?StudyInstanceUIDs=${uid}`} className="h-full w-full" />
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

			<div className={`h-full overflow-hidden ${notePanelOpen ? "w-4/12" : "w-0"}`}>
				<iframe ref={iframeRef} src={URL + "/editor/"} className="h-full w-full" />
			</div>
		</div>
	);
}
export default Viewer;
