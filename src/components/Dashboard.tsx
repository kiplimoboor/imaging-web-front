import type { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import { Link } from "react-router";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import type { Study, StudyStatusMap } from "@/types";
import BaseTable from "./BaseTable";
import Navbar from "./Navbar";
import StatusPill from "./StatusPill";

function Dashboard() {
	const chartData = [
		{ browser: "chrome", visitors: 275, fill: "#8884d8" },
		{ browser: "safari", visitors: 200, fill: "#82ca9d" },
		{ browser: "firefox", visitors: 187, fill: "#ffc658" },
		{ browser: "edge", visitors: 173, fill: "#ff8042" },
	];

	const columns = useMemo<MRT_ColumnDef<Pick<Study, "patient_name" | "patient_id" | "status" | "study_date">>[]>(
		() => [
			{ accessorKey: "patient_id", header: "MRN" },
			{ accessorKey: "patient_name", header: "Name" },
			{ accessorKey: "study_date", header: "Date" },
			{
				header: "Status",
				Cell({ row }) {
					const map: StudyStatusMap = {
						0: { text: "New Study", color: "primary" },
						1: { text: "Assigned", color: "warning" },
						2: { text: "Resident", color: "secondary" },
					};
					return <StatusPill status={row.original.status} map={map} />;
				},
			},
		],
		[],
	);

	const data: Pick<Study, "patient_id" | "patient_name" | "status" | "study_date">[] = [
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 2, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 1, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 1, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 2, study_date: "20251010" },
		{ patient_id: "123", patient_name: "Mark", status: 0, study_date: "20251010" },
	];
	const tableConfig = { enablePagination: false, enableTopToolbar: false, enableBottomToolbar: false };
	const initial = { showColumnFilters: false, showGlobalFilter: false };
	return (
		<>
			<Navbar />
			<div className="w-10/12 mx-auto mt-8">
				<div>
					<h1 className="text-xl font-semibold">Overview</h1>
					<p className="text-sm text-gray-800">Welcome back, here is today's radiology status.</p>
				</div>

				<div className="mt-12 grid grid-cols-4 gap-4">
					{chartData.map((item) => {
						return (
							<div key={item.browser}>
								<div className="shadow-sm p-3">
									<h3 className="font-bold text-sm text-gray-500">Total Studies</h3>
									<p className="text-2xl mt-3">10</p>
									<Link to="/">
										<p className="text-sm text-right font-semibold text-blue-500 flex justify-end group">
											Studies
											<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
												→
											</span>
										</p>
									</Link>
								</div>
							</div>
						);
					})}
				</div>
				<div className="flex my-12 gap-6">
					<div className="w-3/4">
						<h2 className="mb-2 ">Recent Studies</h2>
						<BaseTable data={data} columns={columns} intial={initial} others={tableConfig} />
					</div>
					<div className="w-1/4">
						<h2 className="mb-2 text-center">Volume by Modality</h2>
						<PieChart style={{ width: "100%", maxWidth: "500px", maxHeight: "80vh", aspectRatio: 1 }} responsive>
							<Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} outerRadius={80} />
							<Legend layout="vertical" height={36} align="center" verticalAlign="bottom" />
							<Tooltip />
						</PieChart>
					</div>
				</div>
			</div>
		</>
	);
}
export default Dashboard;
