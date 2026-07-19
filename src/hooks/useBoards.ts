import { useState, useCallback, useContext } from "react";
import type { Board } from "../types/Board";
import { SnackContext } from "../providers/SnackProvider";
import {
  addBoard,
  getBoards,
  updateBoard,
  deleteBoard,
} from "../services/boardsDataServiceFireBase"; // ודא שהקובץ קיים והנתיב תקין
import { getColumns } from "../services/columnsDataServiceFireBase"; // הקריאה החדשה למשימות
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const { raiseSnack } = useContext(SnackContext) as {
    raiseSnack: (
      color: "success" | "error" | "warning" | "info",
      message: string,
    ) => void;
  };

  // READ
  const handleGetBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!user) {
      setBoards([]);
      setIsLoading(false);
      return;
    }

    try {
      const savedBoards = await getBoards();
      setBoards(savedBoards);
    } catch (err) {
      console.error("Failed to fetch boards:", err);
      setError("שגיאה בטעינת הלוחות. נסה שוב מאוחר יותר.");
      raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
    } finally {
      setIsLoading(false);
    }
  }, [raiseSnack, user]);

  // CREATE
  const handleAddBoard = useCallback(
    async (board: Pick<Board, "name" | "description" | "color">) => {
      const boardData = {
        name: board.name,
        description: board.description || "",
        color: board.color || "#FFFFFF",
        createdAt: Number(new Date()),
      };
      try {
        // המתנה ליצירת הלוח וקבלת ה-ID מפיירבייס
        const newId = await addBoard(boardData);

        const newBoard: Board = {
          ...boardData,
          id: newId,
          createdAt: Number(new Date()),
        };

        setBoards((prev) => [...prev, newBoard]);
        raiseSnack("success", "לוח חדש התווסף בהצלחה");
      } catch (error) {
        raiseSnack("error", "התרחשה שגיאה ביצירת הלוח");
      }
    },
    [raiseSnack],
  );

  // UPDATE
  const handleEditBoard = useCallback(
    async (id: string, data: Partial<Omit<Board, "id">>) => {
      const boardToUpdate = boards.find((b) => b.id === id);
      if (!boardToUpdate) return;

      const updatedBoard = { ...boardToUpdate, ...data };

      try {
        // שולחים לפיירבייס רק את השדות שהשתנו
        await updateBoard(id, data);
        // מעדכנים את הסטייט המקומי עם האובייקט המלא
        setBoards((prev) =>
          prev.map((b) => (b.id === id ? updatedBoard : b)),
        );
        raiseSnack("success", "הלוח נערך בהצלחה");
      } catch (error) {
        raiseSnack("error", "שגיאה בעריכת הלוח");
      }
    },
    [boards, raiseSnack],
  );

  // DELETE
  const handleDeleteBoard = useCallback(
    async (id: string) => {
      if (!window.confirm("האם את/ה בטוח/ה שברצונך למחוק את הלוח?")) return;

      try {
        // משיכת העמודות מפיירבייס כדי לבדוק אם הלוח בשימוש
        const columns = await getColumns();
        if (columns.some((c) => c.board === id)) {
          raiseSnack("warning", "שים לב! לא ניתן למחוק לוח שמכיל עמודות");
          return;
        }

        await deleteBoard(id);
        setBoards((prev) => prev.filter((b) => b.id !== id));
        raiseSnack("success", "לוח נמחק בהצלחה");
      } catch (error) {
        raiseSnack("error", "שגיאה במחיקת הלוח");
      }
    },
    [raiseSnack],
  );

  return {
    boards,
    handleGetBoards,
    handleAddBoard,
    handleEditBoard,
    handleDeleteBoard,
    isLoading,
    error,
  };
}

export default useBoards;
