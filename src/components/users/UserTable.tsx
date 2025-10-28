import type { MRT_ColumnDef, MRT_RowData, MRT_TableState } from "material-react-table";
import { useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useUsers } from "@/hooks/users";
import type { StudyStatusMap, User } from "@/types";
import RowActions from "./RowActions";

function UsersTable() {
	const { data: users } = useUsers();
	const userStatusMap: StudyStatusMap = {
		0: { text: "Inactive", color: "error" },
		1: { text: "Active", color: "primary" },
	};

	const columns = useMemo<MRT_ColumnDef<User>[]>(
		() => [
			{ accessorKey: "id", header: "Id" },
			{ accessorKey: "full_name", header: "Name" },
			{ accessorKey: "email", header: "Email" },
			{ accessorKey: "role", header: "Role" },
			{
				header: "Status",
				accessorFn: (user) => userStatusMap[user.status].text,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={userStatusMap} />,
			},
		],
		[],
	);

	const initial: Partial<MRT_TableState<MRT_RowData>> = {
		columnVisibility: { id: false },
		showColumnFilters: false,
		sorting: [
			{ id: "role", desc: false },
			{ id: "id", desc: false },
		],
	};

	return <BaseTable data={users} columns={columns} rowActions={RowActions} intial={initial} />;
}

export default UsersTable;
