import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
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
		<AppBar
			position="static"
			sx={{ backgroundColor: "white", color: "#AA0000", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<img src="/mtrh.svg" alt="MTRH Logo" />
						<Typography
							variant="h6"
							noWrap
							component="a"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							MTRH
						</Typography>
					</Box>
					<Box sx={{ flexGrow: 1 }} />
					{user && (
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography variant="body2" sx={{ color: "black", marginRight: "6px" }}>
								<strong>{user.full_name}</strong>
							</Typography>
							<>|</>
							<Button
								size="small"
								startIcon={<LogoutIcon />}
								sx={{ color: "black", textTransform: "capitalize", marginLeft: "6px" }}
								onClick={handleLogout}
							>
								Log Out
							</Button>
						</Box>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Navbar;
