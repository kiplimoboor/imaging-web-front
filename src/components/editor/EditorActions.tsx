import { Editor } from "@tiptap/react";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { AlertFunction, Study } from "@/types";
import SnackbarAlert from "../SnackbarAlert";
import ChangeTemplate from "./editor-actions/ChangeTemplate";
import EditorPdfAction from "./editor-actions/EditorPdfAction";
import SaveAndDraft from "./editor-actions/SaveReport";

type EditActionProps = { editor: Editor; study: Study; setStudy: Dispatch<SetStateAction<Study | null>> };

function EditorActions({ editor, study, setStudy }: EditActionProps) {
	const [alertMessage, setAlertMessage] = useState("");
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertType, setAlertType] = useState<"info" | "success" | "error">("success");

	const handleSnackbarAlert: AlertFunction = (type, message) => {
		setAlertType(type);
		setAlertMessage(message);
		setAlertOpen(true);
	};

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px", justifyContent: "center" }}>
			<ChangeTemplate editor={editor} />
			<SaveAndDraft editor={editor} study={study} alertFn={handleSnackbarAlert} />
			<EditorPdfAction editor={editor} study={study} setStudy={setStudy} alertFn={handleSnackbarAlert} />
			<SnackbarAlert open={alertOpen} setOpen={setAlertOpen} message={alertMessage} type={alertType} />
		</div>
	);
}

export default EditorActions;
