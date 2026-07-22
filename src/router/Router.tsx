import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import ROUTES from "./routes";
import BoardPage from "../pages/BoardPage";
import TaskPage from "../pages/TaskPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";

function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path={ROUTES.HOME}
        element={<ProtectedRoute navigate={ROUTES.ABOUT}><HomePage /></ProtectedRoute>}
      />
      <Route
        path={ROUTES.PROFILE}
        element={<ProtectedRoute navigate={ROUTES.LOGIN}><ProfilePage /></ProtectedRoute>}
      />
      <Route
        path={ROUTES.BOARD_PAGE + ":boardId"}
        element={<ProtectedRoute navigate={ROUTES.LOGIN}><BoardPage /></ProtectedRoute>}
      />
      <Route
        path={ROUTES.TASK_PAGE + ":taskId"}
        element={<ProtectedRoute navigate={ROUTES.LOGIN}><TaskPage /></ProtectedRoute>}
      />

      {/* Not Found Route */}
      <Route path={"/*"} element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;
