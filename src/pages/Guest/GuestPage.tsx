import Navbar from "@/components/Navbar";
import GuestTable from "./GuestTable";

function GuestPage() {
	return (
		<>
			<Navbar />
			<div className="w-10/12 mx-auto">
				<div className="flex items-center justify-between my-6">
					<h2 className="text-xl font-sm">Radiology Study List</h2>
				</div>
				<GuestTable />
			</div>
		</>
	);
}

export default GuestPage;
