import { useState, useCallback, useContext } from "react";
import type { Column } from "../types/Column";
import { SnackContext } from "../providers/SnackProvider";
import {
	addColumn,
	getColumns,
	updateColumn,
	deleteColumn,
} from "../services/columnsDataServiceFireBase"; // ודא שהקובץ קיים והנתיב תקין
import { getTasks } from "../services/tasksDataServiceFireBase"; // הקריאה החדשה למשימות

function useColumns() {
	const [columns, setColumns] = useState<Column[]>([]);
	const { raiseSnack } = useContext(SnackContext) as {
		raiseSnack: (
			color: "success" | "error" | "warning" | "info",
			message: string,
		) => void;
	};

	// READ
	const handleGetColumns = useCallback(async () => {
		try {
			const savedColumns = await getColumns();
			setColumns(savedColumns);
		} catch {
			raiseSnack("error", "התרחשה שגיאה בייבוא הנתונים");
		}
	}, [raiseSnack]);

	// CREATE
	const handleAddColumn = useCallback(
		async (column: Pick<Column, "name">) => {
			const columnData = {
				name: column.name,
				board: "",
				color: "#FFFFFF",
			};
			try {
				// המתנה ליצירת העמודה וקבלת ה-ID מפיירבייס
				const newId = await addColumn(columnData);

				const newColumn: Column = {
					...columnData,
					id: newId,
				};

				setColumns((prev) => [...prev, newColumn]);
				raiseSnack("success", "עמודה חדשה התווספה בהצלחה");
			} catch (error) {
				raiseSnack("error", "התרחשה שגיאה ביצירת העמודה");
			}
		},
		[raiseSnack],
	);

	// UPDATE
	const handleEditColumn = useCallback(
		async (column: Column) => {
			if (!column.id) return;

			try {
				await updateColumn(column.id, column);
				setColumns((prev) =>
					prev.map((c) => (c.id === column.id ? column : c)),
				);
				raiseSnack("success", "עמודה נערכה בהצלחה");
			} catch (error) {
				raiseSnack("error", "שגיאה בעריכת העמודה");
			}
		},
		[raiseSnack],
	);

	// DELETE
	const handleDeleteColumn = useCallback(
		async (id: string) => {
			try {
				// משיכת המשימות מפיירבייס כדי לבדוק אם העמודה בשימוש
				const tasks = await getTasks();
				if (tasks.some((t) => t.column === id)) {
					raiseSnack("warning", "שים לב! לא ניתן למחוק עמודה שמכילה משימות");
					return;
				}

				await deleteColumn(id);
				setColumns((prev) => prev.filter((c) => c.id !== id));
				raiseSnack("success", "עמודה נמחקה בהצלחה");
			} catch (error) {
				raiseSnack("error", "שגיאה במחיקת העמודה");
			}
		},
		[raiseSnack],
	);

	return {
		columns,
		handleGetColumns,
		handleAddColumn,
		handleEditColumn,
		handleDeleteColumn,
	};
}

export default useColumns;
