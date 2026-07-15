import { Box, IconButton, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useDroppable } from "@dnd-kit/react";
import { memo } from "react";
import type { Column as ColumnType } from "../types/Column";
import type { Task } from "../types/Task";
import DraggableTaskCard from "./DraggableTaskCard";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  columns: ColumnType[];
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string, action: "inc" | "dec") => void;
}

function Column({
  column,
  tasks,
  columns,
  onEditColumn,
  onDeleteColumn,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
  });

  return (
    <Paper
      elevation={2}
      sx={{
        minWidth: 280,
        maxWidth: 320,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: isDropTarget ? "action.hover" : column.color,
        transition: "background-color 0.2s",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="h2" noWrap>
          {column.name}
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={() => onEditColumn(column)}
            aria-label="עריכת עמודה"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDeleteColumn(column.id)}
            aria-label="מחיקת עמודה"
          >
            <ClearIcon fontSize="small" sx={{ color: "error.main" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={ref}
        sx={{
          p: 1.5,
          flex: 1,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              columns={columns}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              updateLikes={updateLikes}
            />
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            אין משימות בעמודה
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default memo(Column);
