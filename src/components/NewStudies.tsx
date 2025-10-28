import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useCallback, useMemo } from "react";
import { type Study, useNewStudies } from "@/hooks/studies";
import type { Actions } from "@/types";
import BaseTable from "./BaseTable";
import RowActions from "./RowActions";
import StatusPill from "./StatusPill";
import { commonColumns } from "./studies/columns";

function NewStudies() {
	const { data: studies } = useNewStudies();

	const columns = useMemo<MRT_ColumnDef<Study>[]>(
		() => [
			...commonColumns,
			{
				header: "Status",
				id: "status",
				size: 50,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={{ 0: { text: "New", color: "primary" } }} />,
			},
		],
		[],
	);

	const actions: Actions[] = ["assign"];
	const rowActions = useCallback(({ row }: { row: MRT_Row<Study> }) => <RowActions row={row} actions={actions} />, []);

	return <BaseTable data={studies} columns={columns} rowActions={rowActions} />;
}

export default NewStudies;
