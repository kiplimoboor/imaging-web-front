import { useAuth } from "@/context/AuthContext";
import Dashboard from "./Dashboard";
import StudiesLayout from "./StudiesLayout";
import CompletedStudies from "./studies/tables/CompletedStudies";
import MyStudies from "./studies/tables/MyStudies";

function Index() {
	const { user } = useAuth();

	if (user?.role === "Administrator" || user?.role === "Support") {
		return <Dashboard />;
	}

	if (user?.role === "Registrar" || user?.role === "Radiologist") {
		return (
			<StudiesLayout>
				<MyStudies />
			</StudiesLayout>
		);
	}

	if (user?.role === "Secretary") {
		return (
			<StudiesLayout>
				<CompletedStudies />
			</StudiesLayout>
		);
	}

	return <>Hi</>;
}
export default Index;
