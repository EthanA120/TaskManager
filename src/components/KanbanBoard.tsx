import { Box } from "@mui/material";
import { DragDropProvider } from "@dnd-kit/react";
import { memo } from "react";
import type { Column as ColumnType } from "../types/Column";
import type { Task } from "../types/Task";
import Column from "./Column";

interface KanbanBoardProps {
  columns: ColumnType[];
  tasks: Task[];
  columnIds: Set<string>;
  onMoveTask: (taskId: string, columnId: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string, action: "inc" | "dec") => void;
}

function KanbanBoard({
  columns,
  tasks,
  columnIds,
  onMoveTask,
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
          gap: 2,
          overflowX: "auto",
          pb: 2,
          alignItems: "flex-start",
        }}
      >
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((t) => t.column === column.id)}
            columns={columns}
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
