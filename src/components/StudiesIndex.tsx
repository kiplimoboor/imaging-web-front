import { useAuth } from "../context/AuthContext";
import MyStudies from "./MyStudies";
import StudentStudies from "./StudentStudies";

function StudiesIndex() {
  const { user } = useAuth();
  const isStudent = user?.role === "Student";
  return isStudent ? <StudentStudies /> : <MyStudies />;
}
export default StudiesIndex;
