import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useAuth } from "@/context/AuthContext";
import { useStudies } from "@/hooks/studies";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns } from "../columns";
import RowActions from "../RowActions";
import { studyUpdate } from "../utils";

function MyStudies() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const isRegistrar = user?.role === "Registrar";
	const [filters, setFilters] = useState<MRT_ColumnFiltersState>([
		{ id: user?.role === "Radiologist" ? "radiologist" : "student", value: user?.id },
	]);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		const localColumns: MRT_ColumnDef<Study>[] = [
			{
				header: isRegistrar ? "Reviewer" : "Resident",
				accessorFn: (row) => (isRegistrar ? row.radiologist_name : row.student_name),
				muiEditTextFieldProps: { style: { display: "none" } },
				enableColumnFilter: false,
			},
			{
				header: "Status",
				id: "status",
				size: 50,
				Cell: ({ row }) => {
					const studyStatusMap: StudyStatusMap = {
						1: { text: "Assigned", color: "warning" },
						2: { text: "Resident", color: "secondary" },
						3: { text: "Draft", color: "error" },
						4: { text: "Completed", color: "success" },
					};
					return <StatusPill status={row.original.status} map={studyStatusMap} />;
				},
				enableEditing: false,
				muiEditTextFieldProps: { style: { display: "none" } },
			},
		];

		return [...commonColumns, ...hiddenColumns, ...localColumns];
	}, []);

	const { data, isRefetching } = useStudies(filters);

	const actions: Actions[] = ["review", "edit", "pdf", "note"];
	const rowActions = ({ table, row }: RowActionsProps) => <RowActions table={table} row={row} actions={actions} />;

	const tableConfig = {
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) => {
			studyUpdate(row.original.id, values);
			queryClient.invalidateQueries({ queryKey: ["studies", user?.id, { columnFilters: filters }] });
			table.setEditingRow(null);
		},
		manualFiltering: true,
		onColumnFiltersChange: setFilters,
		state: { columnFilters: filters, showProgressBars: isRefetching, isLoading: !data },
	};

	return (
		<BaseTable data={data} columns={columns} rowActions={rowActions} intial={commonInitialHide} others={tableConfig} />
	);
}

export default MyStudies;
