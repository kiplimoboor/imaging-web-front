import type { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUserStudies } from "@/hooks/studies";
import type { Actions, RowActionsProps, Study, StudyStatusMap } from "@/types";
import BaseTable from "./BaseTable";
import RowActions from "./RowActions";
import StatusPill from "./StatusPill";
import { commonColumns, commonInitialHide, hiddenColumns } from "./studies/columns";

function MyStudies() {
	const { data: studies } = useUserStudies();
	const { user } = useAuth();

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		const isRegistrar = user?.role === "Registrar";
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

	const actions: Actions[] = ["review", "edit", "pdf"];
	const rowActions = ({ table, row }: RowActionsProps) => <RowActions table={table} row={row} actions={actions} />;
	return <BaseTable data={studies} columns={columns} rowActions={rowActions} intial={commonInitialHide} />;
}

export default MyStudies;
