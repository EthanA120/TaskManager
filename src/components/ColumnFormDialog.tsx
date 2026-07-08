import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { Column } from "../types/Column";

type ColumnFormValues = Pick<Column, "name">;

interface ColumnFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Column;
  handleSave: (data: Column | ColumnFormValues) => void;
}

function ColumnFormDialog({
  open,
  onClose,
  initialValues,
  handleSave,
}: ColumnFormDialogProps) {
  const { control, handleSubmit, reset } = useForm<ColumnFormValues>({
    defaultValues: initialValues ?? { name: "" },
  });

  const onSubmit = (data: ColumnFormValues) => {
    if (initialValues) {
      handleSave({ ...initialValues, ...data });
    } else {
      handleSave(data);
    }
    reset();
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
              rules={{ required: "זהו שדה חובה" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="שם העמודה"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  autoFocus
                />
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
