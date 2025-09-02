import { useAuth } from "../context/AuthContext";
import { useGetStudies } from "../hooks/studies";
import StudyTable from "./StudyTable";

function UserStudies() {
  const { user } = useAuth();
  const { data } = useGetStudies(user?.id);
  return <StudyTable studies={data} />;
}

function AllStudies() {
  const { data } = useGetStudies();
  return <StudyTable studies={data} />;
}

export { AllStudies, UserStudies };
