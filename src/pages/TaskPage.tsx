import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Breadcrumbs,
  Link,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";
import {
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AssignmentInd as AssignmentIndIcon,
  ViewColumn as ViewColumnIcon,
  StarBorderOutlined
} from "@mui/icons-material";

import { useParams, Link as RouterLink } from "react-router-dom";
import { Home as HomeIcon, Diversity1 } from "@mui/icons-material";
import { } from "@mui/icons-material/Home";
import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/Task";
import type { Board } from "../types/Board";
import type { Column } from "../types/Column";
import { getPriorityColor, getStatusColor, getHebrewStatus, getHebrewPriority } from "../utils/tasksHelpers";
import { getTaskById } from "../services/tasksDataServiceFireBase";
import { getColumnById } from "../services/columnsDataServiceFireBase";
import { getBoardById } from "../services/boardsDataServiceFireBase";
import useUsers from "../hooks/useUsers";
import ROUTES from "../router/routes";

export default function TaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [column, setColumn] = useState<Column | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { taskId } = useParams();
  const { users, handleGetUsers } = useUsers();

  const creator = users.find(u => u.id === task?.userId);
  const assignee = users.find(u => u.id === task?.assigneeId);

  const handleGetTask = useCallback(async () => {
    if (taskId) {
      try {
        const savedTask = await getTaskById(taskId);
        if (savedTask) {
          if ((savedTask.dueDate as any)?.seconds) {
            savedTask.dueDate = new Date((savedTask.dueDate as any).seconds * 1000);
          }
          setTask(savedTask);

          const parentColumn = await getColumnById(savedTask.column);
          if (parentColumn && parentColumn.board) {
            setColumn(parentColumn);
            const parentBoard = await getBoardById(parentColumn.board);
            setBoard(parentBoard);
          }
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      try {
        handleGetUsers();
        handleGetTask();
      } catch (e) {
        console.log("Error loading components");
      }
    }
  }, [taskId, handleGetTask, handleGetUsers]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: { xs: 2, sm: 4, md: 6 },
        bgcolor: "background.default", // רקע בהיר ונקי לעמוד כולו
        minHeight: "100vh",
        direction: "rtl",
      }}
    >
      <Box sx={{ dir: "rtl", maxWidth: 900, width: "100%" }}>
        {/* פירורי לחם עדינים בצד שמאל למעלה */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ direction: "rtl" }}>
            <Link
              component={RouterLink}
              to={ROUTES.HOME}
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.secondary"
              underline="hover"
            >
              <HomeIcon sx={{ ml: 0.5 }} fontSize="inherit" />
              בית
            </Link>
            {board && (
              <Link component={RouterLink} to={`${ROUTES.BOARD_PAGE}${board.id}`} color="text.secondary" underline="hover">
                {board.name}
              </Link>
            )}
            <Typography color="text.primary">{task?.title ?? 'טוען...'}</Typography>
          </Breadcrumbs>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ width: 40, height: 40 }} />
          </Box>
        ) : !task ? (
          <Typography variant="h6" sx={{ color: 'error.main', textAlign: 'center' }}>
            המשימה לא נמצאה.
          </Typography>
        ) : (
          <Card
            sx={{
              width: "100%",
              borderRadius: "16px",
              border: 1,
              borderColor: "divider",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.03)"
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>

              {/* Header: צ'יפים מימין, כותרת משמאל */}
              <Stack
                sx={{
                  flexDirection: { xs: "column", sm: "row-reverse" },
                  justifyContent: "space-between",
                  alignItems: { xs: "center", sm: "center" },
                  gap: (theme) => theme.spacing(3),
                  mb: 5
                }}
              >
                {/* צ'יפים בצד ימין (מעוגלים וסגורים כמו בתמונה) */}
                <Stack direction="column" spacing={1.5} sx={{ mt: { sm: 1 } }}>
                  <Chip
                    label={getHebrewPriority(task.priority)}
                    color={getPriorityColor(task.priority)}
                    variant="outlined"
                    sx={{ fontWeight: "bold", borderRadius: "20px", px: 1 }}
                  />
                  <Chip
                    label={getHebrewStatus(task.status)}
                    color={getStatusColor(task.status)}
                    sx={{ 
                      fontWeight: "bold", 
                      borderRadius: "20px", 
                      px: 1, 
                      color: (theme) => theme.palette.getContrastText(theme.palette[getStatusColor(task.status)].main) }}
                  />
                </Stack>

                {/* כותרת וכותרת משנה בצד שמאל */}
                <Box sx={{ textAlign: "right", flexGrow: 1 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{ fontWeight: 800, color: "text.primary", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 1 }}
                  >
                    {task.title}
                  </Typography>
                </Box>
              </Stack>

              {/* קוביית תיאור המשימה המעוצבת במדויק */}
              <Box
                sx={{
                  mb: 6,
                  p: 4,
                  bgcolor: "action.hover",
                  borderRadius: "12px",
                  position: "relative",
                  borderRight: "5px solid", // הפס הכחול האנכי שבצד
                  borderColor: "primary.main",
                  textAlign: "right"
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: "1.1rem",
                    color: "primary.glow"
                  }}
                  >
                  תיאור המשימה
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.8, fontSize: "0.95rem" }}
                  color="text.secondary">
                  {task.description || "אין תיאור זמין למשימה זו."}
                </Typography>
              </Box>

              {/* גריד פרטים תחתון אסימטרי ונקי */}
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                  gap: 3
                }}
              >

                {/* אחראי למוצר */}
                {assignee && (
                  <Stack sx={{ gap: 1, alignItems: "flex-start", textAlign: "right" }}>
                    <Stack sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.secondary"
                    }}>
                      <AssignmentIndIcon sx={{ fontSize: 16, ml: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>אחראי למשימה</Typography>
                    </Stack>

                    <Stack sx={{ flexDirection: "row", gap: 1.5, alignItems: "center" }}>
                      <Avatar src={assignee.avatarUrl} sx={{ width: 24, height: 24, border: 2, borderColor: 'background.paper', boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        {assignee.nickname.charAt(0)}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem" }}>
                        {assignee.nickname}
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                {/* תאריך יעד */}
                <Stack sx={{ gap: 1, alignItems: "flex-start", textAlign: "right" }}>
                  <Stack sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary"
                  }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>תאריך יעד</Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem" }}>
                    {task.dueDate ? task.dueDate.toLocaleDateString("he-IL", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                  </Typography>
                </Stack>

                {/* עמודה */}
                {column && (
                  <Stack sx={{ gap: 1, alignItems: "flex-start", textAlign: "right" }}>
                    <Stack sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.secondary"
                    }}>
                      <ViewColumnIcon sx={{ fontSize: 16, ml: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>עמודה</Typography>
                    </Stack>
                    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, bgcolor: "primary.main" }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem" }}>
                        {column.name}
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                {/* אהבו את המשימה (עם אפקט ערימת אוואטרים כמו בתמונה) */}
                <Stack sx={{ gap: 1, alignItems: "flex-start", textAlign: "right" }}>
                  <Stack sx={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary"
                  }}>
                    <StarBorderOutlined sx={{ fontSize: 16, ml: 0.5 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>תיעדפו את המשימה</Typography>
                  </Stack>
                  <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <Diversity1 max={4} sx={{ direction: "ltr" }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "#0056b3", fontSize: "0.75rem" }}>+9</Avatar>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "#94a3b8" }} />
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "#cbd5e1" }} />
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "#e2e8f0" }} />
                    </Diversity1>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.5rem" }}>
                      {task.likes || 0}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* נוצר על ידי */}
              {creator && (
                <Stack sx={{
                  pb: 2,
                  alignItems: "flex-end",
                  textAlign: "right"
                }}>
                  <Box sx={{
                    px: 1,
                    borderRight: "1px solid",
                    borderColor: "primary.main",
                  }}>
                    <Stack sx={{
                      mb: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 0.5,
                      color: "text.secondary"
                    }}>
                      <PersonIcon sx={{ fontSize: 16, ml: 0.5 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>נוצר על ידי</Typography>
                    </Stack>
                    <Stack sx={{ flexDirection: "row", gap: 1.5, alignItems: "center" }}>
                      <Avatar sx={{ width: 24, height: 24, border: 2, borderColor: 'background.paper', boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        {creator.nickname.charAt(0)}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem" }}>
                        {creator.nickname}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              )}

            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}