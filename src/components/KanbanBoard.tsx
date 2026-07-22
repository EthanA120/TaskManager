import { Box } from "@mui/material";
import { DragDropProvider } from "@dnd-kit/react";
import { memo } from "react";
import type { Column as ColumnType } from "../types/Column";
import type { Task } from "../types/Task";
import { type TaskSortOption } from "../pages/BoardPage";
import type { User } from "../types/User";
import Column from "./Column";

interface KanbanBoardProps {
  columns: ColumnType[];
  tasks: Task[];
  users: User[];
  columnIds: Set<string>;
  onMoveTask: (taskId: string, columnId: string) => void;
  onAddingTask: (column: ColumnType) => void;  onSortingTask: (sortBy: TaskSortOption, columnId: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string) => void;
}

function KanbanBoard({
  columns,
  tasks,
  users,
  columnIds,
  onMoveTask,
  onAddingTask,
  onSortingTask,
  onEditColumn,
  onDeleteColumn,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: KanbanBoardProps) {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const taskId = event.operation.source?.id;
        const targetId = event.operation.target?.id;

        if (
          taskId == null ||
          targetId == null ||
          !columnIds.has(String(targetId))
        ) {
          return;
        }

        onMoveTask(String(taskId), String(targetId));
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          direction: "rtl", // alignItems: "stretch" is the default and will make columns take full width
        }}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((t) => t.column === column.id)}
            users={users}
            columns={columns}
            onAddingTask={onAddingTask}
            onSortingTask={onSortingTask}
            onEditColumn={onEditColumn}
            onDeleteColumn={onDeleteColumn}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            updateLikes={updateLikes}
          />
        ))}
      </Box>
    </DragDropProvider>
  );
}

export default memo(KanbanBoard);
