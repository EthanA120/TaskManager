import { Box, IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useDraggable } from "@dnd-kit/react";
import { memo } from "react";
import type { User } from "../types/User";
import type { Task } from "../types/Task";
import TaskCard from "./TaskCard";

interface DraggableTaskCardProps {
  task: Task;
  users: User[];
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string) => void;
}

function DraggableTaskCard({
  task,
  users,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: DraggableTaskCardProps) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: task.id,
    data: { columnId: task.column },
  });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        display: "flex",
        gap: 0.5,
        alignItems: "flex-start",
      }}
    >
      <IconButton
        ref={handleRef}
        size="small"
        aria-label="גרור משימה"
        sx={{ mt: 1, cursor: "grab" }}
      >
        <DragIndicatorIcon />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TaskCard
          task={task}
          users={users}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          updateLikes={updateLikes}
        />
      </Box>
    </Box>
  );
}

export default memo(DraggableTaskCard);
