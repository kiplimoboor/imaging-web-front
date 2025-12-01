import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_Row } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import type { Actions, Study } from "@/types";
import { commonColumns } from "../columns";
import RowActions from "../RowActions";

function NewStudies() {
	const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
	const columns = useMemo<MRT_ColumnDef<Study>[]>(
		() => [
			...commonColumns,
			{
				header: "Status",
				id: "status",
				size: 50,
				Cell: ({ row }) => <StatusPill status={row.original.status} map={{ 0: { text: "New", color: "primary" } }} />,
			},
		],
		[],
	);

	const { data, isRefetching } = useQuery({
		queryKey: ["studies", "new", { columnFilters }],
		queryFn: async () => {
			const searchParams = new URLSearchParams();
			columnFilters.forEach((filter) => {
				if (typeof filter.value === "string") searchParams.set(filter.id, filter.value);
			});
			searchParams.set("status", "0");
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
		onColumnFiltersChange: setColumnFilters,
		state: { columnFilters, showProgressBars: isRefetching, isLoading: !data },
	};

	const actions: Actions[] = ["assign", "note"];
	const rowActions = useCallback(({ row }: { row: MRT_Row<Study> }) => <RowActions row={row} actions={actions} />, []);

	return <BaseTable data={data} columns={columns} rowActions={rowActions} others={tableConfig} />;
}

export default NewStudies;
