import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_Row } from "material-react-table";
import type { JSX } from "react";
import type { Study } from "../hooks/studies";

type BaseTableProps = {
  columns: MRT_ColumnDef<Study>[];
  data: Study[] | undefined;
  rowActions?: ({ row }: { row: MRT_Row<Study> }) => JSX.Element;
};

function BaseTable({ columns, data, rowActions }: BaseTableProps) {
  const table = useMaterialReactTable({
    columns,
    data: data ?? [],
    state: { isLoading: !data },
    enableDensityToggle: false,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "compact",
    },

    enableRowActions: rowActions !== undefined,
    positionActionsColumn: "last",
    renderRowActions: rowActions,
  });

  return <MaterialReactTable table={table} />;
}

export default BaseTable;
