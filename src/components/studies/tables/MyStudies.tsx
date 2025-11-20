import { useQueryClient } from "@tanstack/react-query";
import type { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useAuth } from "@/context/AuthContext";
import { useGetStudies } from "@/hooks/studies";
import type { Actions, EditingRowSaveArgs, RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns, commonInitialHide, hiddenColumns } from "../columns";
import RowActions from "../RowActions";
import { studyUpdate } from "../utils";

function MyStudies() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const isRegistrar = user?.role === "Registrar";
	const studiesFilter = isRegistrar ? { student: user.id } : { radiologist: user?.id };
	const { data: studies } = useGetStudies(studiesFilter);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		const localColumns: MRT_ColumnDef<Study>[] = [
			{
				header: isRegistrar ? "Reviewer" : "Resident",
				accessorFn: (row) => (isRegistrar ? row.radiologist_name : row.student_name),
				muiEditTextFieldProps: { style: { display: "none" } },
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

	const actions: Actions[] = ["review", "edit", "pdf", "note"];
	const rowActions = ({ table, row }: RowActionsProps) => <RowActions table={table} row={row} actions={actions} />;

	const tableConfig = {
		onEditingRowSave: ({ values, table, row }: EditingRowSaveArgs) => {
			studyUpdate(row.original.id, values);
			queryClient.setQueryData(["studies", [user?.id]], (old: Study[]) =>
				old.map((study) => {
					if (row.original.id === study.id) return { ...study, ...values };
					return study;
				}),
			);

			queryClient.setQueryData(["studies", []], (old: Study[]) =>
				old
					? old.map((study) => {
							if (row.original.id === study.id) return { ...study, ...values };
							return study;
						})
					: [],
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

export default MyStudies;
