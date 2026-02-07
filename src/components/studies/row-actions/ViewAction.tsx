import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type ViewActionProps = { dicomUid: string; status: number, date: string };
function ViewAction({ dicomUid, status, date }: ViewActionProps) {
	const { isGuest } = useAuth();
	const handleOpen = () => {
		if (status === 0 || (isGuest && status != 4)) {
			// Previous Orthanc Crashed on this date. The code is messy, will refactor
			if (Number(date) > 20260205) {
				window.open("https://radiology.mtrh.go.ke/viewer-v1/viewer?StudyInstanceUIDs=" + dicomUid);
			} else {
				window.open("https://radiology.mtrh.go.ke/ohif/viewer?StudyInstanceUIDs=" + dicomUid);
			}
		}
		else {
			if (Number(date) > 20260205) {
				window.open(`viewer?viewer=viewer-v1&uid=${dicomUid}`);
			}
			else {
				window.open(`viewer?viewer=ohif&uid=${dicomUid}`);
			}
		}
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