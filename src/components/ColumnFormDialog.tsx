import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
} from "@mui/material";
import cardsColors from "../utils/cardColors";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Column } from "../types/Column";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

export interface ColumnFormData {
  name: string;
  color: string;
}

const columnSchema = Joi.object<ColumnFormData>({
  name: Joi.string().min(2).max(20).required().messages({
    "string.empty": "שם הלוח הוא שדה חובה",
    "string.min": "שם הלוח חייב להכיל לפחות 2 תווים",
    "string.max": "שם הלוח יכול להכיל עד 20 תווים",
    "any.required": "שם הלוח הוא שדה חובה",
  }),

  color: Joi.string().required(),
});

interface ColumnFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Column;
  handleSave: (data: Column | Omit<Column, "id" | "board">) => void;
}

function ColumnFormDialog({
  open,
  onClose,
  handleSave,
  initialValues,
}: ColumnFormDialogProps) {
  const {
    control, handleSubmit, reset, formState: { errors }
  } = useForm<ColumnFormData>({
    resolver: joiResolver(columnSchema), // חיבור הסכימה ל-React Hook Form
        mode: 'onTouched', // ולידציה תתבצע ברגע שהמשתמש יוצא מהשדה
        defaultValues: { name: "", color: "#FFFFFF" },
  });

  useEffect(() => {
      if (open) {
        reset({
          name: initialValues?.name ?? "",
          color: initialValues?.color ?? "#FFFFFF",
        });
      }
    }, [open, initialValues, reset]);
  
    const onSubmit = (data: ColumnFormData) => {
      if (initialValues) {
        handleSave({ ...initialValues, ...data });
      } else {
        // When creating a new column, include required fields from Column type
        handleSave({ ...data, createdAt: Number(new Date().toISOString()) });
      }
      onClose();
    };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {initialValues ? "עריכת עמודה" : "הוספת עמודה חדשה"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="שם העמודה"
                  fullWidth
                  error={!!error}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="color"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Typography gutterBottom>בחר צבע</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {cardsColors.map(
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
            {initialValues ? "עריכה" : "צור עמודה"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ColumnFormDialog;
