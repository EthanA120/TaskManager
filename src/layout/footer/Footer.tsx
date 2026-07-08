import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import {Home, Info, Email} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routes";

function Footer() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  return (
    <Box>
      <Paper
        sx={{ position: "relative", bottom: 0, left: 0, right: 0 }}
        elevation={1}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<Home />}
            onClick={() => {
              console.log("Home clicked");
              navigate(ROUTES.HOME);
            }}
          />
          <BottomNavigationAction
            label="About"
            icon={<Info />}
            onClick={() => {
              console.log("about clicked");
              navigate(ROUTES.ABOUT);
            }}
          />
          <BottomNavigationAction
            label="Contact"
            icon={<Email />}
            onClick={() => {
              console.log("contact clicked");
              navigate(ROUTES.CONTACT);
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
export default Footer;
