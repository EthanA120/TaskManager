import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useUser } from "../providers/UserProvider";
import { Link as RouterLink } from "react-router-dom";
import ROUTES from "../router/routes";

const AboutPage: React.FC = () => {
  const { user } = useUser();
  const features = [
    "ניהול ומעקב אחר משימות בצורה חכמה",
    "הגדרת סדרי עדיפויות ולוחות זמנים",
    "ממשק משתמש פשוט, נקי ואינטואיטיבי",
    "סנכרון מלא והגברת הפרודוקטיביות",
  ];

  return (
    <Container maxWidth="md" dir="rtl">
      <Box sx={{ my: { xs: 4, md: 8 } }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
          {/* כותרת עליונה */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: "center",
            }}
          >
            <TaskAltIcon sx={{ color: "primary.glow", fontSize: 40, ml: 2 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}
            >
              אודות המערכת שלנו
            </Typography>
          </Box>

          {/* פסקאות תיאור */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
            <Typography variant="body1" color="text.secondary">
              ברוכים הבאים למערכת ניהול המשימות שלנו. המטרה המרכזית שעמדה לנגד
              עינינו בפיתוח המערכת היא להעניק לכם כלי פשוט ויעיל לעשות סדר
              בבלאגן, כדי שתוכלו להתמקד במה שבאמת חשוב.
            </Typography>

            <Typography variant="body1" color="text.secondary">
              בין אם מדובר בפרויקטים אישיים, ניהול משימות שוטף או עבודה, המערכת
              תעזור לכם לוודא ששום משימה לא נופלת בין הכיסאות.
            </Typography>
          </Box>

          {/* קטע למשתמשים לא מחוברים */}
          {!user && (
            <Alert severity="info" sx={{ mt: 4, p: 2, borderRadius: 2 }}>
              <AlertTitle sx={{ fontWeight: "bold", mr: 1 }}>רוצה להתחיל לנהל משימות?</AlertTitle>
              כדי להשתמש במערכת, יש{" "}
              <Link component={RouterLink} to={ROUTES.LOGIN} sx={{ fontWeight: "bold" }}>
                להתחבר
              </Link>{" "}
              או{" "}
              <Link component={RouterLink} to={ROUTES.REGISTER} sx={{ fontWeight: "bold" }}>
                להירשם
              </Link>
              .
            </Alert>
          )}

          {/* רשימת יתרונות */}
          <Alert variant="outlined" severity="success" sx={{ mt: 4, p: 2, borderRadius: 2 }}>
            <AlertTitle sx={{ fontWeight: "bold", mr: 1 }}>
              מה אנחנו מציעים?
            </AlertTitle>
            <List>
              {features.map((feature, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1, display: 'flex' }}>
                  <ListItemIcon sx={{ minWidth: 40, alignItems: "center" }}>
                    <CheckCircleIcon color="success" />
                    <ListItemText primary={feature} sx={{ mr: 2, textAlign: "right" }} />
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </Alert>

        </Paper>
      </Box>
    </Container >
  );
};

export default AboutPage;
