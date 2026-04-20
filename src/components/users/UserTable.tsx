import type { MRT_ColumnDef, MRT_RowData, MRT_TableInstance, MRT_TableState } from "material-react-table";
import { useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useUpdateUser, useUsers } from "@/hooks/users";
import type { StudyStatusMap, User } from "@/types";
import RowActions, { type RowActionProps } from "./RowActions";

function UsersTable() {
	const { data, isRefetching } = useUsers();
	const mutation = useUpdateUser();
	const userStatusMap: StudyStatusMap = {
		0: { text: "Inactive", color: "error" },
		1: { text: "Active", color: "primary" },
	};

	const columns = useMemo<MRT_ColumnDef<User>[]>(
		() => [
			{ accessorKey: "id", header: "Id", muiEditTextFieldProps: { style: { display: "none" } } },
			{ accessorKey: "full_name", header: "Name" },
			{ accessorKey: "email", header: "Email" },
			{
				accessorKey: "role",
				header: "Role",
				editVariant: "select",
				editSelectOptions: [
					"Auditor",
					"Administrator",
					"Radiographer",
					"Radiologist",
					"Registrar",
					"Secretary",
					"Support",
				],
				muiEditTextFieldProps: { select: true },
			},
			{
				header: "Status",
				accessorFn: (user) => userStatusMap[user.status].text,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={userStatusMap} />,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
		],
		[],
	);

	const initial: Partial<MRT_TableState<MRT_RowData>> = {
		columnVisibility: { id: false },
		showColumnFilters: false,
		pagination: { pageIndex: 0, pageSize: 50 },
		sorting: [
			{ id: "role", desc: false },
			{ id: "id", desc: false },
		],
	};

	const tableConfig = {
		onEditingRowSave: ({ values, table }: { values: User; table: MRT_TableInstance<User> }) => {
			const { full_name, email, role, id } = values;
			mutation.mutate({ id, data: { full_name, email, role } });
			table.setEditingRow(null);
		},
		state: { showProgressBars: isRefetching, isLoading: !data },
	};

	const rowActions = ({ table, row }: RowActionProps) => <RowActions row={row} table={table} />;

	return <BaseTable data={data} columns={columns} rowActions={rowActions} intial={initial} others={tableConfig} />;
}

export default UsersTable;
