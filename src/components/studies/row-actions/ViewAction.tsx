import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type ViewActionProps = { dicomUid: string; status: number; date: string };
function ViewAction({ dicomUid, status, date }: ViewActionProps) {
	const { isGuest } = useAuth();

	const archived = Number(date) < 20260206; // Orthanc that crashed and is now archived with images before this date

	const handleOpen = () => {
		if (status === 0 || (isGuest && status != 4)) {
			window.open(
				`https://radiology.mtrh.go.ke/images${archived ? "-archive" : ""}/viewer?StudyInstanceUIDs=${dicomUid}`,
			);
		} else {
			window.open(`viewer?viewer=images${archived ? "-archive" : ""}&uid=${dicomUid}`);
		}
	};
	return (
		<IconButton onClick={handleOpen}>
			<Tooltip title="View Study">
				<VisibilityIcon />
			</Tooltip>
		</IconButton>
	);
}

export default ViewAction;
