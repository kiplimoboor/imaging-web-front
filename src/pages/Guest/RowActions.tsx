import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import type { MRT_Row } from "material-react-table";
import type { Study } from "@/types";

function RowActions({ row }: { row: MRT_Row<Study> }) {
	const { dicom_uid } = row.original;
	const handleClick = () => {
		if (row.original.status === 4) return window.open("viewer/" + dicom_uid);
		return window.open("https://radiology.mtrh.go.ke/ohif/viewer?StudyInstanceUIDs=" + dicom_uid);
	};

	return (
		<>
			<IconButton onClick={handleClick}>
				<Tooltip title="View in OHIF">
					<VisibilityIcon />
				</Tooltip>
			</IconButton>
		</>
	);
}

export default RowActions;
