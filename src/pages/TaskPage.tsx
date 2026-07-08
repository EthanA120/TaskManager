import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/Task";
import { getPriorityColor, getStatusColor } from "../utils/tasksHelpers";
import { getTaskById } from "../services/tasksDataServiceFireBase";

export default function TaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const { id } = useParams();
  const handleGetTask = useCallback(async () => {
    if (id) {
      const savedTask = await getTaskById(id);
      if (savedTask) {
        savedTask.dueDate = new Date((savedTask.dueDate as any).seconds * 1000);
        setTask(savedTask);
      }
    }
  }, [setTask]);

  useEffect(() => {
    if (id) {
      try {
        handleGetTask();
      } catch (e) {
        console.log("tasks is not a valid json");
      }
    }
  }, [id]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 4,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{ maxWidth: 500, width: "100%", borderRadius: 2, boxShadow: 2 }}
      >
        {task ? (
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h1" color="text.primary">
                {task.title}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label={task.priority.toUpperCase()}
                  color={getPriorityColor(task.priority)}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={task.status.toUpperCase()}
                  color={getStatusColor(task.status)}
                  size="small"
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {task.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Due: {task.dueDate.toLocaleDateString("en-GB")}
              </Typography>
            </Box>
          </CardContent>
        ) : null}
      </Card>
    </Box>
  );
}
