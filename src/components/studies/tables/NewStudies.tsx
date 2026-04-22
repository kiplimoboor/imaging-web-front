import type { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_Row } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import BaseTable from "@/components/BaseTable";
import StatusPill from "@/components/StatusPill";
import { useStudies } from "@/hooks/studies";
import type { Actions, Study } from "@/types";
import { commonColumns } from "../columns";
import RowActions from "../RowActions";

function NewStudies() {
  const [filters, setFilters] = useState<MRT_ColumnFiltersState>([]);
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

  const { data, isRefetching } = useStudies([{ id: "status", value: 0 }, ...filters]);

  const tableConfig = {
    manualFiltering: true,
    onColumnFiltersChange: setFilters,
    state: { columnFilters: filters, showProgressBars: isRefetching, isLoading: !data },
  };

  const actions: Actions[] = ["assign", "note"];
  const rowActions = useCallback(({ row }: { row: MRT_Row<Study> }) => <RowActions row={row} actions={actions} />, []);

  return <BaseTable data={data} columns={columns} rowActions={rowActions} others={tableConfig} />;
}

export default NewStudies;
