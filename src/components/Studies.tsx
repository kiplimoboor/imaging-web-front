import { useAuth } from "../context/AuthContext";
import { useGetStudies } from "../hooks/studies";
import Analytics from "./Analytics";
import Navbar from "./Navbar";
import StudyTable from "./StudyTable";

function UserStudies() {
  const { user } = useAuth();
  const { data } = useGetStudies(user?.id);
  return (
    <>
      <Navbar />
      <StudyTable studies={data} />
    </>
  );
}

function AllStudies() {
  const { data } = useGetStudies();
  return (
    <>
      <Navbar />
      <Analytics />
      <StudyTable studies={data} />;
    </>
  );
}

export { AllStudies, UserStudies };
