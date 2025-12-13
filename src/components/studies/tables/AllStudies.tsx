import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useStudies, useUpdateStudy } from "@/hooks/studies";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns } from "../columns";
import RowActions from "../RowActions";

function AllStudies() {
	const queryClient = useQueryClient();
	const [filters, setFilters] = useState<MRT_ColumnFiltersState>([]);
	const mutation = useUpdateStudy();

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		return [
			...commonColumns,
			...hiddenColumns,
			{
				header: "Radiologist",
				accessorFn: (row) => (row.student_name ? row.student_name : row.radiologist_name),
				muiEditTextFieldProps: { style: { display: "none" } },
				enableColumnFilter: false,
			},
			{
				header: "Status",
				size: 50,
				Cell: ({ row }) => {
					const map: StudyStatusMap = {
						0: { text: "New Study", color: "primary" },
						1: { text: "Assigned", color: "warning" },
						2: { text: "Resident", color: "secondary" },
						3: row.original.student ? { text: "Resident", color: "secondary" } : { text: "Assigned", color: "warning" },
						4: { text: "Completed", color: "success" },
					};
					return <StatusPill status={row.original.status} map={map} />;
				},
				muiEditTextFieldProps: { style: { display: "none" } },
				enableColumnFilter: false,
			},
		];
	}, []);

	const { data, isRefetching } = useStudies(filters);

	const tableConfig = {
		manualFiltering: true,
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) => {
			mutation.mutate({ id: row.original.id, data: values });
			queryClient.invalidateQueries({ queryKey: ["studies", { columnFilters: filters }] });
			table.setEditingRow(null);
		},
		onColumnFiltersChange: setFilters,
		state: { columnFilters: filters, showProgressBars: isRefetching, isLoading: !data },
	};

	const actions: Actions[] = ["assign", "self-assign", "edit", "review", "pdf", "note"];
	const rowActions = useCallback(({ table, row }: RowActionsProps) => {
		return <RowActions row={row} actions={actions} table={table} />;
	}, []);

	return (
		<BaseTable data={data} columns={columns} rowActions={rowActions} intial={commonInitialHide} others={tableConfig} />
	);
}

export default AllStudies;
