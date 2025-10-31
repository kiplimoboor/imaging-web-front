import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useCallback, useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useGetStudies } from "@/hooks/studies";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns, hiddenEdit } from "../columns";
import RowActions from "../RowActions";
import { studyUpdate } from "../utils";

function CompletedStudies() {
	const { data } = useGetStudies();
	const studies = data?.filter((study) => study.status === 4);
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
			{ header: "Status", size: 50, Cell: renderStatus, muiEditTextFieldProps: hiddenEdit },
			{ header: "Radiologist", accessorFn: renderRadiologist, muiEditTextFieldProps: hiddenEdit },
		];
	}, []);

	const actions: Actions[] = ["edit", "pdf"];
	const rowActions = useCallback(({ row, table }: RowActionsProps) => {
		return <RowActions row={row} table={table} actions={actions} />;
	}, []);

	const tableConfig = {
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) => {
			studyUpdate(row.original.id, values);
			queryClient.setQueryData(["studies", []], (old: Study[]) =>
				old.map((study) => {
					if (row.original.id === study.id) return { ...study, ...values };
					return study;
				}),
			);

			table.setEditingRow(null);
		},
	};

	return (
		<BaseTable
			data={studies}
			columns={columns}
			rowActions={rowActions}
			intial={commonInitialHide}
			others={tableConfig}
		/>
	);
}

export default CompletedStudies;
