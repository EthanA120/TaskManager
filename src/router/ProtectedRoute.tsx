import { Navigate, type To } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode; 
  navigate: To;
}

function ProtectedRoute({ children, navigate }: ProtectedRouteProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? <>{children}</> : <Navigate to={navigate} replace />;
}

export default ProtectedRoute;