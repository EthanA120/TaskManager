import { createContext, useCallback, useState, type ReactNode } from "react";
import { Alert, Snackbar, Typography } from "@mui/material";

const SnackContext = createContext({});

function SnackProvider({ children }: { children: ReactNode }) {
  const [isSnackOpen, setOpenSnack] = useState(false);
  const [snackColor, setSnackColor] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [snackVariant, setSnackVariant] = useState<
    "filled" | "standard" | "outlined"
  >("filled");
  const [snackMessage, setSnackMessage] = useState("in snackbar");
  const [delay, setDelay] = useState(5000);

  const raiseSnack = useCallback(
    (
      color: "success" | "error" | "warning" | "info",
      message: string,
      delay = 5000,
      variant: "filled" | "standard" | "outlined" = "filled",
    ) => {
      setOpenSnack(true);
      setSnackColor(color);
      setSnackVariant(variant);
      setSnackMessage(message);
      setDelay(delay);
    },
    [],
  );

  return (
    <>
      <SnackContext.Provider value={{ raiseSnack }}>
        {children}
      </SnackContext.Provider>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={isSnackOpen}
        onClose={() => {
          setOpenSnack(false);
        }}
        autoHideDuration={delay}
      >
        <Alert
          severity={snackColor}
          variant={snackVariant}
          onClose={() => {
            setOpenSnack(false);
          }}
        >
          <Typography variant="body2" dir="rtl">
            {snackMessage}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

export { SnackProvider, SnackContext };
