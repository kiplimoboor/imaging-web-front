import { Button } from "@mui/material";
import { Editor } from "@tiptap/react";
import type { AlertFunction, Study } from "@/types";

const API_URL = import.meta.env.VITE_API_URL + "/notes";

type SaveAndDraftProps = { editor: Editor; study: Study; alertFn: AlertFunction };

function SaveAndDraft({ editor, study, alertFn }: SaveAndDraftProps) {
	const handleSave = async (type: 0 | 1) => {
		const res = await fetch(API_URL, {
			method: "POST",
			credentials: "include",
			body: JSON.stringify({
				uid: study.dicom_uid,
				note: editor.getHTML(),
				type: type,
				accession: study.accession,
			}),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			if (type === 0) alertFn("info", "Report Draft Saved");
			else alertFn("success", "Report Saved");
		} else {
			alertFn("error", "Could not save report");
		}
	};

	return (
		<>
			<Button color="error" variant="contained" size="medium" onClick={() => handleSave(0)}>
				Draft
			</Button>
			<Button color="primary" variant="contained" size="medium" onClick={() => handleSave(1)}>
				Save
			</Button>
		</>
	);
}

export default SaveAndDraft;
