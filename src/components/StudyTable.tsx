import { Alert, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo, useState } from "react";
import { studyStatusMap } from "../data/test";
import { type Study } from "../hooks/studies";
import TableRowActions from "./StudiesTableRowActions";

type StudyTableProps = {
  studies: Study[] | undefined;
};

function StudyTable({ studies }: StudyTableProps) {
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const myStudies = sessionStorage.getItem("activeTab") === "2";

  function showAlert(msg: string) {
    setAlert(true);
    setAlertMsg(msg);
  }

  const columns = useMemo<MRT_ColumnDef<Study>[]>(
    () => [
      { accessorKey: "patient_id", header: "MRN", size: 50 },
      { accessorKey: "patient_name", header: "Patient Name" },
      { accessorKey: "study_date", header: "Study Date", size: 50 },
      { accessorKey: "modalities", header: "Modalities", size: 40 },
      {
        header: "Status",
        id: "status",
        size: 50,
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
      { accessorKey: "radiologist_name", header: "Radiologist", size: 50 },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: studies ?? [],
    enableDensityToggle: false,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
      columnVisibility: { radiologist_name: myStudies },
      pagination: { pageIndex: 0, pageSize: 50 },
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => <TableRowActions row={row} showAlert={showAlert} />,
  });

  return (
    <>
      <div className="">
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
