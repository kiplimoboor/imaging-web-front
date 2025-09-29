import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRadiologistStudies, useStudentAssignment, type Study } from "../hooks/studies";
import { useActiveStudents, type User } from "../hooks/users";
import { studyStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import StatusPill from "./StatusPill";

function MyStudies() {
  const { data: studies } = useRadiologistStudies();

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
      { accessorKey: "student_name", header: "Resident", size: 50 },
    ];
  }, []);

  const RowActions = ({ row }: { row: MRT_Row<Study> }) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const { data: students } = useActiveStudents();
    const queryClient = useQueryClient();
    const mutation = useStudentAssignment();
    const rowData = row.original;
    const { user } = useAuth();

    const handleAssign = (student: User, dicom_uid: string) => {
      queryClient.setQueryData(["studies", user?.id], (old: Study[]) =>
        old.map((study) => {
          if (study.id === rowData.id) {
            return { ...study, status: 2, student_name: student.full_name };
          }
          return study;
        }),
      );
      mutation.mutate({ dicom_uid, radiologist_id: student.id });
      setMenuAnchor(null);
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

          <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} keepMounted>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" color="textSecondary">
                Available Resident Radiologists
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
export default MyStudies;
