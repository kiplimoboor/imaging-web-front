import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useCallback, useMemo } from "react";
import { useCompleteStudies } from "@/hooks/studies";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study } from "@/types";
import BaseTable from "./BaseTable";
import RowActions from "./RowActions";
import StatusPill from "./StatusPill";
import { commonColumns, commonInitialHide, hiddenColumns, hiddenEdit } from "./studies/columns";
import { studyUpdate } from "./studies/utils";

function CompletedStudies() {
	const { data: studies } = useCompleteStudies();
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
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) =>
			studyUpdate(row.original.dicom_uid, values, table, queryClient),
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
