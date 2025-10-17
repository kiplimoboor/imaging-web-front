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

type BaseTableProps<TData extends MRT_RowData> = {
	columns: MRT_ColumnDef<TData>[];
	data: TData[] | undefined;
	rowActions?: ({ row, table }: { row: MRT_Row<TData>; table: MRT_TableInstance<TData> }) => JSX.Element;
	others?: any;
	intial?: Partial<MRT_TableState<MRT_RowData>>;
};

function BaseTable<TData extends MRT_RowData>({ columns, data, rowActions, others, intial }: BaseTableProps<TData>) {
	const table = useMaterialReactTable({
		columns,
		data: data ?? [],
		state: { isLoading: !data },
		enableDensityToggle: false,
		initialState: {
			density: "compact",
			pagination: { pageIndex: 0, pageSize: 50 },
			showColumnFilters: true,
			showGlobalFilter: true,
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
