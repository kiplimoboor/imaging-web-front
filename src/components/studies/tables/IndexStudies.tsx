import { useAuth } from "@/context/AuthContext";
import GuestTable from "@/pages/Guest/GuestTable";
import AllStudies from "./AllStudies";
import CompletedStudies from "./CompletedStudies";
import MyStudies from "./MyStudies";

function StudiesIndex() {
	const { user, isGuest, isSecretary } = useAuth();
	const role = user?.role;

	if (isGuest) return <GuestTable />;
	if (role === "Support") return <AllStudies />;
	if (isSecretary) return <CompletedStudies />;
	return <MyStudies />;
}
export default StudiesIndex;
