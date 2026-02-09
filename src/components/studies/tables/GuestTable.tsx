import type { MRT_ColumnDef, MRT_ColumnFiltersState } from "material-react-table";
import { useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useStudies } from "@/hooks/studies";
import type { RowActionsProps, Study, StudyStatusMap } from "@/types";
import { commonColumns } from "../columns";
import RowActions from "../RowActions";

function GuestTable() {
	const [filters, setFilters] = useState<MRT_ColumnFiltersState>([]);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(
		() => [
			...commonColumns,
			{
				header: "Status",
				size: 50,
				Cell: ({ row }) => {
					const map: StudyStatusMap = {
						0: { text: "Scanned", color: "primary" },
						1: { text: "Scanned", color: "primary" },
						2: { text: "Scanned", color: "primary" },
						3: { text: "Scanned", color: "primary" },
						4: { text: "Reported", color: "success" },
					};
					return <StatusPill status={row.original.status} map={map} />;
				},
			},
		],
		[],
	);

	const { data, isRefetching } = useStudies(filters);

	const tableConfig = {
		manualFiltering: true,
		onColumnFiltersChange: setFilters,
		state: { columnFilters: filters, showProgressBars: isRefetching, isLoading: !data },
	};

	const rowActions = ({ row }: RowActionsProps) => <RowActions row={row} />;
	return <BaseTable columns={columns} data={data} rowActions={rowActions} others={tableConfig} />;
}

export default GuestTable;
