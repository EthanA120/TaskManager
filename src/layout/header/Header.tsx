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
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate(ROUTES.HOME)}
          >
            <AssignmentIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                mr: 2,
                fontFamily: "cursive",
                letterSpacing: ".05rem",
              }}
            >
              Task Manager
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex", marginLeft: 5 } }}>
            <NavItem to={ROUTES.HOME} label="Home" />
            <NavItem to={ROUTES.ABOUT} label="About" />
            <NavItem to={ROUTES.CONTACT} label="Contact" />
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
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
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
                  navigate={() => navigate(ROUTES.HOME)}
                  handleFunction={() => handleCloseUserMenu()}
                  icon={() => <ManageAccountsOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} />}
                  text="Profile" />,
                  <CostumeMenuItem
                  key="logout"
                  navigate={() => logout()}
                  handleFunction={() => handleCloseUserMenu()}
                  icon={() => <Logout sx={{ verticalAlign: "middle", marginRight: 1 }} />}
                  text="Logout" />
                ]
              ) : (
                [
                  <CostumeMenuItem
                    key="login"
                    navigate={() => navigate(ROUTES.LOGIN)}
                    handleFunction={() => handleCloseUserMenu()}
                    icon={() => <Login sx={{ verticalAlign: "middle", marginRight: 1 }} />}
                    text="Log In"
                  />,
                  <CostumeMenuItem
                    key="register"
                    navigate={() => navigate(ROUTES.REGISTER)}
                    handleFunction={() => handleCloseUserMenu()}
                    icon={() => <PersonAddOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} />}
                    text="Register"
                  />
                ]
              )}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
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
                vertical: "top",
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
                <Typography sx={{ textAlign: "center", fontFamily: "cursive" }}><HomeOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} /> Home</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(ROUTES.ABOUT)}>
                <Typography sx={{ textAlign: "center", fontFamily: "cursive" }}><InfoOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} /> About</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick(ROUTES.CONTACT)}>
                <Typography sx={{ textAlign: "center", fontFamily: "cursive" }}><EmailOutlined sx={{ verticalAlign: "middle", marginRight: 1 }} /> Contact</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Header;
