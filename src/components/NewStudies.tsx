import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useMemo, useState } from "react";
import { useAssignment, useNewStudies, type Study } from "../hooks/studies";
import { useActiveUsers, type User } from "../hooks/users";
import { studyStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import StatusPill from "./StatusPill";

function NewStudies() {
  const { data: studies } = useNewStudies();

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

  const RowActions = ({ row }: { row: MRT_Row<Study> }) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const { data: radiologists } = useActiveUsers();
    const queryClient = useQueryClient();
    const mutation = useAssignment();
    const rowData = row.original;

    const handleAssign = (radiologist: User, dicom_uid: string) => {
      //NOTE: Optimistic update of cache studies
      queryClient.setQueryData(["studies", "all"], (old: Study[]) => old.filter((study) => study.id !== rowData.id));
      mutation.mutate({ dicom_uid, radiologist_id: radiologist.id });
      setMenuAnchor(null);
    };

    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() =>
              window.open("https://radiology.mtrh.go.ke/ohif/viewer?StudyInstanceUIDs=" + rowData.dicom_uid)
            }
          >
            <Tooltip title="View Study">
              <VisibilityIcon />
            </Tooltip>
          </IconButton>

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <Tooltip title="Assign to Radiologist">
              <PersonAddIcon />
            </Tooltip>
          </IconButton>

          <Menu open={Boolean(menuAnchor)} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" color="textSecondary">
                Available Radiologists
              </Typography>
            </Box>
            {radiologists?.map((radiologist) => (
              <MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist, rowData.dicom_uid)}>
                {radiologist.full_name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </>
    );
  };

  return <BaseTable data={studies} columns={columns} rowActions={RowActions} />;
}
export default NewStudies;
