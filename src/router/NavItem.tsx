import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <Button
      component={NavLink}
      to={to}
      sx={(theme) => ({
        fontFamily: "heebo, sans-serif",
        padding: "8px 10px",
        margin: "0 1px",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "500",
        transition: "all 0.3s ease",
        color: "#fff",
        "&.active": {
          backgroundColor: "#fff",
          color: theme.palette.primary.main,
        },
        "&:hover:not(.active)": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      })}
    >
      {label}
    </Button>
  );
}

export default NavItem;
