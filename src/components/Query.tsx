import { Button } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { MRT_ColumnDef } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import RowActions from "@/components/studies/RowActions";
import { useUsers } from "@/hooks/users";
import type { RowActionsProps, Study } from "@/types";
import BaseTable from "./BaseTable";
import Navbar from "./Navbar";
import { commonColumns } from "./studies/columns";

const API_URL = import.meta.env.VITE_API_URL + "/query";
const modalities = ["CT", "DX", "MR", "MG", "US"];

function Query() {
	const { data: users } = useUsers();
	const [filters, setFilters] = useState<any>({});
	const [showTable, setShowTable] = useState(false);
	const [data, setData] = useState<Study[]>([]);

	const columns = useMemo<MRT_ColumnDef<Study>[]>(() => {
		return [
			...commonColumns,
			{ accessorKey: "dicom_uid", header: "DICOM" },
			{ accessorKey: "scan_time", header: "Scan Date" },
			{ accessorKey: "report_time", header: "Report Time" },
			{ accessorKey: "turnaround_hours", header: "Turnaround (Hours)" },
		];
	}, []);

	const handleChange = (filter: any) => {
		setShowTable(false);
		setFilters({ ...filters, ...filter });
	};

	const fetch_data = async (download = false) => {
		const searchParams = new URLSearchParams([["status", "4"]]);

		Object.entries(filters).forEach(([key, value]) => {
			if (value === null || value === undefined || value === "") return;
			if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item) searchParams.append(key, String(item));
				});
			} else {
				searchParams.append(key, String(value));
			}
		});

		if (download) {
			window.location.href = `${API_URL}?${searchParams.toString()}&format=csv`;
		} else {
			const res = await fetch(`${API_URL}?${searchParams.toString()}`);
			const data = await res.json();
			setData(data);
			setShowTable(true);
		}
	};

	const rowActions = useCallback(({ table, row }: RowActionsProps) => <RowActions row={row} table={table} />, []);

	return (
		<>
			<Navbar />
			<div className="w-10/12 mx-auto mt-8">
				<div>
					<h1 className="text-xl font-semibold">Query</h1>
					<p className="text-sm text-gray-800">Run queries and generate files on studies</p>
				</div>

				<div className="mt-8 flex flex-nowrap items-center gap-4">
					<Autocomplete
						disablePortal
						options={users?.filter((user) => ["Radiologist", "Registrar"].includes(user.role)) ?? []}
						getOptionLabel={(option) => option.full_name || ""}
						isOptionEqualToValue={(option, value) => option.id === value?.id}
						sx={{ width: 280 }}
						renderInput={(params) => <TextField {...params} label="Radiologist" />}
						onChange={(_, newValue: any) => {
							if (!newValue) {
								handleChange({ radiologist: "", student: "" });
							} else {
								const isRadiologist = newValue.role === "Radiologist";
								handleChange({
									radiologist: isRadiologist ? newValue.id : "",
									student: isRadiologist ? "" : newValue.id,
								});
							}
						}}
					/>

					<TextField
						id="start"
						label="Start Date"
						type="date"
						slotProps={{ inputLabel: { shrink: true } }}
						sx={{ width: 160 }}
						onChange={(event) => handleChange({ start: event.target.value.replaceAll("-", "") })}
					/>

					<TextField
						id="end"
						label="End Date"
						type="date"
						slotProps={{ inputLabel: { shrink: true } }}
						sx={{ width: 160 }}
						onChange={(event) => handleChange({ end: event.target.value.replaceAll("-", "") })}
					/>

					<Autocomplete
						sx={{ width: 320 }}
						multiple
						filterSelectedOptions
						disablePortal
						options={modalities}
						renderInput={(params) => <TextField {...params} label="Modalities" />}
						onChange={(_, newValue: any) => handleChange({ modalities: newValue ?? [] })}
					/>

					<TextField
						id="limit"
						label="Limit"
						sx={{ width: 90 }}
						onChange={(event) => handleChange({ limit: event.target.value })}
					/>

					<div className="flex-grow" />

					<div className="flex items-center gap-2">
						{showTable && (
							<Button
								variant="outlined"
								size="large"
								sx={{ height: 56, minWidth: 120 }}
								onClick={() => fetch_data(true)}
							>
								Export
							</Button>
						)}

						<Button variant="contained" size="large" sx={{ height: 56, minWidth: 120 }} onClick={() => fetch_data()}>
							Query
						</Button>
					</div>
				</div>
				{showTable && (
					<div className="my-8">
						<BaseTable
							data={data}
							columns={columns}
							rowActions={rowActions}
							others={{ enableColumnFilters: false, enableTopToolbar: false }}
							intial={{
								columnVisibility: { dicom_uid: false, status: false, study_date: false },
								pagination: { pageIndex: 0, pageSize: 10 },
							}}
						/>
					</div>
				)}
			</div>
		</>
	);
}

export default Query;
