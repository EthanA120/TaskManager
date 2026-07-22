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
import { getStatusColor, getHebrewStatus } from "../utils/tasksHelpers";
import ROUTES from "../router/routes";
import { memo, useContext } from "react";
import { Edit as EditIcon, Clear as ClearIcon, BookmarkAddOutlined, BookmarkOutlined } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
  ProjectThemeContext,
  type ThemeContextType,
} from "../providers/ProjectThemeProvider";

import type { User } from "../types/User";
import type { Task } from "../types/Task";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

interface TaskProps {
  task: Task;
  users: User[];
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string) => void;
}

function TaskCard({
  task,
  users,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: TaskProps) {
  const navigate = useNavigate();
  const { isDark } = useContext(ProjectThemeContext) as ThemeContextType;
  const [currentUser] = useAuthState(auth);

  const taskOwner = users.find((user) => user.id === task.userId);
  const ownerName = taskOwner?.nickname ?? "לא ידוע";

  const isLiked = !!currentUser && !!task.savedBy?.includes(currentUser.uid);
  console.log("currentUser.uid", currentUser?.uid);

  const assignee = users.find((user) => user.id === task.assigneeId);
  const assigneeName = assignee?.nickname;

  // הגדרת אורך מקסימלי משוער ל-3 שורות
  const isLongDescription = task.description && task.description.length > 95;

  return (
    <Card
      sx={{
        minHeight: 250,
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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch", // מבטיח פריסה נכונה של ה-ActionArea
        }}
      >
        <CardContent>
          {/* Title */}
          <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'right' }}>
            {task.title}
          </Typography>

          {/* תוכן הכרטיס - מוגבל בגובה עם 3 נקודות בסוף */}
          <Box sx={{ height: 85, overflow: 'hidden', position: 'relative', mb: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: 'right',
                display: '-webkit-box',
                WebkitLineClamp: 3, // מגביל את הטקסט ל-3 שורות
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {task.description}
            </Typography>

            {/* הלינק יופיע רק אם התיאור באמת ארוך מספיק כדי להיחתך */}
            {isLongDescription && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'right',
                  mt: 0.5,
                  color: isDark ? "#90caf9" : "#1976d2",
                  fontWeight: 'bold'
                }}
              >
                המשך לקרוא...
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
              <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
              <Typography variant="caption">
                {task.dueDate instanceof Date
                  ? task.dueDate.toLocaleDateString("he-IL")
                  : "אין תאריך"}
              </Typography>
            </Box>

            {assigneeName && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', dir: "rtl" }}>
                אחראי: {assigneeName}
              </Typography>
            )}
          </Box>

          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRight: "1px solid #ccc",
            mt: 2,
            p: 1,
          }}>

            {ownerName && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', dir: "rtl" }}>
                יוצר המשימה: {ownerName}
              </Typography>
            )}
            <Chip
              label={getHebrewStatus(task.status)}
              color={getStatusColor(task.status)}
              variant="filled"
              sx={{
                textTransform: "capitalize",
                alignSelf: "flex-end" // מיישר את הצ'יפ לימין בהתאם לשפה
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* אזור הפעולות - ה-onClick עבר ל-IconButton המרכזי כדי למנוע פספוס לחיצות */}
      <CardActions disableSpacing sx={{
        justifyContent: "flex-start",
      }}>
        <IconButton onClick={() => handleEditTask(task)} aria-label="Edit task">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteTask(task.id)} aria-label="Delete task">
          <ClearIcon sx={{ color: "red" }} />
        </IconButton>
        <IconButton onClick={() => updateLikes(task.id)} aria-label="Like">
          {isLiked ? 
            <BookmarkOutlined sx={{ color: isDark ? "#f4d438" : "#ffdd00" }} />
            : 
            <BookmarkAddOutlined sx={{ color: "text.secondary"}} />
          }
        </IconButton>
        <Typography sx={{ ml: 1, fontWeight: "bold" }}>{task.likes}</Typography>
      </CardActions>
    </Card>
  );
}

export default memo(TaskCard);