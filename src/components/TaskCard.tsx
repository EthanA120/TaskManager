import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Task } from "../types/Task";
import ROUTES from "../router/routes";
import EditIcon from "@mui/icons-material/Edit";
import { memo, useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../providers/ProjectThemeProvider";


interface TaskProps {
  task: Task;
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string, action: "inc" | "dec") => void;
}

function TaskCard({
  task,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: TaskProps) {
  const navigate = useNavigate();
  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;


  return (
    <Card
      sx={{
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "background.paper",
      }}
      elevation={3}
    >
      <CardActionArea
        onClick={() => {
          navigate(ROUTES.TASK_PAGE + task.id);
        }}
      >
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Chip
            label={task.status}
            color={task.status === "completed" ? "success" : "warning"}
            variant="filled"
            sx={{ textTransform: "capitalize" }}
          />
        </Box>
      </CardActionArea>
      <CardActions disableSpacing>
        <IconButton onClick={() => handleEditTask(task)} aria-label="Edit task">
          <EditIcon />
        </IconButton>
        <IconButton>
          <ClearIcon
            sx={{ color: "red" }}
            onClick={() => handleDeleteTask(task.id)}
            aria-label="Delete task"
          />
        </IconButton>
        <IconButton>
          <ThumbUpIcon
            sx={{ color: isDark ? "#90caf9" : "#1976d2" }}
            onClick={() => updateLikes(task.id, "inc")}
            aria-label="Like"
          />
        </IconButton>
        <IconButton>
          <ThumbDownIcon
            sx={{ color: isDark ? "#f48fb1" : "#d32f2f" }}
            onClick={() => updateLikes(task.id, "dec")}
            aria-label="DisLike"
          />
        </IconButton>
        <Typography>{task.likes}</Typography>
      </CardActions>
    </Card>
  );
}
export default memo(TaskCard);
