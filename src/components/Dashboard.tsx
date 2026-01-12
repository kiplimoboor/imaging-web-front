import type { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Legend, Pie, PieChart, Tooltip } from "recharts";
import type { Study, StudyStatusMap } from "@/types";
import BaseTable from "./BaseTable";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";
import StatusPill from "./StatusPill";

const TRACKED_MODALITIES = [
	{ name: "ct", fill: "#ffc658" },
	{ name: "dx", fill: "#8884d8" },
	{ name: "mr", fill: "#82ca9d" },
	{ name: "mg", fill: "#ff8042" },
];

function Dashboard() {
	const [analytics, setAnalytics] = useState<any>();

	useEffect(() => {
		const fetchAnalytics = async () => {
			const res = await fetch("https://radiology.mtrh.go.ke/api/analytics", { credentials: "include" });
			const data = await res.json();
			setAnalytics(data);
		};
		fetchAnalytics();
	}, []);

	const chart_data = useMemo(() => {
		if (!analytics?.modality_count) return [];
		return TRACKED_MODALITIES.filter((modality) => Object.keys(analytics.modality_count).includes(modality.name)).map(
			(modality) => ({
				...modality,
				value: analytics.modality_count[modality.name],
				name: modality.name.toUpperCase(),
			}),
		);
	}, [analytics]);

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
						3: { text: "Ongoing", color: "info" },
						4: { text: "Completed", color: "success" },
					};
					return <StatusPill status={row.original.status} map={map} />;
				},
			},
		],
		[],
	);

	const tableConfig = { enablePagination: false, enableTopToolbar: false, enableBottomToolbar: false };
	const initial = { showColumnFilters: false, showGlobalFilter: false };

	if (!analytics) return <LoadingSpinner message="Loading Dashboard" />;
	return (
		<>
			<Navbar />
			<div className="w-10/12 mx-auto mt-8">
				<div>
					<h1 className="text-xl font-semibold">Overview</h1>
					<p className="text-sm text-gray-800">Welcome back, here is today's radiology status.</p>
				</div>

				<div className="mt-12 grid grid-cols-4 gap-4">
					<div className="shadow-sm p-3">
						<h3 className="font-bold text-sm text-gray-500">Total Studies</h3>
						<p className="text-2xl mt-3">{analytics.total}</p>
						<Link to="/all">
							<p className="text-sm text-right font-semibold text-blue-500 flex justify-end group">
								Studies
								<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
									→
								</span>
							</p>
						</Link>
					</div>

					<div className="shadow-sm p-3">
						<h3 className="font-bold text-sm text-gray-500">New</h3>
						<p className="text-2xl mt-3">{analytics.new}</p>
						<Link to="/new">
							<p className="text-sm text-right font-semibold text-blue-500 flex justify-end group">
								New Studies
								<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
									→
								</span>
							</p>
						</Link>
					</div>

					<div className="shadow-sm p-3">
						<h3 className="font-bold text-sm text-gray-500">Completed</h3>
						<p className="text-2xl mt-3">{analytics.completed}</p>
						<Link to="/completed">
							<p className="text-sm text-right font-semibold text-blue-500 flex justify-end group">
								Completed Studies
								<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
									→
								</span>
							</p>
						</Link>
					</div>

					<div className="shadow-sm p-3">
						<h3 className="font-bold text-sm text-gray-500">System Users</h3>
						<p className="text-2xl mt-3">{analytics.users}</p>
						<Link to="/users">
							<p className="text-sm text-right font-semibold text-blue-500 flex justify-end group">
								Manage Users
								<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
									→
								</span>
							</p>
						</Link>
					</div>
				</div>
				<div className="flex my-12 gap-6">
					<div className="w-3/4">
						<h2 className="mb-2 ">Recent Studies</h2>
						{Boolean(analytics.recent_studies) && (
							<BaseTable data={analytics.recent_studies} columns={columns} intial={initial} others={tableConfig} />
						)}
					</div>
					<div className="w-1/4">
						<h2 className="mb-2 text-center">Volume by Modality</h2>
						<PieChart style={{ width: "100%", maxWidth: "500px", maxHeight: "80vh", aspectRatio: 1 }} responsive>
							<Pie data={chart_data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} />
							<Legend layout="horizontal" />
							<Tooltip />
						</PieChart>
					</div>
				</div>
			</div>
		</>
	);
}
export default Dashboard;
