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
import { Navigate } from "react-router-dom";
import ROUTES from "../router/routes";
import { PersonAddOutlined, Send as SendIcon } from "@mui/icons-material";

// 1. הגדרת סכימת הולידציה
const userSchema = Joi.object({
  nickname: Joi.string().min(2).max(50).required().messages({
    "string.empty": "כינוי הוא שדה חובה",
    "string.min": "כינוי חייב להכיל לפחות 2 תווים",
    "any.required": "כינוי הוא שדה חובה",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
      "any.required": "אימייל הוא שדה חובה",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
    "any.required": "סיסמה היא שדה חובה",
  }),
});

function RegisterPage() {
  // 2. חיבור ה-Resolver ל-useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(userSchema),
  });

  const { signup, user } = useUser();

  const onSubmit = (data: any) => {
    signup(data);
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
            <PersonAddOutlined sx={{ color: "primary.glow", fontSize: 30, ml: 1 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}
            >
              הרשמה
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
                {...register("nickname")}
                label="כינוי"
                fullWidth
                error={!!errors.nickname}
                helperText={errors.nickname?.message as string}
                slotProps={{
                  inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                }}
              />
              <TextField
                {...register("email")}
                label="אימייל"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message as string}
                slotProps={{
                  inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                }}
              />
              <TextField
                {...register("password")}
                label="סיסמה"
                type="password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message as string}
                slotProps={{
                  inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                }}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
                startIcon={<SendIcon sx={{ ml: 1, transform: "rotate(180deg)" }} />}
              >
                הרשמה
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default RegisterPage;
