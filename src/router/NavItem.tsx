import { NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const navLinkStyle = {
  fontFamily: "heebo, sans-serif",
  textDecoration: "none",
  padding: "8px 10px",
  margin: "0 1px",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "all 0.3s ease", // גורם לכל שינוי (צבע, רקע) לקרות בהדרגה
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
};

function NavItem({ to, label }: { to: string; label: string }) {
  const theme = useTheme();

  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...navLinkStyle,
        backgroundColor: isActive ? "#fff" : "transparent",
        color: isActive ? theme.palette.primary.main : "#fff",
      })}
    >
      {label}
    </NavLink>
  );
}

export default NavItem;
