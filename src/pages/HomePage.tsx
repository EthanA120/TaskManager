import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  CardActionArea,
  Button,
  Menu,
  MenuItem,
  Fab,
  Paper,
  CardActions,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  GridViewOutlined,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import useBoards from "../hooks/useBoards";
import ROUTES from "../router/routes";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import boardColors from "../utils/cardColors";
import BoardFormDialog from "../components/BoardFormDialog";
import type { BoardFormData } from "../components/BoardFormDialog";
import type { Board } from "../types/Board";

function HomePage() {
  const {
    boards,
    handleGetBoards,
    handleAddBoard,
    handleEditBoard,
    handleDeleteBoard,
    isLoading,
    error,
  } = useBoards();
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | undefined>();

  // State for color picker menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBoardForColor, setSelectedBoardForColor] = useState<
    Board | undefined
  >();
  const isColorMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    handleGetBoards();
  }, [handleGetBoards]);

  const onSaveBoard = (data: BoardFormData, id?: string) => {
    if (id) {
      handleEditBoard(id, data);
    } else {
      handleAddBoard(data);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedBoardForColor) {
      handleEditBoard(selectedBoardForColor.id, { color });
    }
    setAnchorEl(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography
          color="error"
          sx={{ mt: 4, textAlign: "center" }}
          variant="h6"
        >
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container dir="rtl" maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <GridViewOutlined sx={{ color: "primary.glow", fontSize: 32, ml: 1 }} />
        <Typography variant="h4"
          component="h1"
          sx={{ color: "primary.glow", typography: { xs: "h5", md: "h4" } }}>
          הלוחות שלי
        </Typography>
      </Box>

      {!boards || boards.length === 0 ? (
        <Paper sx={{ textAlign: "center", p: { xs: 3, sm: 6 }, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            נראה שאין לוחות...
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsBoardDialogOpen(true)}
          >
            <Typography variant="button" align="center" >
              הוסף לוח
            </Typography>
            <AddIcon />
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {boards.map((board) => (
            <Grid size={4} sx={{ xs: 12, sm: 6, md: 4 }} key={board.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: board.color || "transparent",
                }}
              >
                <CardActionArea
                  component={RouterLink}
                  to={`${ROUTES.BOARD_PAGE}${board.id}`}
                  sx={{ height: "100%", display: "flex" }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <ViewKanbanOutlinedIcon color="primary" sx={{ ml: 1 }} />
                      <Typography variant="h5" component="h2">
                        {board.name}
                      </Typography>
                    </Box>
                    <Typography sx={{ wordBreak: "break-word" }} variant="body1" color="text.secondary">
                      {board.description || "לוח כללי"}
                    </Typography>
                  </CardContent>

                </CardActionArea>
                <CardActions sx={{ justifyContent: "flex-end", p: 0 }}>
                  <IconButton
                    aria-label="change color"
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setSelectedBoardForColor(board);
                    }}
                  >
                    <PaletteIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit board"
                    onClick={() => {
                      setEditingBoard(board);
                      setIsBoardDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete board"
                    onClick={() => handleDeleteBoard(board.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Color picker menu */}
      <Menu
        anchorEl={anchorEl}
        open={isColorMenuOpen}
        onClose={() => setAnchorEl(null)}
        dir="rtl"
        slotProps={{
          list: {
            sx: {
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              p: 1
            }
          }
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {boardColors.map(
          (color) => (
            <MenuItem sx={{ p: 1 }} key={color} onClick={() => handleColorChange(color)}>
              <Box sx={{ width: 20, height: 20, backgroundColor: color, borderRadius: '50%', border: '1px solid #ccc' }} />
            </MenuItem>
          ),
        )}
      </Menu>

      <BoardFormDialog
        open={isBoardDialogOpen}
        onClose={() => {
          setIsBoardDialogOpen(false);
          setEditingBoard(undefined);
        }}
        handleSave={onSaveBoard}
        initialValues={editingBoard}
      />
      {boards && boards.length > 0 && (
        <Fab
          color="primary"
          aria-label="add board"
          onClick={() => setIsBoardDialogOpen(true)}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
}

export default HomePage;