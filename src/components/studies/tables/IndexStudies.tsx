import { useAuth } from "@/context/AuthContext";
import AllStudies from "./AllStudies";
import MyStudies from "./MyStudies";

function StudiesIndex() {
	const { user } = useAuth();
	const role = user?.role;

	if (role === "Support") return <AllStudies />;

	return <MyStudies />;
}
export default StudiesIndex;
