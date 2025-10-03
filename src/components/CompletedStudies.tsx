import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import React, { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useReportedStudies, type Study } from "../hooks/studies";
import { allStudiesStatusMap } from "../utils/constants";
import { handlePrint } from "../utils/printer";
import BaseTable from "./BaseTable";
import PatientDetailsModal from "./PatientDetailsModal";
import StatusPill from "./StatusPill";

function CompletedStudies() {
  const { data: studies } = useReportedStudies();
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);

  const memoizedModalSet = useCallback(setPatientModalOpen, []);
  const memoizedStudySet = useCallback(setCurrentStudy, []);

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
        accessorFn: (row) => allStudiesStatusMap[row.status].text,
        Cell: ({ row }) => <StatusPill status={row.original.status} map={allStudiesStatusMap} />,
      },
      { accessorKey: "radiologist_name", header: "Radiologist", size: 50 },
    ];
  }, []);

  const renderRowActions = useCallback(
    ({ row }: { row: MRT_Row<Study> }) => (
      <RowActions row={row} setPatientModalOpen={memoizedModalSet} setCurrentStudy={memoizedStudySet} />
    ),
    [memoizedModalSet, memoizedStudySet],
  );

  return (
    <>
      <BaseTable data={studies} columns={columns} rowActions={renderRowActions} />
      <PatientDetailsModal open={patientModalOpen} setOpen={setPatientModalOpen} study={currentStudy} />
    </>
  );
}

type RowActionsProps = {
  row: MRT_Row<Study>;
  setPatientModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentStudy: Dispatch<SetStateAction<Study | null>>;
};

const RowActions = React.memo(({ row, setPatientModalOpen, setCurrentStudy }: RowActionsProps) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const rowData = row.original;

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => window.open("viewer/" + rowData.dicom_uid)}>
          <Tooltip title="View Study">
            <VisibilityIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={() => handlePrint({ setPdfLoading, rowData, setCurrentStudy, setPatientModalOpen })}>
          <span style={{ display: "flex", width: "100%", height: "100%" }}>
            {pdfLoading ? <CircularProgress size="1rem" /> : <PictureAsPdfIcon />}
          </span>
        </IconButton>
      </Box>
    </>
  );
});

export default CompletedStudies;
