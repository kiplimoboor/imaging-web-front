import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { type MRT_Row } from "material-react-table";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAssignment, type Study } from "../hooks/studies";
import { useActiveUsers, type User } from "../hooks/users";

interface TableRowActionProps {
  row: MRT_Row<Study>;
  showAlert: (msg: string) => void;
}

function TableRowActions({ row, showAlert }: TableRowActionProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useAssignment();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const rowData = row.original;
  const { data: activeUsers } = useActiveUsers();
  const { user } = useAuth();

  const handleAssign = (user: User, dicom_uid: string) => {
    // NOTE: This is an optimistic update
    queryClient.setQueryData(["studies", "all"], (oldStudies: Study[]) => {
      return oldStudies.map((study) => {
        if (study.id === rowData.id) return { ...study, status: 1, radiologist_name: user.full_name };
        return study;
      });
    });
    showAlert("Study assigned to " + user.full_name);

    mutation.mutate({ dicom_uid, radiologist_id: user.id });

    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={() =>
          navigate("/viewer/" + rowData.dicom_uid, {
            state: {
              uid: rowData.dicom_uid,
              name: rowData.patient_name,
              id: rowData.patient_id,
              date: rowData.study_date,
            },
          })
        }
      >
        <Tooltip title="View Study">
          <VisibilityIcon />
        </Tooltip>
      </IconButton>
      {user && user.admin && (
        <IconButton disabled={rowData.status !== 0} onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Tooltip title="Assign to">
            <PersonAddIcon />
          </Tooltip>
        </IconButton>
      )}
      <div className="hidden">
        <IconButton onClick={() => console.log("Print Report Clicked")} disabled={rowData.status != 2}>
          <Tooltip title="Print Report">
            <PrintIcon />
          </Tooltip>
        </IconButton>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {activeUsers && activeUsers.length > 0 ? (
          activeUsers.map((user) => (
            <MenuItem key={user.id} onClick={() => handleAssign(user, rowData.dicom_uid)}>
              {`${user.full_name}`}
            </MenuItem>
          ))
        ) : (
          <MenuItem
            disabled
            sx={{
              opacity: "1 !important",
              color: "#666 !important",
              fontStyle: "italic",
            }}
          >
            No available users to assign
          </MenuItem>
        )}
      </Menu>{" "}
    </Box>
  );
}

export default TableRowActions;
