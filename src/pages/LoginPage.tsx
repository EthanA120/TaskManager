import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useUser } from "../providers/UserProvider";
import ROUTES from "../router/routes";
import { Navigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 300,
          mt: 4,
        }}
      >
        {/* שדה אימייל */}
        <TextField
          {...register("email")}
          placeholder="Email"
          error={!!errors.email} // צובע באדום אם יש שגיאה
          helperText={errors.email?.message as string} // מציג את הודעת השגיאה
        />

        {/* שדה סיסמה */}
        <TextField
          {...register("password")}
          placeholder="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message as string}
        />

        <Button variant="contained" type="submit">
          Login
        </Button>
      </Box>
    </form>
  );
}

export default LoginPage;
