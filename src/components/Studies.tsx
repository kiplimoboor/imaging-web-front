import { useAuth } from "../context/AuthContext";
import { useNewStudies, useRadiologistStudies, useStudentStudies, useStudies } from "../hooks/studies";
import Analytics from "./Analytics";
import Navbar from "./Navbar";
import StudyTable from "./StudyTable";
import TabNav from "./TabNav";

function Studies() {
  const { user } = useAuth();
  const { data: newAdminStudies } = useNewStudies();
  const { data: allAdminStudies } = useStudies();

  let userStudies;

  if (user?.role === "Student") {
    const { data: studentStudies } = useStudentStudies();
    userStudies = studentStudies;
  } else {
    const { data: systemUserStudies } = useRadiologistStudies();
    userStudies = systemUserStudies;
  }

  const isAdmin = user?.admin;

  const newStudies = isAdmin ? newAdminStudies : undefined;
  const allStudies = isAdmin ? allAdminStudies : undefined;

  const tabs = [
    { label: "My Studies", component: <StudyTable studies={userStudies} /> },
    ...(isAdmin ? [{ label: "New Studies", component: <StudyTable studies={newStudies} /> }] : []),
    ...(isAdmin ? [{ label: "All Studies", component: <StudyTable studies={allStudies} /> }] : []),
  ];

  return (
    <>
      <Navbar />
      {isAdmin && <Analytics />}
      <TabNav tabs={tabs} />
    </>
  );
}

export { Studies };
