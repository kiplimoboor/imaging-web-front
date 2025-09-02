import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

type Page = { title: string; link: string };
const pages: Page[] = [
  { title: "Home", link: "/dashboard" },
  { title: "Users", link: "/users" },
];

function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "white", color: "#AA0000", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <img src="/mtrh.svg" alt="MTRH Logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/dashboard"
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
          <Box sx={{ display: { xs: "none", md: "flex", marginRight: 12 } }}>
            {pages.map((page) => {
              if (page.link.startsWith("http")) {
                return (
                  <a href={`${page.link}`} key={page.link}>
                    <Button sx={{ my: 2, color: "black", display: "block" }}>{page.title}</Button>
                  </a>
                );
              } else {
                return (
                  <Link to={`${page.link}`} key={page.link}>
                    <Button sx={{ my: 2, color: "black", display: "block" }}>{page.title}</Button>
                  </Link>
                );
              }
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
