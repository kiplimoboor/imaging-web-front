import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import type { MRT_Row, MRT_TableInstance } from "material-react-table";
import { useUpdateUser } from "@/hooks/users";
import type { User } from "@/types";

type RowActionProps = { table: MRT_TableInstance<User>; row: MRT_Row<User> };
function RowActions({ table, row }: RowActionProps) {
  const mutation = useUpdateUser();
  const { id, status, role } = row.original;
  const isActive = status === 1;

  const toggleUserStatus = () => mutation.mutate({ id, data: { status: isActive ? 0 : 1 } });
  const editUserDetails = () => table.setEditingRow(row);

  return (
    <>
      <Tooltip title={status === 1 ? "Deactivate" : "Activate"}>
        <Switch name={"user-status"} checked={isActive} disabled={role === "Support"} onChange={toggleUserStatus} />
      </Tooltip>

      <Tooltip title="Edit User Details">
        <IconButton onClick={editUserDetails}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export type { RowActionProps };
export default RowActions;
