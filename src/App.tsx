import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import AuthCallback from "./components/AuthCallback";
import Home from "./components/Home";
import Studies from "./components/Studies.tsx";
import Users from "./components/Users";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();
function App() {
  return (
    <div className="font-inter">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthCallback />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Studies />}></Route>
              <Route path="/users" element={<Users />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
