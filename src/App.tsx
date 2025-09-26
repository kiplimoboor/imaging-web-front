import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import Unauthorized from "./components/401.tsx";
import AllStudies from "./components/AllStudies.tsx";
import AuthCallback from "./components/AuthCallback";
import MyStudies from "./components/MyStudies.tsx";
import NewStudies from "./components/NewStudies.tsx";
import StudiesLayout from "./components/StudiesLayout";
import Users from "./components/Users";
import Viewer from "./components/Viewer.tsx";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoutes, PrivateRoutes } from "./routes/AppRoutes";

const queryClient = new QueryClient();
function App() {
  return (
    <div className="font-inter">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthCallback />} />
            <Route path="/401" element={<Unauthorized />} />
            <Route path="/viewer/:uid" element={<Viewer />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<StudiesLayout />}>
                <Route index element={<MyStudies />} />
                <Route path="new" element={<NewStudies />} />
                <Route path="all" element={<AllStudies />} />
              </Route>
              <Route element={<AdminRoutes />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
