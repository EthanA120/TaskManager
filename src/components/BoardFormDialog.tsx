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
import { useForm, Controller} from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import type { Board } from "../types/Board";
import Joi from "joi";

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

interface BoardFormData {
  name: string;
  description: string;
  color: string;
}

interface BoardFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Board;
  handleSave: (data: BoardFormData, id?: string) => void;
}

function BoardFormDialog({
  open,
  onClose,
  handleSave,
  initialValues,
}: BoardFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<BoardFormData>({
    resolver: joiResolver(boardSchema),
    defaultValues: { name: "", description: "", color: "#FFFFFF" },
  });

  useEffect(() => {
    if (open) {
      if (initialValues) {
        // השתמש ב-setValue כדי להפעיל ולידציה מיידית
        setValue("name", initialValues.name, { shouldValidate: true });
        setValue("description", initialValues.description, { shouldValidate: true });
        setValue("color", initialValues.color, { shouldValidate: true });
      } else {
        reset({ name: "", description: "", color: "#FFFFFF" });
      }
    }
  }, [open, initialValues, reset]);

  const onSubmit = (data: BoardFormData) => {
    handleSave(data, initialValues?.id);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialValues ? "עריכת לוח" : "הוספת לוח חדש"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* כותרת המשימה */}
            <Controller
              name="name"
              control={control}
              rules={{ required: "זהו שדה חובה" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="כותרת"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תיאור"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

            <Controller
              name="color"
              control={control}
              rules={{ required: "יש לבחור צבע" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Typography gutterBottom>בחר צבע</Typography>
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
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {initialValues ? "שמור שינויים" : "צור לוח"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BoardFormDialog;