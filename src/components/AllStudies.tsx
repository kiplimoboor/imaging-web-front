import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssignment, useStudies, type Study } from "../hooks/studies";
import { useActiveUsers, type User } from "../hooks/users";
import { allStudiesStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import StatusPill from "./StatusPill";

function AllStudies() {
  const { data: studies } = useStudies();

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

  const RowActions = ({ row }: { row: MRT_Row<Study> }) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
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

    const handlePrint = async (dicom_uid: string) => {
      const newWindow = window.open("", "_blank");
      if (newWindow === null) {
        console.error("Error opening new window");
        return;
      }

      newWindow.document.body.innerHTML = "<p>Generating PDF, please wait...</p>";

      try {
        const noteRes = await fetch("https://radiology.mtrh.go.ke/api/notes/" + dicom_uid, { credentials: "include" });
        const { note } = await noteRes.json();

        const res = await fetch("http://127.0.0.1:3000/pdf/" + dicom_uid, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rowData, report: note }),
        });
        const blob = await res.blob();
        const pdfUrl = URL.createObjectURL(blob);

        newWindow.location.href = pdfUrl;
      } catch (error) {
        console.error("PDF generation failed:", error);
        newWindow.document.body.innerHTML = "<p>Error generating the PDF.</p>";
      }
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
            <Tooltip title="Assign to Resident">
              <PersonAddIcon />
            </Tooltip>
          </IconButton>

          <IconButton onClick={() => handlePrint(rowData.dicom_uid)}>
            <Tooltip title="Print Report">
              <PrintIcon />
            </Tooltip>
          </IconButton>

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
  };

  return <BaseTable data={studies} columns={columns} rowActions={RowActions} />;
}
export default AllStudies;
