import { Box, IconButton, Paper, Typography, Menu, MenuItem } from "@mui/material";
import { AddBox as AddBoxIcon, Edit as EditIcon, Clear as ClearIcon, Sort as SortIcon } from "@mui/icons-material";
import { useDroppable } from "@dnd-kit/react";
import { memo, useState } from "react";
import type { Column as ColumnType } from "../types/Column";
import type { Task } from "../types/Task";
import { type TaskSortOption } from "../pages/BoardPage";
import DraggableTaskCard from "./DraggableTaskCard";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  columns: ColumnType[];
  onAddingTask: (column: ColumnType) => void;  onSortingTask: (sortBy: TaskSortOption, columnId: string) => void;
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
  onAddingTask,
  onSortingTask,
  onEditColumn,
  onDeleteColumn,
  handleEditTask,
  handleDeleteTask,
  updateLikes,
}: ColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickSort = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (sortBy: TaskSortOption) => {
    onSortingTask(sortBy, column.id);
    handleCloseSort();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        minWidth: 280,
        maxWidth: "100%",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: isDropTarget ? "action.hover" : column.color,
        transition: "background-color 0.2s",
      }}
    >
      {/* פקודות עמודה */}
      <Box
        sx={{
          minWidth: 280,
          maxWidth: "20vw",
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" component="h2" noWrap>
          {column.name}
        </Typography>
        <Box>
          <IconButton
            size="small"
            onClick={handleClickSort}
            aria-label="מיון"
          >
            <SortIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseSort}
          >
            <MenuItem onClick={() => handleSortSelect("title")}>
              מיין לפי שם
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect("dueDate")}>
              מיין לפי תאריך יעד
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect("priority")}>
              מיין לפי עדיפות
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect("status")}>
              מיין לפי סטטוס
            </MenuItem>
          </Menu>
          
          <IconButton
            size="small"
            onClick={() => onAddingTask(column)}
            aria-label="הוספת משימה"
          >
            <AddBoxIcon fontSize="small" />
          </IconButton>

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

      {/* מיכל פתקים */}
      <Box
        ref={ref}
        sx={{
          p: 1.5,
          flex: 1,
          minHeight: 200,
          overflowX: "scroll",
          display: "flex",
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
