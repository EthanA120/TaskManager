import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import boardColors from "../utils/cardColors";
import { useForm, Controller } from "react-hook-form";
import type { Board } from "../types/Board";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

export interface BoardFormData {
  name: string;
  description: string;
  color: string;
}

const boardSchema = Joi.object<BoardFormData>({
  name: Joi.string().min(2).max(20).required().messages({
    "string.empty": "שם הלוח הוא שדה חובה",
    "string.min": "שם הלוח חייב להכיל לפחות 2 תווים",
    "string.max": "שם הלוח יכול להכיל עד 20 תווים",
    "any.required": "שם הלוח הוא שדה חובה",
  }),
  description: Joi.string().max(200).allow("").messages({
    "string.max": "תיאור הלוח יכול להכיל עד 200 תווים",
  }),
  color: Joi.string().required(),
});

interface BoardFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Board;
  handleSave: (data: BoardFormData, id?: string, color?: string, createdAt?: number) => void;
}

function BoardFormDialog({
  open,
  onClose,
  handleSave,
  initialValues,
}: BoardFormDialogProps) {
  const {
    control, handleSubmit, reset, formState: { errors }
  } = useForm<BoardFormData>({
    resolver: joiResolver(boardSchema), // חיבור הסכימה ל-React Hook Form
    mode: 'onTouched', // ולידציה תתבצע ברגע שהמשתמש יוצא מהשדה
    defaultValues: { name: "", description: "", color: "#FFFFFF" },
  });

  // מאפס את הטופס עם הערכים ההתחלתיים (במצב עריכה)
  // או עם ערכים ריקים (במצב יצירה)
  useEffect(() => {
    if (open) {
      reset({
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
        color: initialValues?.color ?? "#FFFFFF",
      });
    }
  }, [open, initialValues, reset]);

  const onSubmit = (data: BoardFormData) => {
    handleSave(data, initialValues?.id);
    onClose();
  };

  return (
    <Dialog dir="rtl" open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle color="primary">
        {initialValues ? "עריכת לוח" : "הוספת לוח חדש"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* כותרת המשימה */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field} // מעביר אוטומטית value, onChange, onBlur ו-ref
                  label="כותרת"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  slotProps={{
                    inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                  }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                const maxLength = 200;
                const currentLength = field.value?.length || 0;
                return (
                  <TextField
                    {...field}
                    label="תיאור"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    slotProps={{
                      inputLabel: { sx: { transformOrigin: "top right", right: 28, left: "auto" } }
                    }}
                    helperText={
                      <Box
                        component="span"
                        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
                      >
                        <span>{errors.description?.message}</span>
                        <span>{`${currentLength}/${maxLength}`}</span>
                      </Box>
                    }
                  />
                );
              }}
            />

            <Controller
              name="color"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Typography gutterBottom dir="rtl">בחר צבע</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {boardColors.map(
                      (color) => (
                        <Box
                          key={color}
                          onClick={() => field.onChange(color)}
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: color,
                            borderRadius: "50%",
                            cursor: "pointer",
                            border:
                              field.value === color
                                ? "3px solid #1976d2"
                                : "1px solid #ccc",
                            outlineOffset: "2px",
                          }}
                        />
                      ),
                    )}
                  </Box>
                  {error && (
                    <Typography color="error" variant="caption">
                      {error.message}
                    </Typography>
                  )}
                </div>
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            ביטול
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? "שמור שינויים" : "צור לוח"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BoardFormDialog;