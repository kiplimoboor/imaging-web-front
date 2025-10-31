import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useCallback, useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useGetStudies } from "@/hooks/studies";
import type { Actions, Study } from "@/types";
import { commonColumns } from "../columns";
import RowActions from "../RowActions";

function NewStudies() {
	const { data } = useGetStudies();

	const studies = data?.filter((study) => study.status === 0);

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
