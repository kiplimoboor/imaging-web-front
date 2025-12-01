import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_Row } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns, hiddenEdit } from "../columns";
import RowActions from "../RowActions";
import { studyUpdate } from "../utils";

const API_URL = import.meta.env.VITE_API_URL + "/studies?";

function CompletedStudies() {
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
	const queryClient = useQueryClient();

	const renderStatus = useCallback(
		({ row }: { row: MRT_Row<Study> }) => (
			<StatusPill status={row.original.status} map={{ 4: { text: "Complete", color: "success" } }} />
		),
		[],
	);

	const renderRadiologist = useCallback((row: Study) => row.student_name || row.radiologist_name, []);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		return [
			...commonColumns,
			...hiddenColumns,
			{ header: "Status", size: 50, Cell: renderStatus, muiEditTextFieldProps: hiddenEdit, enableColumnFilter: false },
			{
				header: "Radiologist",
				accessorFn: renderRadiologist,
				muiEditTextFieldProps: hiddenEdit,
				enableColumnFilter: false,
			},
		];
	}, []);

	const { data, isRefetching } = useQuery({
		queryKey: ["studies", "completed", { columnFilters }],
		queryFn: async () => {
			const searchParams = new URLSearchParams();
			columnFilters.forEach((filter) => {
				if (typeof filter.value === "string") searchParams.set(filter.id, filter.value);
			});
			searchParams.set("status", "4");
			const res = await fetch(API_URL + searchParams.toString(), {
				credentials: "include",
			});
			const data: Study[] = await res.json();
			return data;
		},
		placeholderData: keepPreviousData,
	});

	const actions: Actions[] = ["edit", "pdf"];
	const rowActions = useCallback(({ row, table }: RowActionsProps) => {
		return <RowActions row={row} table={table} actions={actions} />;
	}, []);

	const tableConfig = {
		manualFiltering: true,
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) => {
			studyUpdate(row.original.id, values);
			queryClient.invalidateQueries({ queryKey: ["studies", "completed", { columnFilters }] });
			table.setEditingRow(null);
		},
		onColumnFiltersChange: setColumnFilters,
		state: { columnFilters, showProgressBars: isRefetching, isLoading: !data },
	};

	return (
		<BaseTable data={data} columns={columns} rowActions={rowActions} intial={commonInitialHide} others={tableConfig} />
	);
}

export default CompletedStudies;
