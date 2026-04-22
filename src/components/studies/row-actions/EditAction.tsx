import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";
import type { MRT_Row, MRT_TableInstance } from "material-react-table";
import type { Study } from "@/types";

type EditActionProps = { table: MRT_TableInstance<Study>; row: MRT_Row<Study> };

function EditAction({ table, row }: EditActionProps) {
  return (
    <Tooltip title="Edit Study Details">
      <IconButton onClick={() => table.setEditingRow(row)}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
}

export default EditAction;
