import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef } from "material-react-table";
import { useCallback, useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useGetStudies } from "@/hooks/studies";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns } from "../columns";
import RowActions from "../RowActions";
import { studyUpdate } from "../utils";

function AllStudies() {
	const queryClient = useQueryClient();
	const { data: studies } = useGetStudies();

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
			},
			{
				header: "Status",
				size: 50,
				accessorFn: (row) => statusGenerator(Boolean(row.student))[row.status].text,
				Cell: ({ row }) => {
					return <StatusPill status={row.original.status} map={statusGenerator(Boolean(row.original.student))} />;
				},
				muiEditTextFieldProps: { style: { display: "none" } },
			},
			...hiddenColumns,
		];
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

	const actions: Actions[] = ["assign", "self-assign", "edit", "review", "pdf", "note"];
	const rowActions = useCallback(({ table, row }: RowActionsProps) => {
		return <RowActions row={row} actions={actions} table={table} />;
	}, []);

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

export default AllStudies;
