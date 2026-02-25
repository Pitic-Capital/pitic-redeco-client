import { createContext, useCallback, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

type Severity = "success" | "error" | "info" | "warning";

interface SnackbarContextType {
   showSnackbar: (message: string, severity?: Severity) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({} as SnackbarContextType);

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
   const [open, setOpen] = useState(false);
   const [message, setMessage] = useState("");
   const [severity, setSeverity] = useState<Severity>("info");

   const showSnackbar = useCallback((msg: string, sev: Severity = "info") => {
      setMessage(msg);
      setSeverity(sev);
      setOpen(true);
   }, []);

   return (
      <SnackbarContext.Provider value={{ showSnackbar }}>
         {children}
         <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
         >
            <Alert
               onClose={() => setOpen(false)}
               severity={severity}
               variant="outlined"
               sx={{
                  width: "100%",
                  whiteSpace: "pre",
                  bgcolor: {
                     success: "#e8f5e9",
                     error: "#fce4ec",
                     warning: "#fff8e1",
                     info: "#e3f2fd",
                  }[severity],
                  borderColor: {
                     success: "#a5d6a7",
                     error: "#ef9a9a",
                     warning: "#ffe082",
                     info: "#90caf9",
                  }[severity],
               }}
            >
               {message}
            </Alert>
         </Snackbar>
      </SnackbarContext.Provider>
   );
};
