import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type { MRT_Row } from "material-react-table";
import { useState } from "react";
import type { Study, StudyTableInstance } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

function PdfAction({ row, table }: { row: MRT_Row<Study>; table: StudyTableInstance }) {
	const [pdfLoading, setPdfLoading] = useState(false);

	const handlePdf = async () => {
		const study = row.original;
		const requiredFields = ["patient_name", "patient_id", "dob", "gender", "examination", "study_date"];
		if (!requiredFields.every((field) => Boolean(study[field as keyof Study]))) return table.setEditingRow(row);

		setPdfLoading(true);
		try {
			const noteRes = await fetch(API_URL + "/notes/" + study.dicom_uid, { credentials: "include" });
			const { note } = await noteRes.json();
			const res = await fetch(API_URL + "/pdf", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...study, report: note }),
			});
			const data = await res.json();
			setPdfLoading(false);
			window.open(API_URL + "/pdf?filename=" + data.filename, "_blank");
		} catch (e) {
			setPdfLoading(false);
			console.error("PDF generation failed:", e);
		}
	};

	return (
		<Tooltip title="PDF Report">
			<IconButton onClick={handlePdf}>
				{pdfLoading ? <CircularProgress size="1rem" /> : <PictureAsPdfIcon />}
			</IconButton>
		</Tooltip>
	);
}
export default PdfAction;
