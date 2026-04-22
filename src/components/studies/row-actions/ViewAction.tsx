import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

type ViewActionProps = { dicomUid: string; status: number; created_at: string };
function ViewAction({ dicomUid, status, created_at }: ViewActionProps) {
  const { isGuest } = useAuth();

  const handleOpen = () => {
    // due to orthanc crash on march 6 2026, images before the date are archived
    const archived = new Date(created_at) < new Date("2026-02-06T00:00:00.000Z");
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
