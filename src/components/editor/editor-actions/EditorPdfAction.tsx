import { Button } from "@mui/material";
import { Editor } from "@tiptap/react";
import { type Dispatch, type SetStateAction, useState } from "react";
import StudyDetailsUpdate from "@/components/StudyDetailsUpdate";
import type { AlertFunction, Study } from "@/types";

const API_URL = import.meta.env.VITE_API_URL + "/pdf";

type EditorPdfActionProps = {
	study: Study;
	setStudy: Dispatch<SetStateAction<Study | null>>;
	alertFn: AlertFunction;
	editor: Editor;
};
function EditorPdfAction({ study, setStudy, alertFn, editor }: EditorPdfActionProps) {
	const [pdfLoading, setPdfLoading] = useState(false);
	const [studyUpdaterOpen, setStudyUpdaterOpen] = useState(false);

	const handlePdfGenerate = async () => {
		setPdfLoading(true);
		const requiredStudyFields = ["patient_name", "patient_id", "dob", "gender", "examination", "study_date"];
		const payload: any = {};
		for (const field of requiredStudyFields) {
			if (Boolean(study[field as keyof Study]) === false) {
				setPdfLoading(false);
				alertFn("error", "One or more study fields are missing. Update before printing");
				setStudyUpdaterOpen(true);
				return;
			}
			payload[field] = study[field as keyof Study];
		}

		payload["radiologist_name"] = study.radiologist_name;
		payload["student_name"] = study.student_name;

		try {
			const res = await fetch(API_URL, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...study, report: editor.getHTML() }),
			});

			const data = await res.json();
			setPdfLoading(false);
			window.open(API_URL + "?filename=" + data.filename, "_blank");
		} catch (error) {
			console.error("PDF generation failed:", error);
			setPdfLoading(false);
			alertFn("error", "Failed to generate Pdf, Please contact support.");
		}
		return;
	};

	return (
		<>
			<Button variant="outlined" size="medium" onClick={handlePdfGenerate}>
				{pdfLoading ? "..." : "PDF"}
			</Button>

			<StudyDetailsUpdate study={study} setStudy={setStudy} open={studyUpdaterOpen} setOpen={setStudyUpdaterOpen} />
		</>
	);
}

export default EditorPdfAction;
