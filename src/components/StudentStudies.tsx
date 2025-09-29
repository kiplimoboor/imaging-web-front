import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Tooltip } from "@mui/material";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useMemo } from "react";
import { useStudentStudies, type Study } from "../hooks/studies";
import { studyStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import StatusPill from "./StatusPill";

function StudentStudies() {
  const { data: studies } = useStudentStudies();

  // NOTE: Column Definition
  const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
    return [
      { accessorKey: "patient_id", header: "MRN", size: 50 },
      { accessorKey: "patient_name", header: "Patient Name" },
      { accessorKey: "study_date", header: "Study Date", size: 50 },
      { accessorKey: "modalities", header: "Modalities", size: 40 },
      {
        header: "Status",
        id: "status",
        size: 50,
        accessorFn: (row) => studyStatusMap[row.status].text,
        Cell: ({ row }) => <StatusPill status={row.original.status} map={studyStatusMap} />,
      },
    ];
  }, []);

  // NOTE: Row Actions Definition
  const RowActions = ({ row }: { row: MRT_Row<Study> }) => {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => window.open("viewer/" + row.original.dicom_uid)}>
            <Tooltip title="View Study">
              <VisibilityIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </>
    );
  };

  return <BaseTable data={studies} columns={columns} rowActions={RowActions} />;
}
export default StudentStudies;
