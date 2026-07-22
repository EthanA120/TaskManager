import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../router/routes";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HomeIcon from '@mui/icons-material/Home';

function PageNotFound() {
  return (
    <Container maxWidth="sm" dir="rtl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "calc(100vh - 200px)", // Adjust height to be centered in viewport
          py: 4,
        }}
      >
        <ReportProblemOutlinedIcon sx={{ fontSize: 80, color: "warning.main", mb: 2 }} />
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "6rem", md: "8rem" },
            color: "text.secondary",
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mt: 2,
            mb: 1,
            fontWeight: "bold",
            color: "text.primary"
          }}
        >
          אופס! העמוד לא נמצא
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          נראה שהקישור שגוי או שהעמוד הוסר.
        </Typography>
        <Button
          component={RouterLink}
          to={ROUTES.HOME}
          variant="contained"
          size="large"
          startIcon={<HomeIcon sx={{ ml: 1 }}/>}
        >
          חזרה לדף הבית
        </Button>
      </Box>
    </Container>
  );
}

export default PageNotFound;
