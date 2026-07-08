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
      <Box sx={{ mt: 8, mb: 8 }}>
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
            <TaskAltIcon color="primary" sx={{ fontSize: 40, ml: 2 }} />
            <Typography variant="h4" component="h1" color="primary">
              אודות המערכת שלנו
            </Typography>
          </Box>

          {/* פסקאות תיאור */}
          <Typography variant="body1">
            ברוכים הבאים למערכת ניהול המשימות שלנו. המטרה המרכזית שעמדה לנגד
            עינינו בפיתוח המערכת היא להעניק לכם כלי פשוט ויעיל לעשות סדר בבלאגן,
            כדי שתוכלו להתמקד במה שבאמת חשוב.
          </Typography>

          <Typography variant="body1">
            בין אם מדובר בפרויקטים אישיים, ניהול משימות שוטף או עבודה, המערכת
            תעזור לכם לוודא ששום משימה לא נופלת בין הכיסאות.
          </Typography>

          {/* רשימת יתרונות */}
          <Box sx={{ mt: 5, bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
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
