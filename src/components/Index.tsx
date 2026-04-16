import { useAuth } from "@/context/AuthContext";
import StudiesPageLayout from "@/layouts/StudiesPageLayout";
import Dashboard from "./Dashboard";
import GeneralTable from "./studies/tables/GeneralTable";
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

	if (user?.role === "Secretary" || user?.role === "Guest") {
		return (
			<StudiesPageLayout>
				<GeneralTable />
			</StudiesPageLayout>
		);
	}

	return <>Be Different. Be nice.</>;
}
export default Index;
