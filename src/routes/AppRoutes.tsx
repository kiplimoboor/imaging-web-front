import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const REDIRECT_URI: string = import.meta.env.VITE_REDIRECT_URI;

const PrivateRoutes = () => {
  const { user } = useAuth();
  if (user === null) {
    const params = new URLSearchParams({ client_id: "ad7b57d325", response_type: "code", redirect_uri: REDIRECT_URI });
    const link = "https://portal.mtrh.go.ke/api/method/frappe.integrations.oauth2.authorize?" + params;
    window.location.href = link;
  }

  return <Outlet />;
};

export default PrivateRoutes;
