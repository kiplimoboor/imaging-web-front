import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { useQueryClient } from "@tanstack/react-query";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_Row } from "material-react-table";
import { useMemo } from "react";
import { userStatusMap } from "../data/test";
import { useCreateUser, useGetUsers, useUpdateUser, type User } from "../hooks/users";
import Navbar from "./Navbar";

function Users() {
  const { data: users } = useGetUsers();
  const mutation = useCreateUser();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      { accessorKey: "id", header: "Id", enableEditing: false },
      { accessorKey: "full_name", header: "Name", muiEditTextFieldProps: { required: true } },
      { accessorKey: "email", header: "Email", muiEditTextFieldProps: { required: true } },
      {
        accessorKey: "role",
        header: "Role",
        editVariant: "select",
        editSelectOptions: ["Administrator", "System User"],
        muiEditTextFieldProps: { required: true, select: true },
      },
      {
        header: "Status",
        id: "status",
        enableEditing: false,
        accessorFn: (row) => userStatusMap[row.status]?.text,
        Cell: ({ cell }) => {
          const status = userStatusMap[cell.row.original.status];
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
    data: users ?? [],
    initialState: { showGlobalFilter: true },
    enableDensityToggle: false,
    enableRowActions: true,
    positionActionsColumn: "last",
    createDisplayMode: "modal",
    onCreatingRowSave: ({ table, values }) => {
      const { full_name, email, role } = values;
      mutation.mutate({ full_name, email, role });
      table.setCreatingRow(null);
    },
    renderRowActions: ({ row }) => <RowActions row={row} />,
    renderTopToolbar: ({ table }) => {
      return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={() => table.setCreatingRow(true)}
            sx={{ margin: "12px" }}
            startIcon={<PersonAddIcon />}
          >
            New User
          </Button>
        </Box>
      );
    },
  });

  return (
    <>
      <Navbar />
      <div className="w-10/12 mx-auto my-8">
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}

interface RowActionProps {
  row: MRT_Row<User>;
}

function RowActions({ row }: RowActionProps) {
  const queryClient = useQueryClient();
  const mutation = useUpdateUser();

  const active = row.original?.status == 1 ? true : false;
  const { id, status } = row.original;
  const isActive = status === 1;
  return (
    <Switch
      name="user-status"
      checked={active}
      onChange={() => {
        queryClient.setQueryData(["users"], (oldUsers: User[]) => {
          return oldUsers.map((user) => {
            if (id === user.id) return { ...user, status: user.status == 0 ? 1 : 0 };
            return user;
          });
        });

        mutation.mutate({ id, field: "status", value: isActive ? "0" : "1" });
      }}
    />
  );
}

export default Users;
