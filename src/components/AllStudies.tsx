import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStudentAssignment, useStudies, type Study } from "../hooks/studies";
import { useActiveStudents, type User } from "../hooks/users";
import { allStudiesStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";

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
        Cell: ({ cell }) => {
          const status = allStudiesStatusMap[cell.row.original.status];
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
      mutation.mutate(
        { dicom_uid, radiologist_id: student.id },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies", user?.id] }) },
      );
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
