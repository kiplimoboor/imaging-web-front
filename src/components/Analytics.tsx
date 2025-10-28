import { Link } from "react-router";
import { useGetStudies, useNewStudies } from "../hooks/studies";
import { useActiveStudents, useActiveUsers } from "../hooks/users";

function Analytics() {
	let incomplete = 0;
	let complete = 0;

	const { data: new_studies } = useNewStudies();
	const { data: studies } = useGetStudies();
	const { data: activeUsers } = useActiveUsers();
	const { data: activeStudents } = useActiveStudents();

	if (!studies) return;
	studies.forEach((study) => {
		const incompleteStatuses = [1, 2, 3];
		if (incompleteStatuses.includes(study.status)) incomplete++;
		else if (study.status === 4) complete++;
	});

	const data = [
		{ title: "Completed", value: complete },
		{ title: "Incomplete", value: incomplete },
	];

	return (
		<div className="w-10/12 mx-auto flex justify-between items-center mt-4">
			<div className="flex gap-6 flex-wrap w-full justify-between">
				<div className="bg-white shadow-sm px-4 py-3 justify-between flex-grow-1">
					<p className="text-sm text-gray-500 font-bold">New Studies</p>
					<div className="flex justify-between">
						<h3 className="text-xl font-semibold text-gray-800">{new_studies.length}</h3>
						<Link to="/" className="text-sm font-semibold text-blue-500 flex items-center group">
							Studies
							<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
								→
							</span>
						</Link>
					</div>
				</div>

				<div className="bg-white shadow-sm px-4 py-3 justify-between flex-grow-1">
					<p className="text-sm text-gray-500 font-bold">Active Users</p>
					<div className="flex justify-between">
						<h3 className="text-xl font-semibold text-gray-800">
							{activeUsers && activeStudents && activeUsers?.length + activeStudents?.length}
						</h3>
						<Link to="/users/" className="text-sm font-semibold text-blue-500 flex items-center group">
							Manage Users
							<span className="ml-1 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1">
								→
							</span>
						</Link>
					</div>
				</div>

				{data.map((item, index) => (
					<div key={index} className="bg-white shadow-sm  px-4 py-3  justify-between flex-grow-1">
						<p className="text-sm text-gray-500 font-bold">{item.title}</p>
						<h3 className="text-xl font-semibold text-gray-800">{item.value}</h3>
					</div>
				))}
			</div>
		</div>
	);
}

export default Analytics;
