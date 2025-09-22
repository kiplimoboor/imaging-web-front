import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import Unauthorized from "./components/401.tsx";
import AuthCallback from "./components/AuthCallback";
import { Studies } from "./components/Studies";
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
              <Route path="/" element={<Studies />} />
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
