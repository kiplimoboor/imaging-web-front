import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUpdateStudy } from "@/hooks/studies";
import { useUsers } from "@/hooks/users";
import type { User } from "@/types";

function AssignAction({ id, status }: { id: number; status: number }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();
  const mutation = useUpdateStudy();
  const { data } = useUsers();
  const radiologists = data?.filter((user) => {
    return user.status === 1 && (user.role === "Registrar" || user.role === "Radiologist");
  });

  const handleAssign = (radiologist: User) => {
    const isRegistrar = radiologist.role === "Registrar";
    let updateData: any = {};
    if (isRegistrar) {
      updateData.student = radiologist.id;
      updateData.status = 2;
    } else {
      updateData.radiologist = radiologist.id;
      updateData.status = 1;
    }
    mutation.mutate(
      { id, data: updateData },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies"] }) },
    );
    setAnchorEl(null);
  };
  const handleRemoveAssign = () => {
    mutation.mutate(
      { id, data: { status: 0, radiologist: null, student: null } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies"] }) },
    );
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Assign to Radiologist">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <PersonAddIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { style: { maxHeight: 300, width: "25ch" } } }}
      >
        {status !== 0 && [
          <MenuItem key="remove-assign" onClick={handleRemoveAssign}>
            <ListItemIcon>
              <PersonRemoveIcon />
            </ListItemIcon>
            <ListItemText>Remove Assignment</ListItemText>
          </MenuItem>,
          <Divider key="divider" />,
        ]}
        {radiologists?.map((radiologist) => (
          <MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist)}>
            {radiologist.full_name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default AssignAction;
