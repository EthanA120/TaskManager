import { Box, IconButton, Paper, Typography, Menu, MenuItem, Popover } from "@mui/material";
import { AddBox as AddBoxIcon, Edit as EditIcon, Clear as ClearIcon, Sort as SortIcon, Palette as PaletteIcon } from "@mui/icons-material";
import { useDroppable } from "@dnd-kit/react";
import { memo, useState } from "react";
import type { Column as ColumnType } from "../types/Column";
import type { Task } from "../types/Task";
import { type TaskSortOption } from "../pages/BoardPage";
import cardsColors from "../utils/cardColors";
import type { User } from "../types/User";
import DraggableTaskCard from "./DraggableTaskCard";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  users: User[];
  columns: ColumnType[];
  onAddingTask: (column: ColumnType) => void; onSortingTask: (sortBy: TaskSortOption, columnId: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  handleEditTask: (data: Task) => void;
  handleDeleteTask: (id: string) => void;
  updateLikes: (id: string) => void;
}

function Column({
  column,
  tasks,
  users,
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

  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);
  const isColorPickerOpen = Boolean(colorAnchorEl);

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

  const handleOpenColorPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setColorAnchorEl(null);
  };

  const handleColorSelect = (color: string) => {
    onEditColumn({ ...column, color });
    handleCloseColorPicker();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        minWidth: 280,
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        bgcolor: isDropTarget ? "action.hover" : column.color,
        transition: "background-color 0.2s",
      }}
    >

      <Box
        sx={{
          minWidth: 280,
          // maxWidth: "fit-content",
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {/* פקודות עמודה */}
        <Typography variant="h5" component="h2" noWrap>
          {column.name}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
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
            onClick={handleOpenColorPicker}
            aria-label="שינוי צבע"
          >
            <PaletteIcon fontSize="small" />
          </IconButton>
          <Popover
            open={isColorPickerOpen}
            anchorEl={colorAnchorEl}
            onClose={handleCloseColorPicker}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box dir="rtl" sx={{ p: 1, display: 'flex', gap: 1 }}>
              {cardsColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: column.color === color ? '2px solid' : '1px solid',
                    borderColor: column.color === color ? 'primary.main' : 'divider',
                  }}
                />
              ))}
            </Box>
          </Popover>

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
          display: "grid",
          // יוצר רשת עם עמודות ברוחב קבוע של 300px
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 1.5,
          minHeight: 200, // גובה מינימלי כדי שהאזור יגיב לגרירה גם כשהוא ריק
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              users={users}
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
