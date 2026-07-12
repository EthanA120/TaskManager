import { Container, Typography, Box, TextField, Button, Paper, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { CheckCircle, HistoryEdu, Send } from "@mui/icons-material";

const ContactPage = () => {
  const [status, setStatus] = useState("");
  const [state, handleSubmit] = useForm("xnjjnlvy");

  useEffect(() => {
    if (state.succeeded) {
      setStatus("ההודעה נשלחה בהצלחה!");
    }
  }, [state.succeeded]);

  return (
    <Container maxWidth="md" dir="rtl">
      <Box sx={{ maxWidth: "600px", mx: "auto", mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: "center",
            }}
          >
            <HistoryEdu sx={{ color: "primary.glow", fontSize: 40, ml: 1 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}
            >
              שלחו הודעה
            </Typography>
          </Box>

          {/* פסקאות תיאור */}
          <Box sx={{ dir: "rtl", display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
            <Typography variant="body1" color="text.secondary">
              נשמח מאוד לשמוע את דעתכם,
              לקבל משוב או לענות על שאלותיכם.
            </Typography>
          </Box>


          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  id="fullName"
                  name="fullName"
                  slotProps={{
                    input: { dir: "rtl" },
                    inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                  }}
                  fullWidth
                  label="שם מלא"
                  variant="outlined"
                  required />
                <ValidationError
                  prefix="FullName"
                  field="fullName"
                  errors={state.errors}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  id="email"
                  name="email"
                  slotProps={{
                    input: { dir: "rtl" },
                    inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                  }}
                  fullWidth
                  label="אימייל"
                  type="email"
                  variant="outlined"
                  required
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  id="message"
                  name="message"
                  slotProps={{
                    input: { dir: "rtl" },
                    inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                  }}
                  fullWidth
                  label="הודעה"
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                />
              </Grid>

              <Grid size={12}>
                {state.succeeded ? (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: "#e0f2f1", // רקע ירוק בהיר
                      border: "1px solid #b2dfdb", // גבול ירוק
                      color: "#004d40", // טקסט ירוק כהה
                      textAlign: "center",
                    }}
                  >
                    <CheckCircle sx={{ mr: 1 }} />
                    <Typography>{status}</Typography>
                  </Box>
                ) : (
                  <Button
                    disabled={state.submitting}
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    startIcon={<Send sx={{ ml: 1, transform: "rotate(180deg)" }} />}
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    שליחת הודעה
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
export default ContactPage;
