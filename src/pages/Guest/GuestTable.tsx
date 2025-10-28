import type { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useGetStudies } from "@/hooks/studies";
import type { Study, StudyStatusMap } from "@/types";

import RowActions from "./RowActions";

function GuestTable() {
	const { data: studies } = useGetStudies();
	const guestStudyStatusMap: StudyStatusMap = {
		0: { text: "Ongoing", color: "primary" },
		1: { text: "Ongoing", color: "primary" },
		2: { text: "Ongoing", color: "primary" },
		3: { text: "Ongoing", color: "primary" },
		4: { text: "Reported", color: "success" },
	};

	const columns = useMemo<MRT_ColumnDef<Study>[]>(
		() => [
			{ accessorKey: "patient_id", header: "MRN", size: 50 },
			{ accessorKey: "patient_name", header: "Patient Name" },
			{ accessorKey: "study_date", header: "Study Date", size: 50 },
			{ accessorKey: "examination", header: "Examination" },
			{
				header: "Status",
				size: 50,
				accessorFn: (row) => guestStudyStatusMap[row.status].text,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={guestStudyStatusMap} />,
			},
		],
		[],
	);

	return <BaseTable columns={columns} data={studies} rowActions={RowActions} />;
}
export default GuestTable;
