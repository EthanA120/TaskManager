import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useUser } from "../providers/UserProvider";
import { Navigate } from "react-router-dom";
import ROUTES from "../router/routes";

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם פרטי הוא שדה חובה",
    "string.min": "שם פרטי חייב להכיל לפחות 2 תווים",
    "any.required": "שם פרטי הוא שדה חובה",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם משפחה הוא שדה חובה",
    "string.min": "שם משפחה חייב להכיל לפחות 2 תווים",
    "any.required": "שם משפחה הוא שדה חובה",
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

  phone: Joi.string()
    .pattern(/^[0-9\-\+]{9,15}$/) // מאפשר מספרים, מקפים ופלוס, בין 9 ל-15 תווים
    .required()
    .messages({
      "string.empty": "מספר טלפון הוא שדה חובה",
      "string.pattern.base": "מספר הטלפון אינו תקין",
      "any.required": "מספר טלפון הוא שדה חובה",
    }),

  address: Joi.string().min(5).required().messages({
    "string.empty": "כתובת מגורים היא שדה חובה",
    "string.min": "הכתובת חייבת להיות מפורטת יותר",
    "any.required": "כתובת מגורים היא שדה חובה",
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
        {/* שדה שם פרטי */}
        <TextField
          {...register("firstName")}
          placeholder="First Name"
          fullWidth
          error={!!errors.firstName}
          helperText={errors.firstName?.message as string}
        />

        {/* שדה שם משפחה */}
        <TextField
          {...register("lastName")}
          placeholder="Last Name"
          fullWidth
          error={!!errors.lastName}
          helperText={errors.lastName?.message as string}
        />

        {/* שדה טלפון */}
        <TextField
          {...register("phone")}
          placeholder="Phone Number"
          type="tel"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message as string}
        />

        {/* שדה כתובת מגורים */}
        <TextField
          {...register("address")}
          placeholder="Address"
          multiline // מאפשר לכתובת ארוכה להתפרס על כמה שורות אם תרצה
          rows={2}
          fullWidth
          error={!!errors.address}
          helperText={errors.address?.message as string}
        />

        <Button variant="contained" type="submit">
          Sign up
        </Button>
      </Box>
    </form>
  );
}

export default RegisterPage;
