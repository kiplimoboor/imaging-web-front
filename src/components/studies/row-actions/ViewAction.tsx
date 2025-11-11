import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

const VIEWER_URL = "https://radiology.mtrh.go.ke/ohif/viewer?StudyInstanceUIDs=";
type ViewActionProps = { dicomUid: string; status: number };
function ViewAction({ dicomUid, status }: ViewActionProps) {
	const { isGuest } = useAuth();
	const handleOpen = () => {
		if (status === 0 || (isGuest && status != 4)) window.open(VIEWER_URL + dicomUid);
		else window.open("viewer/" + dicomUid);
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
