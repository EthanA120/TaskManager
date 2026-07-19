import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Column } from "../types/Column";
import type { Task } from "../types/Task";

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Task;
  columns: Column[];
  handleSave: (data: Task) => void;
  selectedColumnId?: string;
}

function TaskFormDialog({
  open,
  onClose,
  handleSave,
  initialValues,
  columns,
  selectedColumnId,
}: TaskFormDialogProps) {
  const { control, handleSubmit, reset } = useForm<Task>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        initialValues ?? {
          title: "",
          description: "",
          status: "pending",
          dueDate: new Date(),
          priority: "medium",
          column: selectedColumnId ?? columns[0]?.id ?? "",
        },
      );
    }
  }, [open, initialValues, reset, columns, selectedColumnId]);

  const onSubmit = (data: Task) => {
    handleSave(data);
    // איפוס הטופס וסגירה
    // reset(); // Reset is now handled in useEffect
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialValues ? "עריכת משימה" : "הוספת משימה חדשה"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            {/* כותרת המשימה */}
            <Controller
              name="title"
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

            {/* תיאור המשימה */}
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

            {/* הוסף לעמודה */}
            <Controller
              name="column"
              control={control}
              rules={{ required: "יש לבחור עמודה" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  
                  select
                  label="עמודה"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                >
                  {columns.map((col) => (
                    <MenuItem key={col.id} value={col.id}>
                      {col.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Stack direction="row" spacing={2}>
              {/* סטטוס */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="סטטוס" fullWidth>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                )}
              />

              {/* עדיפות */}
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="עדיפות" fullWidth>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>
                )}
              />
            </Stack>

            {/* תאריך יעד - שימוש ב-Native HTML Date input לצורך הפשטות */}
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תאריך יעד"
                  type="date"
                  fullWidth
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
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
            {initialValues ? "שמור עריכה" : "צור משימה"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskFormDialog;
