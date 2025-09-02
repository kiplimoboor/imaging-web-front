import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import Unauthorized from "./components/401.tsx";
import AuthCallback from "./components/AuthCallback";
import Home from "./components/Home";
import { AllStudies, UserStudies } from "./components/Studies";
import Users from "./components/Users";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoutes, PrivateRoutes } from "./routes/AppRoutes";

const queryClient = new QueryClient();
function App() {
  return (
    <div className="font-inter">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthCallback />} />
            <Route path="/401" element={<Unauthorized />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<UserStudies />}></Route>
              <Route element={<AdminRoutes />}>
                <Route path="/users" element={<Users />} />
                <Route path="/assignments" element={<AllStudies />}></Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
