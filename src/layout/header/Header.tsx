import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../../providers/ProjectThemeProvider";

import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkMode, LightMode, HomeOutlined, InfoOutlined, EmailOutlined, ManageAccountsOutlined, Logout, Login, PersonAddOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NavItem from "../../router/NavItem";
import ROUTES from "../../router/routes";
import { useUser } from "../../providers/UserProvider";
import CostumeMenuItem from "../../components/CustomMenuItem";

function Header() {
  const navigate = useNavigate();
  const { isDark, toggleMode } = useContext(
    ProjectThemeContext,
  ) as ThemeContextType;

  const { user, logout } = useUser();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (route: string) => {
    navigate(route);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }} dir="rtl">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            <AssignmentIcon sx={{ ml: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                ml: 2,
                fontFamily: "heebo, sans-serif",
                letterSpacing: ".05rem",
              }}
            >
              ניהול משימות
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex", marginRight: 5 } }}>
            <NavItem to={ROUTES.HOME} label="בית" />
            <NavItem to={ROUTES.ABOUT} label="על האתר" />
            <NavItem to={ROUTES.CONTACT} label="צור קשר" />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleMode} color="inherit">
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>

          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar-user"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
            >
              {user ? <AccountCircle /> : <Login />}
            </IconButton>
            <Menu
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user ? (
                [
                  <CostumeMenuItem
                    key="profile"
                    navigate={() => navigate(ROUTES.PROFILE)}
                    handleFunction={() => handleCloseUserMenu()}
                    icon={() => <ManageAccountsOutlined sx={{ color: "primary.main", verticalAlign: "middle", marginRight: 1 }} />}
                    text={user.nickname} id={""} />,
                  <CostumeMenuItem
                    key="logout"
                    navigate={() => logout()}
                    handleFunction={() => handleCloseUserMenu()}
                    icon={() => <Logout sx={{ color: "primary.main", verticalAlign: "middle", marginRight: 1 }} />}
                    text="יציאה" id={""} />
                ]
              ) : (
                [
                  <CostumeMenuItem
                    key="login"
                    navigate={() => navigate(ROUTES.LOGIN)}
                    handleFunction={() => handleCloseUserMenu()}
                    icon={() => <Login sx={{ color: "primary.main", verticalAlign: "middle", marginRight: 1 }} />}
                    text="כניסה" id={""}                  />,
                  <CostumeMenuItem
                    key="register"
                    navigate={() => navigate(ROUTES.REGISTER)}
                    handleFunction={() => handleCloseUserMenu()}
                    icon={() => <PersonAddOutlined sx={{ color: "primary.main", verticalAlign: "middle", marginRight: 1 }} />}
                    text="הרשמה" id={""}                  />
                ]
              )}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar-nav"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-nav"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={() => handleMenuItemClick(ROUTES.HOME)}>
                <Typography sx={{ textAlign: "center" }}><HomeOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} /> Home</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(ROUTES.ABOUT)}>
                <Typography sx={{ textAlign: "center" }}><InfoOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} /> About</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(ROUTES.CONTACT)}>
                <Typography sx={{ textAlign: "center" }}><EmailOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} /> Contact</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Header;
