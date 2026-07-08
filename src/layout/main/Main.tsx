import { Box } from "@mui/material";
import type { ReactNode } from "react";

function Main({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "80vh", // מגדיר גובה עמוד
        bgcolor: "background.default", // שימוש בצבע הרקע מתוך ערכת הנושא
        p: { xs: 1, sm: 2, md: 3 }, // ריווח רספונסיבי
      }}
    >
      {children}
    </Box>
  );
}

export default Main;
