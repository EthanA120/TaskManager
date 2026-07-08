import { Typography, Box, TextField, Button, Paper } from "@mui/material";
// שים לב לייבוא - משתמשים ב-Grid2
import { Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
const ContactPage = () => {
  const [status, setStatus] = useState("");
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("ההודעה נשלחה בהצלחה!");
  };
  return (
    <Box sx={{ maxWidth: "600px", mx: "auto", mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: 500 }}
      >
        צרו קשר
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField fullWidth label="שם מלא" variant="outlined" required />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="אימייל"
                type="email"
                variant="outlined"
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="הודעה"
                multiline
                rows={4}
                variant="outlined"
                required
              />
            </Grid>
            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                endIcon={<SendIcon sx={{ transform: "rotate(180deg)" }} />}
                sx={{ py: 1.5, fontSize: "1.1rem" }}
              >
                שליחת הודעה
              </Button>
            </Grid>
            {status && (
              <Grid size={12}>
                <Typography color="success.main" align="center">
                  {status}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
export default ContactPage;
