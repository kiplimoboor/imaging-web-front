import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CircularProgress from "@mui/material/CircularProgress";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import React, { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssignment, useStudies, type Study } from "../hooks/studies";
import { useActiveUsers, type User } from "../hooks/users";
import { allStudiesStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import PatientDetailsModal from "./PatientDetailsModal";
import StatusPill from "./StatusPill";

const API_URL = import.meta.env.VITE_API_URL;

function AllStudies() {
  const { data: studies } = useStudies();
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

/*
 * The Row Actions Specifically for this table
 *
 * */

type RowActionsProps = {
  row: MRT_Row<Study>;
  setPatientModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentStudy: Dispatch<SetStateAction<Study | null>>;
};

const RowActions = React.memo(({ row, setPatientModalOpen, setCurrentStudy }: RowActionsProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const { data: students } = useActiveUsers();
  const queryClient = useQueryClient();
  const mutation = useAssignment();
  const rowData = row.original;
  const { user } = useAuth();

  const handleAssign = (radiologist: User, dicom_uid: string) => {
    queryClient.setQueryData(["studies", "all"], (old: Study[]) =>
      old.map((study) => {
        if (study.id === rowData.id) {
          return { ...study, status: 1, radiologist_name: radiologist.full_name };
        } else {
          return study;
        }
      }),
    );

    mutation.mutate(
      { dicom_uid, radiologist_id: radiologist.id },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies", user?.id] }) },
    );
    setMenuAnchor(null);
  };

  const handlePrint = async () => {
    setPdfLoading(true);
    const requiredFields = ["patient_name", "patient_id", "dob", "gender", "examination", "study_date"];

    for (const field of requiredFields) {
      if (!Boolean(rowData[field as keyof Study])) {
        setCurrentStudy(rowData);
        setPatientModalOpen(true);
        return;
      }
    }

    try {
      const noteRes = await fetch(API_URL + "/notes/" + rowData.dicom_uid, { credentials: "include" });
      const { note } = await noteRes.json();
      const res = await fetch(API_URL + "/pdf", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rowData, report: note }),
      });
      const data = await res.json();
      setPdfLoading(false);
      window.open(API_URL + "/pdf?filename=" + data.filename, "_blank");
    } catch (error) {
      setPdfLoading(false);
      console.error("PDF generation failed:", error);
    }
    return;
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => window.open("viewer/" + rowData.dicom_uid)}>
          <Tooltip title="View Study">
            <VisibilityIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} disabled={rowData.status > 1}>
          <Tooltip title="Assign to Radiologist">
            <PersonAddIcon />
          </Tooltip>
        </IconButton>

        {rowData.status === 4 && (
          <IconButton onClick={handlePrint}>
            <Tooltip title="Generate PDF">
              {pdfLoading ? <CircularProgress size="1rem" /> : <PictureAsPdfIcon />}
            </Tooltip>
          </IconButton>
        )}

        <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} keepMounted>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Available Radiologists
            </Typography>
          </Box>
          {students?.map((student) => (
            <MenuItem key={student.id} onClick={() => handleAssign(student, rowData.dicom_uid)}>
              {student.full_name}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
});

export default AllStudies;
