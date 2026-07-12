import {
  Box,
  Button,
  TextField,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useUser } from "../providers/UserProvider";
import ROUTES from "../router/routes";
import { Navigate } from "react-router-dom";
import { Login as LoginIcon, Send as SendIcon } from "@mui/icons-material";

// 1. הגדרת סכימת הולידציה
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // ולידציה לאימייל תקני
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
    }),
  password: Joi.string()
    .min(6) // מינימום 6 תווים
    .required()
    .messages({
      "string.empty": "סיסמה היא שדה חובה",
      "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
    }),
});

function LoginPage() {
  // 2. חיבור ה-Resolver ל-useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(loginSchema),
  });
  const { login, user } = useUser();
  const onSubmit = async (data: any) => {
    await login(data.email, data.password);
    console.log("Form Data:", data);
  };

  if (user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return (
    <Container maxWidth="xs" dir="rtl">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              justifyContent: "center",
            }}
          >
            <LoginIcon sx={{ color: "primary.glow", fontSize: 30, ml: 1 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}
            >
              התחברות
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                {...register("email")}
                slotProps={{
                  input: { dir: "rtl" },
                  inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                }}
                label="אימייל"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />

              <TextField
                {...register("password")}
                slotProps={{
                  input: { dir: "rtl" },
                  inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                }}
                label="סיסמה"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message as string}
              />

              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
                startIcon={<SendIcon sx={{ ml: 1, transform: "rotate(180deg)" }} />}
              >
                התחבר
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
