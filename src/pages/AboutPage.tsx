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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const AboutPage: React.FC = () => {
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
            <TaskAltIcon sx={{color: "primary.glow", fontSize: 40, ml: 2 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{color: "primary.glow", typography: { xs: "h5", md: "h4" } }}
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

          {/* רשימת יתרונות */}
          <Box
            sx={{ mt: 4, bgcolor: "action.hover", p: 3, borderRadius: 2 }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              מה אנחנו מציעים?
            </Typography>
            <List>
              {features.map((feature, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage;
