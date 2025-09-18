import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

type Page = { title: string; link: string };
const pages: Page[] = [
  { title: "Assignments", link: "/assignments" },
  { title: "Users", link: "/users" },
];

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

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            {user?.admin &&
              pages.map((page) => (
                <Link to={`${page.link}`} key={page.link}>
                  <Button sx={{ my: 2, color: "black", display: "block" }}>{page.title}</Button>
                </Link>
              ))}
          </Box>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "black", fontStyle: "italic" }}>
                Logged in as: <strong>{user.full_name}</strong>
              </Typography>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
