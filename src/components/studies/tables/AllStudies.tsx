import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns } from "../columns";
import RowActions from "../RowActions";
import { studyUpdate } from "../utils";

function AllStudies() {
	const queryClient = useQueryClient();
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);

	//  NOTE: This function only exists for the Status column,
	//  which needs a status for accessorFn() and Cell()
	//  It is used in accessorFn to allow for filtering
	const statusGenerator = (student: boolean): StudyStatusMap => {
		return {
			0: { text: "New Study", color: "primary" },
			1: { text: "Assigned", color: "warning" },
			2: { text: "Resident", color: "secondary" },
			3: student ? { text: "Resident", color: "secondary" } : { text: "Assigned", color: "warning" },
			4: { text: "Completed", color: "success" },
		};
	};

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		return [
			...commonColumns,
			{
				header: "Radiologist",
				accessorFn: (row) => (row.student_name ? row.student_name : row.radiologist_name),
				muiEditTextFieldProps: { style: { display: "none" } },
				enableColumnFilter: false,
			},
			{
				header: "Status",
				size: 50,
				accessorFn: (row) => statusGenerator(Boolean(row.student))[row.status].text,
				Cell: ({ row }) => {
					return <StatusPill status={row.original.status} map={statusGenerator(Boolean(row.original.student))} />;
				},
				muiEditTextFieldProps: { style: { display: "none" } },
				enableColumnFilter: false,
			},
			...hiddenColumns,
		];
	}, []);

	const { data, isRefetching } = useQuery({
		queryKey: ["studies", { columnFilters }],
		queryFn: async () => {
			const searchParams = new URLSearchParams();
			columnFilters.forEach((filter) => {
				if (typeof filter.value === "string") searchParams.set(filter.id, filter.value);
			});
			const res = await fetch("https://radiology.mtrh.go.ke/api/studies?" + searchParams.toString(), {
				credentials: "include",
			});
			const data: Study[] = await res.json();
			return data;
		},
		placeholderData: keepPreviousData,
	});

	const tableConfig = {
		manualFiltering: true,
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) => {
			studyUpdate(row.original.id, values);
			queryClient.invalidateQueries({ queryKey: ["studies", { columnFilters }] });
			table.setEditingRow(null);
		},
		onColumnFiltersChange: setColumnFilters,
		state: { columnFilters, showProgressBars: isRefetching, isLoading: !data },
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
