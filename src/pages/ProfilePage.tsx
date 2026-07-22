import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  AccountCircle,
  AssignmentTurnedIn,
  Favorite,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import { useUser } from "../providers/UserProvider";
import useTasks from "../hooks/useTasks";
import useBoards from "../hooks/useBoards";
import useColumns from "../hooks/useColumns";
import { getHebrewPriority, getPriorityColor } from "../utils/tasksHelpers";
import ROUTES from "../router/routes";
import type { Task } from "../types/Task";
import type { Column } from "../types/Column";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const TaskList = ({ tasks, boards, columns }: { tasks: Task[]; boards: any[]; columns: Column[] }) => {
  const getBoardName = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column) return "לא ידוע";
    return boards.find((b) => b.id === column.board)?.name || "לא ידוע";
  };

  if (tasks.length === 0) {
    return <Typography sx={{ textAlign: "center", p: 3, color: "text.secondary" }}>אין משימות להצגה בקטגוריה זו.</Typography>;
  }

  return (
    <List component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
      {tasks.map((task, index) => (
        <div key={task.id}>
          <ListItem
            component={RouterLink}
            to={`${ROUTES.TASK_PAGE}${task.id}`}
            sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1, py: 2 }}
          >
            <ListItemText
              primary={task.title}
              secondary={`בתוך הלוח: ${getBoardName(task.column)}`}
              sx={{ flexGrow: 1, textAlign: 'right', width: '100%' }}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
              <Chip
                label={getHebrewPriority(task.priority)}
                color={getPriorityColor(task.priority)}
                size="small"
                variant="outlined"
              />
              <Typography variant="caption" color="text.secondary">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString("he-IL") : "ללא תאריך יעד"}
              </Typography>
            </Box>
          </ListItem>
          {index < tasks.length - 1 && <Divider />}
        </div>
      ))}
    </List>
  );
};


function ProfilePage() {
  const { user } = useUser();
  const { tasks, handleGetTasks, isLoading: isLoadingTasks } = useTasks();
  const { boards, handleGetBoards, isLoading: isLoadingBoards } = useBoards();
  const { columns, handleGetColumns, isLoading: isLoadingColumns } = useColumns();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    // Fetch all tasks from all boards
    handleGetTasks();
    handleGetBoards();
    handleGetColumns();
  }, [handleGetTasks, handleGetBoards, handleGetColumns]);

  const myTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter((task) => task.assigneeId === user.id);
  }, [tasks, user]);

  const likedTasks = useMemo(() => {
    if (!user) return [];
    // The request mentioned "משתמשים ששמרו" which implies a savedBy field
    return tasks.filter((task) => task.savedBy?.includes(user.id));
  }, [tasks, user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const isLoading = isLoadingTasks || isLoadingBoards || isLoadingColumns;

  return (
    <Container maxWidth="md" dir="rtl" sx={{ my: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            justifyContent: "center",
            gap: 2,
          }}
        >
          <AccountCircle sx={{ color: "primary.glow", fontSize: 40 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}
          >
            האזור האישי של {user?.nickname}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="profile tasks tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<AssignmentTurnedIn />}
              iconPosition="start"
              label={`המשימות שלי (${myTasks.length})`}
              id="profile-tab-0"
              aria-controls="profile-tabpanel-0"
            />
            <Tab
              icon={<Favorite />}
              iconPosition="start"
              label={`משימות שאהבתי (${likedTasks.length})`}
              id="profile-tab-1"
              aria-controls="profile-tabpanel-1"
            />
          </Tabs>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabIndex} index={0}>
              <TaskList tasks={myTasks} boards={boards} columns={columns} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <TaskList tasks={likedTasks} boards={boards} columns={columns} />
            </TabPanel>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default ProfilePage;