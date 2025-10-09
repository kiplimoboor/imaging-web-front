import {
	MaterialReactTable,
	type MRT_ColumnDef,
	type MRT_Row,
	type MRT_RowData,
	type MRT_TableInstance,
	type MRT_TableState,
	useMaterialReactTable,
} from "material-react-table";

import type { JSX } from "react";
import type { Study } from "../hooks/studies";

type BaseTableProps = {
	columns: MRT_ColumnDef<Study>[];
	data: Study[] | undefined;
	rowActions?: ({ row, table }: { row: MRT_Row<Study>; table: MRT_TableInstance<Study> }) => JSX.Element;
	others?: any;
	intial?: Partial<MRT_TableState<MRT_RowData>>;
};

function BaseTable({ columns, data, rowActions, others, intial }: BaseTableProps) {
	const table = useMaterialReactTable({
		columns,
		data: data ?? [],
		state: { isLoading: !data },
		enableDensityToggle: false,
		initialState: {
			showColumnFilters: true,
			showGlobalFilter: true,
			density: "compact",
			sorting: [{ id: "study_date", desc: true }],
			...intial,
		},
		enableRowActions: rowActions !== undefined,
		positionActionsColumn: "last",
		renderRowActions: rowActions,
		...others,
	});

	return <MaterialReactTable table={table} />;
}

export default BaseTable;
