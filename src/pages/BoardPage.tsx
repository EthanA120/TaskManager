import { useEffect, useState, memo, useContext, useMemo } from "react";
import { Box, Fab, Typography, Button, Paper, Breadcrumbs, Link } from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Add as AddIcon, PostAddOutlined, GridViewOutlined, Home as HomeIcon } from "@mui/icons-material";
import TaskFormDialog from "../components/TaskFormDialog";
import ColumnFormDialog from "../components/ColumnFormDialog";
import KanbanBoard from "../components/KanbanBoard";
import type { Task } from "../types/Task";
import useTasks from "../hooks/useTasks";
import useColumns from "../hooks/useColumns";
import { SnackContext } from "../providers/SnackProvider";
import type { Column } from "../types/Column";
import CircularProgress from "@mui/material/CircularProgress";
import useBoards from "../hooks/useBoards";
import useUsers from "../hooks/useUsers";
import ROUTES from "../router/routes";

export type TaskSortOption = "title" | "dueDate" | "priority" | "status";


function BoardPage() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [selectedColumn, setSelectedColumn] = useState<Column | undefined>();
  const [editingColumn, setEditingColumn] = useState<Column | undefined>();
  const [sortConfig, setSortConfig] = useState<{
    [columnId: string]: { key: TaskSortOption; direction: "asc" | "desc" };
  }>({});

  const { boardId } = useParams<{ boardId: string }>();
  const { boards, handleGetBoards: handleGetBoardsList } = useBoards();
  const { users, handleGetUsers } = useUsers();
  const board = boards.find((b) => b.id === boardId);

  const { raiseSnack } = useContext(SnackContext) as {
    raiseSnack: (
      color: "success" | "error" | "warning" | "info",
      message: string,
    ) => void;
  };

  const {
    tasks,
    setTasks,
    handleAddNewTask,
    handleEditTask,
    handleDeleteTask,
    handleGetTasks,
    updateLikes,
    moveTaskToColumn,
    isLoading,
    error,
  } = useTasks();

  const {
    columns,
    handleGetColumns,
    handleAddColumn,
    handleEditColumn,
    handleDeleteColumn,
  } = useColumns();

  const columnIds = useMemo(
    () => new Set(columns.map((c) => c.id)),
    [columns],
  );

  useEffect(() => {
    handleGetBoardsList();
    handleGetUsers();
    handleGetTasks(boardId);
    handleGetColumns(boardId);
  }, [handleGetTasks, handleGetColumns, handleGetBoardsList, handleGetUsers, boardId]);

  const handleOpenAddTask = (column?: Column) => {
    if (columns.length === 0) {
      raiseSnack("warning", "יש ליצור לפחות עמודה אחת לפני הוספת משימה");
      return;
    }
    setSelectedColumn(column);
    setEditingTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setSelectedColumn(undefined);
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleOpenAddColumn = () => {
    setEditingColumn(undefined);
    setIsColumnDialogOpen(true);
  };

  const handleSortTasks = (sortBy: TaskSortOption, columnId: string) => {
    let direction: "asc" | "desc" = "asc";
    const currentSort = sortConfig[columnId];

    // If sorting by the same key, reverse the direction
    if (currentSort && currentSort.key === sortBy) {
      direction = currentSort.direction === "asc" ? "desc" : "asc";
    } else {
      // It's a new sort key
      direction = "asc";
    }

    const tasksToSort = tasks.filter((task) => task.column === columnId);
    const otherTasks = tasks.filter((task) => task.column !== columnId);

    tasksToSort.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortBy === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        valA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        valB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      } else if (sortBy === "dueDate") {
        valA = new Date(a.dueDate).getTime();
        valB = new Date(b.dueDate).getTime();
      } else {
        valA = a[sortBy as keyof Task];
        valB = b[sortBy as keyof Task];
      }

      if (valA < valB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setTasks([...otherTasks, ...tasksToSort]);
    setSortConfig(prev => ({ ...prev, [columnId]: { key: sortBy, direction } }));
  };

  const handleOpenEditColumn = (column: Column) => {
    setEditingColumn(column);
    setIsColumnDialogOpen(true);
  };

  const handleColumnSave = (data: Column | Omit<Column, "id" | "board">) => {
    if ("id" in data) {
      handleEditColumn(data);
    } else {
      handleAddColumn(data, boardId);
    }
  };

  const handleTaskSave = (data: Task | Omit<Task, "id">) => {
    if ("id" in data) {
      handleEditTask(data);
    } else {
      handleAddNewTask(data);
    }
  };

  const hasColumns = columns.length > 0;

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 10 }}>
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
        <Typography color="text.primary">
          {board?.name ?? 'טוען...'}
        </Typography>
      </Breadcrumbs>
      {!isLoading && !hasColumns ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" gutterBottom>
            אין עמודות — צור עמודה ראשונה כדי להתחיל
          </Typography>
          <Button
            variant="contained"
            startIcon={<PostAddOutlined />}
            onClick={handleOpenAddColumn}
            sx={{ mt: 2 }}
          >
            צור עמודה ראשונה
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              direction: "rtl"
            }}
          >
            <Box sx={{
              display: "flex",
              alignItems: "center",
              direction: "rtl"
            }}>
              <GridViewOutlined sx={{ color: "primary.glow", fontSize: 32, ml: 1 }} />
              <Typography variant="h4"
                component="h1"
                sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}>
                {board?.name}
              </Typography>
            </Box>

            <Paper
              elevation={1}
              sx={{
                mt: 1,
                p: 2,
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
                border: 1,
                borderColor: "divider",
              }}
              onClick={handleOpenAddColumn}
            >
              <PostAddOutlined sx={{ ml: 1 }} color="primary" />
              <Typography color="text.secondary">הוסף עמודה</Typography>
            </Paper>
          </Box>

          <KanbanBoard
            columns={columns}
            tasks={tasks}
            users={users}
            columnIds={columnIds}
            onMoveTask={moveTaskToColumn}
            onAddingTask={handleOpenAddTask}
            onSortingTask={handleSortTasks}
            onEditColumn={handleOpenEditColumn}
            onDeleteColumn={(columnId) => handleDeleteColumn(columnId, tasks)}
            handleEditTask={handleOpenEditTask}
            handleDeleteTask={handleDeleteTask}
            updateLikes={updateLikes}
          />
        </>
      )
      }

      <Fab
        color="secondary"
        aria-label="add column"
        onClick={handleOpenAddColumn}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          left: hasColumns ? { xs: 88, sm: 96 } : { xs: 16, sm: 24 },
        }}
      >
        <PostAddOutlined />
      </Fab>

      {
        hasColumns && (
          <Fab
            color="primary"
            aria-label="add task"
            onClick={() => handleOpenAddTask()}
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 24 },
              left: { xs: 16, sm: 24 },
            }}
          >
            <AddIcon />
          </Fab>
        )
      }

      {
        isColumnDialogOpen && (
          <ColumnFormDialog
            open={isColumnDialogOpen}
            onClose={() => setIsColumnDialogOpen(false)}
            initialValues={editingColumn}
            handleSave={handleColumnSave}
          />
        )
      }

      {
        isTaskDialogOpen && (
          <TaskFormDialog
            open={isTaskDialogOpen}
            onClose={() => setIsTaskDialogOpen(false)}
            users={users}
            columns={columns}
            handleSave={handleTaskSave}
            initialValues={editingTask}
            selectedColumnId={selectedColumn?.id}
          />
        )
      }
    </Box >
  );
}

export default memo(BoardPage);
