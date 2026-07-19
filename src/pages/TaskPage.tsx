import { Card, CardContent, Typography, Chip, Box, Divider, Breadcrumbs, Link } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/Task";
import type { Board } from "../types/Board";
import { getPriorityColor, getStatusColor } from "../utils/tasksHelpers";
import { getTaskById } from "../services/tasksDataServiceFireBase";
import { getColumnById } from "../services/columnsDataServiceFireBase";
import { getBoardById } from "../services/boardsDataServiceFireBase";
import ROUTES from "../router/routes";
import HomeIcon from "@mui/icons-material/Home";

export default function TaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const { taskId } = useParams();


  const handleGetTask = useCallback(async () => {
    if (taskId) {
      try {
        const savedTask = await getTaskById(taskId);
        if (savedTask) {
          // Convert Firestore timestamp to Date
          if ((savedTask.dueDate as any)?.seconds) {
            savedTask.dueDate = new Date((savedTask.dueDate as any).seconds * 1000);
          }
          setTask(savedTask);

          // Fetch column and then board
          const column = await getColumnById(savedTask.column);
          if (column && column.board) {
            const parentBoard = await getBoardById(column.board);
            setBoard(parentBoard);
          }
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        // Optionally, set an error state to show in the UI
      }
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      try {
        handleGetTask();
      } catch (e) {
        console.log("tasks is not a valid json");
      }
    }
  }, [taskId]);

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
      <Box sx={{ maxWidth: 600, width: "100%" }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, direction: "rtl" }}>
          <Link
            component={RouterLink}
            to={ROUTES.HOME}
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            underline="hover"
          >
            <HomeIcon sx={{ml: 0.5, mr: 0.5 }} fontSize="inherit" />
            בית
          </Link>
          {board && (
            <Link component={RouterLink} to={`${ROUTES.BOARD_PAGE}${board.id}`} color="inherit" underline="hover">
              {board.name}
            </Link>
          )}
          <Typography color="text.primary">
            {task?.title ?? 'טוען...'}
          </Typography>
        </Breadcrumbs>

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
    </Box>
  );
}
