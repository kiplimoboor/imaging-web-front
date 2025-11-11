import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type ViewActionProps = { dicomUid: string; status: number };
function ViewAction({ dicomUid, status }: ViewActionProps) {
	const { isGuest } = useAuth();
	const handleOpen = () => {
		if (status === 0 || (isGuest && status != 4))
			window.open("https://radiology.mtrh.go.ke/ohif/viewer/StudyInstanceUIDs=" + dicomUid);
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
