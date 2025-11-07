import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Navbar() {
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await fetch("https://radiology.mtrh.go.ke/oauth/revoke", { credentials: "include" });
		localStorage.removeItem("token");
		const frappeLogoutWindow = window.open("about:blank", "_blank", "width=100,height=100,top=0,left=0");
		if (frappeLogoutWindow) {
			frappeLogoutWindow.location.href = "https://portal.mtrh.go.ke/api/method/logout";
			setTimeout(() => frappeLogoutWindow.close(), 200);
		}
		setTimeout(() => navigate("/login"), 500);
	};

	return (
		<>
			<div className="mb-3 border-b border-gray-200">
				<div className="w-10/12 mx-auto my-1 flex items-center justify-between">
					<div className="flex items-center">
						<img src="/mtrh.svg" alt="MTRH Logo" />
						<h1 className="font-bold text-xl tracking-widest text-[rgb(170,0,0)]">MTRH</h1>
					</div>
					{user && (
						<div className="flex items-center">
							<h1 className="mr-3">{user.full_name}</h1>
							<span className="text-[rgb(170,0,0)]">|</span>
							<Button
								size="small"
								startIcon={<LogoutIcon />}
								sx={{ color: "black", textTransform: "capitalize", marginLeft: "6px" }}
								onClick={handleLogout}
							>
								Log Out
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default Navbar;
