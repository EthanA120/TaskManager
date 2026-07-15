import { useEffect, useState, memo, useContext, useMemo } from "react";
import { Box, Fab, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PostAddOutlined, GridViewOutlined } from "@mui/icons-material";
import TaskFormDialog from "../components/TaskFormDialog";
import ColumnFormDialog from "../components/ColumnFormDialog";
import KanbanBoard from "../components/KanbanBoard";
import type { Task } from "../types/Task";
import useTasks from "../hooks/useTasks";
import useColumns from "../hooks/useColumns";
import { SnackContext } from "../providers/SnackProvider";
import type { Column } from "../types/Column";
import CircularProgress from "@mui/material/CircularProgress";

function BoardPage() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [editingColumn, setEditingColumn] = useState<Column | undefined>();

  const { raiseSnack } = useContext(SnackContext) as {
    raiseSnack: (
      color: "success" | "error" | "warning" | "info",
      message: string,
    ) => void;
  };

  const {
    tasks,
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
    handleGetTasks();
    handleGetColumns();
  }, [handleGetTasks, handleGetColumns]);

  const handleOpenAddTask = () => {
    if (columns.length === 0) {
      raiseSnack("warning", "יש ליצור לפחות עמודה אחת לפני הוספת משימה");
      return;
    }
    setEditingTask(undefined);
    setIsTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleOpenAddColumn = () => {
    setEditingColumn(undefined);
    setIsColumnDialogOpen(true);
  };

  const handleOpenEditColumn = (column: Column) => {
    setEditingColumn(column);
    setIsColumnDialogOpen(true);
  };

  const handleColumnSave = (data: Column | Pick<Column, "name">) => {
    if ("id" in data) {
      handleEditColumn(data);
    } else {
      handleAddColumn(data);
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
              הלוחות שלי
            </Typography>
          </Box>

          <Paper
            elevation={1}
            sx={{
              mt: 2,
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
        columnIds={columnIds}
        onMoveTask={moveTaskToColumn}
        onEditColumn={handleOpenEditColumn}
        onDeleteColumn={handleDeleteColumn}
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
      onClick={handleOpenAddTask}
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
      columns={columns}
      handleSave={handleTaskSave}
      initialValues={editingTask}
    />
  )
}
    </Box >
  );
}

export default memo(BoardPage);
