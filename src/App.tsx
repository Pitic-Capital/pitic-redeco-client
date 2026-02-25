import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { CataloguesProvider } from "./context/CataloguesContext";
import { SnackbarProvider } from "./context/SnackbarContext";

function App() {
   const [token, setToken] = useState(null);

   useEffect(() => {
      const savedToken = localStorage.getItem("AUTH_TOKEN_REDECO");
      setToken(savedToken);
   }, []);

   return (
      <SnackbarProvider>
         <CataloguesProvider>
            <Container
               maxWidth={false}
               disableGutters
               sx={{
                  bgcolor: "whitesmoke",
                  minHeight: "100vh",
                  width: "100vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: token ? "flex-start" : "center",
                  p: token ? 0 : { xs: 2, sm: 4, md: 6 },
               }}
            >
               <Box
                  sx={{
                     width: "100%",
                     maxWidth: token ? "100%" : 480,
                     bgcolor: "white",
                     borderRadius: token ? 0 : 2,
                     boxShadow: token ? 0 : 3,
                     p: token ? 0 : { xs: 2, sm: 3 },
                  }}
               >
                  {token ? <Dashboard setToken={setToken} /> : <Login setToken={setToken} />}
               </Box>
            </Container>
         </CataloguesProvider>
      </SnackbarProvider>
   );
}

export default App;
