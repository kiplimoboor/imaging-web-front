import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
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
              <Typography variant="body2" sx={{ color: "black" }}>
                <strong>{user.full_name}</strong>
              </Typography>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
