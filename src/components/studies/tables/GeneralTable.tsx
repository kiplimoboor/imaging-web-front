import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useStudies } from "@/hooks/studies";
import type { Actions, RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns, hiddenEdit } from "../columns";
import RowActions from "../RowActions";

function GeneralTable() {
	const [filters, setFilters] = useState<MRT_ColumnFiltersState>([]);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(
		() => [
			...commonColumns,
			...hiddenColumns,
			{
				header: "Status",
				size: 50,
				Cell: ({ row }) => {
					const map: StudyStatusMap = {
						0: { text: "Scanned", color: "primary" },
						1: { text: "Scanned", color: "primary" },
						2: { text: "Scanned", color: "primary" },
						3: { text: "Scanned", color: "primary" },
						4: { text: "Reported", color: "success" },
					};
					return <StatusPill status={row.original.status} map={map} />;
				},
				muiEditTextFieldProps: hiddenEdit,
			},
		],
		[],
	);

	const { data, isRefetching } = useStudies(filters);

	const tableConfig = {
		manualFiltering: true,
		onColumnFiltersChange: setFilters,
		state: { columnFilters: filters, showProgressBars: isRefetching, isLoading: !data },
	};
	const actions: Actions[] = ["edit", "pdf"];
	const rowActions = useCallback(({ row, table }: RowActionsProps) => {
		return <RowActions row={row} table={table} actions={actions} />;
	}, []);
	return (
		<BaseTable columns={columns} data={data} intial={commonInitialHide} rowActions={rowActions} others={tableConfig} />
	);
}

export default GeneralTable;
