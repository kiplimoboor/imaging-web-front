import { useAuth } from "@/context/AuthContext";
import StudiesPageLayout from "@/layouts/StudiesPageLayout";
import Dashboard from "./Dashboard";
import CompletedStudies from "./studies/tables/CompletedStudies";
import GuestTable from "./studies/tables/GuestTable";
import MyStudies from "./studies/tables/MyStudies";

function Index() {
	const { user } = useAuth();

	if (user?.role === "Administrator" || user?.role === "Support") {
		return <Dashboard />;
	}

	if (user?.role === "Registrar" || user?.role === "Radiologist") {
		return (
			<StudiesPageLayout>
				<MyStudies />
			</StudiesPageLayout>
		);
	}

	if (user?.role === "Secretary") {
		return (
			<StudiesPageLayout>
				<CompletedStudies />
			</StudiesPageLayout>
		);
	}

	if (user?.role === "Guest") {
		return (
			<StudiesPageLayout>
				<GuestTable />
			</StudiesPageLayout>
		);
	}

	return <>Hi</>;
}
export default Index;
