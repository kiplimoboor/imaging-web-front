import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";

type ViewActionProps = { dicomUid: string; status: number };
function ViewAction({ dicomUid, status }: ViewActionProps) {
	const handleOpen = () => {
		if (status === 4) window.open("viewer/" + dicomUid);
		else window.open("https://radiology.mtrh.go.ke/ohif/viewer?StudyInstanceUIDs=" + dicomUid);
	};
	return (
		<IconButton onClick={handleOpen}>
			<Tooltip title="View in OHIF">
				<VisibilityIcon />
			</Tooltip>
		</IconButton>
	);
}

export default ViewAction;
