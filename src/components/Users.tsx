import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { useQueryClient } from "@tanstack/react-query";
import { type MRT_ColumnDef, type MRT_Row, type MRT_RowData, type MRT_TableState } from "material-react-table";
import { useMemo, useState } from "react";
import { type User, useUpdateUser, useUsers } from "../hooks/users";
import { userStatusMap } from "../utils/constants";
import BaseTable from "./BaseTable";
import CreateUserDialog from "./CreateUserDialog";
import Navbar from "./Navbar";
import StatusPill from "./StatusPill";

function Users() {
	const { data: users } = useUsers();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	const columns = useMemo<MRT_ColumnDef<User>[]>(() => {
		return [
			{ accessorKey: "full_name", header: "Name" },
			{ accessorKey: "email", header: "Email" },
			{ accessorKey: "role", header: "Role" },
			{
				header: "Status",
				accessorFn: (user) => userStatusMap[user.status].text,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={userStatusMap} />,
			},
		];
	}, []);

	const initial: Partial<MRT_TableState<MRT_RowData>> = {
		showColumnFilters: false,
		sorting: [{ id: "role", desc: false }],
	};

	return (
		<>
			<Navbar />
			<div className="w-10/12 mx-auto">
				<div className="flex items-center justify-between my-6">
					<h2 className="text-xl font-sm">User List</h2>
					<Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setCreateDialogOpen(true)}>
						Add User
					</Button>
				</div>
				<BaseTable columns={columns} data={users} rowActions={RowActions} intial={initial} />
			</div>
			<CreateUserDialog open={createDialogOpen} setOpen={setCreateDialogOpen} />
		</>
	);
}

/*
 *
 * row actions specifically for this table
 *
 * */
type RowActionProps = { row: MRT_Row<User> };
function RowActions({ row }: RowActionProps) {
	const queryClient = useQueryClient();
	const updateMutation = useUpdateUser();
	const { id, status, role } = row.original;
	const isActive = status === 1;

	const toggleUserStatus = () => {
		updateMutation.mutate(
			{ id, field: "status", value: isActive ? 0 : 1 },
			{
				onSuccess: () => {
					queryClient.setQueryData(["users"], (old: User[]) =>
						old.map((user) => {
							if (user.id === id) return { ...user, status: isActive ? 0 : 1 };
							return user;
						}),
					);
					queryClient.invalidateQueries({ queryKey: ["users", "active"] });
				},
			},
		);
	};
	return (
		<Tooltip title={status === 1 ? "Deactivate" : "Activate"}>
			<Switch name={"user-status"} checked={isActive} disabled={role === "Support"} onChange={toggleUserStatus} />
		</Tooltip>
	);
}

export default Users;
