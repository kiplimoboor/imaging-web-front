import { useAuth } from "@/context/AuthContext";
import AllStudies from "./AllStudies";
import CompletedStudies from "./CompletedStudies";
import GuestTable from "./GuestTable";
import MyStudies from "./MyStudies";

function StudiesIndex() {
	const { isGuest, isSecretary, isPrivileged } = useAuth();

	if (isGuest) return <GuestTable />;
	if (isPrivileged) return <AllStudies />;
	if (isSecretary) return <CompletedStudies />;
	return <MyStudies />;
}
export default StudiesIndex;
