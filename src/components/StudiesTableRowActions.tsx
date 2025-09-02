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
import { useAssignment, type Study } from "../hooks/studies";
import { type User } from "../hooks/users";

interface TableRowActionProps {
  row: MRT_Row<Study>;
  users: User[] | undefined;
  showAlert: (msg: string) => void;
}

function TableRowActions({ row, users, showAlert }: TableRowActionProps) {
  const queryClient = useQueryClient();
  const mutation = useAssignment();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const rowData = row.original;

  const handleAssign = (user: User, dicom_uid: string) => {
    // NOTE: This is an optimistic update
    queryClient.setQueryData(["studies"], (oldStudies: Study[]) => {
      return oldStudies.map((study) => {
        if (study.id === rowData.id) return { ...study, status: 1 };
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
        onClick={() => {
          const studyLink = "http://172.16.0.29/ohif/viewer";
          const params = new URLSearchParams({
            StudyInstanceUIDs: rowData.dicom_uid,
          });
          window.open(`${studyLink}?${params}`, "_self");
        }}
      >
        <Tooltip title="View Study">
          <VisibilityIcon />
        </Tooltip>
      </IconButton>

      <IconButton disabled={rowData.status !== 0} onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Tooltip title="Assign to">
          <PersonAddIcon />
        </Tooltip>
      </IconButton>

      <IconButton onClick={() => console.log("Print Report Clicked")} disabled={rowData.status != 2}>
        <Tooltip title="Print Report">
          <PrintIcon />
        </Tooltip>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {users
          ?.filter((user) => user.status === 1)
          .map((user) => (
            <MenuItem key={user.id} onClick={() => handleAssign(user, rowData.dicom_uid)}>
              {user.full_name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}

export default TableRowActions;
