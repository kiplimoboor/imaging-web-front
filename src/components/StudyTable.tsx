import { Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo, useState } from "react";
import { studyStatusMap } from "../data/test";
import { type Study } from "../hooks/studies";
import { useGetUsers } from "../hooks/users";
import Navbar from "./Navbar";
import TableRowActions from "./StudiesTableRowActions";

type StudyTableProps = {
  studies: Study[] | undefined;
};

function StudyTable({ studies }: StudyTableProps) {
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const { data: users } = useGetUsers();

  function showAlert(msg: string) {
    setAlert(true);
    setAlertMsg(msg);
  }

  const columns = useMemo<MRT_ColumnDef<Study>[]>(
    () => [
      { accessorKey: "patient_id", header: "MRN" },
      { accessorKey: "patient_name", header: "Patient Name" },
      { accessorKey: "study_date", header: "Study Date" },
      { accessorKey: "modalities", header: "Modalities" },
      {
        header: "Status",
        id: "status",
        accessorFn: (row) => studyStatusMap[row.status].text,
        Cell: ({ cell }) => {
          const status = studyStatusMap[cell.row.original.status];
          return (
            <Box
              component="span"
              sx={(theme) => ({
                backgroundColor: theme.palette[status.color].dark,
                borderRadius: "9999px",
                color: "#ffffff",
                px: 2,
                py: 0.5,
                textAlign: "center",
                display: "inline-block",
                minWidth: "100px",
              })}
            >
              {status.text}
            </Box>
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: studies ?? [],
    enableDensityToggle: false,
    initialState: { showGlobalFilter: true, density: "compact" },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => <TableRowActions row={row} users={users} showAlert={showAlert} />,
  });

  return (
    <>
      <Navbar />
      <div className="w-10/12 mx-auto my-8">
        <MaterialReactTable table={table} />
      </div>

      <Snackbar
        open={alert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={1500}
        onClose={() => setAlert(false)}
      >
        <Alert severity="info" onClose={() => setAlert(false)}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
export default StudyTable;
