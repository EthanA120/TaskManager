import { useEffect, useState, memo, useContext, useMemo } from "react";
import {
  Box,
  Fab,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { PostAddOutlined } from "@mui/icons-material";
import TaskFormDialog from "../components/TaskFormDialog";
import ColumnFormDialog from "../components/ColumnFormDialog";
import KanbanBoard from "../components/KanbanBoard";
import useTasks from "../hooks/useTasks";
import useColumns from "../hooks/useColumns";
import { SnackContext } from "../providers/SnackProvider";
import type { Column } from "../types/Column";
import CircularProgress from "@mui/material/CircularProgress";

function HomePage() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
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

  const handleTaskFabClick = () => {
    if (columns.length === 0) {
      raiseSnack("warning", "יש ליצור לפחות עמודה אחת לפני הוספת משימה");
      return;
    }
    setIsTaskDialogOpen((prev) => !prev);
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

  const hasColumns = columns.length > 0;

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      {!hasColumns ? (
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
          <KanbanBoard
            columns={columns}
            tasks={tasks}
            columnIds={columnIds}
            onMoveTask={moveTaskToColumn}
            onEditColumn={handleOpenEditColumn}
            onDeleteColumn={handleDeleteColumn}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            updateLikes={updateLikes}
          />

          <Paper
            elevation={1}
            sx={{
              mt: 2,
              p: 2,
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              border: 1,
              borderStyle: "dashed",
              borderColor: "divider",
            }}
            onClick={handleOpenAddColumn}
          >
            <PostAddOutlined sx={{ mr: 1 }} color="action" />
            <Typography color="text.secondary">הוסף עמודה</Typography>
          </Paper>
        </>
      )}

      <Fab
        color="secondary"
        aria-label="add column"
        onClick={handleOpenAddColumn}
        sx={{
          position: "fixed",
          bottom: 16,
          right: hasColumns ? 88 : 16,
        }}
      >
        <PostAddOutlined />
      </Fab>

      {hasColumns && (
        <Fab
          color={isTaskDialogOpen ? "secondary" : "primary"}
          aria-label="add task"
          onClick={handleTaskFabClick}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          {isTaskDialogOpen ? <CloseIcon /> : <AddIcon />}
        </Fab>
      )}

      {isColumnDialogOpen && (
        <ColumnFormDialog
          open={isColumnDialogOpen}
          onClose={() => setIsColumnDialogOpen(false)}
          initialValues={editingColumn}
          handleSave={handleColumnSave}
        />
      )}

      {isTaskDialogOpen && hasColumns && (
        <TaskFormDialog
          open={isTaskDialogOpen}
          onClose={() => setIsTaskDialogOpen(false)}
          columns={columns}
          handleSave={handleAddNewTask}
        />
      )}
    </Box>
  );
}

export default memo(HomePage);
