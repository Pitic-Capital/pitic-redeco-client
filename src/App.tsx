import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { CataloguesProvider } from "./context/CataloguesContext";

function App() {
   const [token, setToken] = useState(null);

   useEffect(() => {
      const savedToken = localStorage.getItem("AUTH_TOKEN_REDECO");
      setToken(savedToken);
   }, []);

   return (
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
               alignItems: "center",
               p: { xs: 2, sm: 4, md: 6 },
            }}
         >
            <Box
               sx={{
                  width: "100%",
                  maxWidth: 600,
                  bgcolor: "white",
                  borderRadius: 2,
                  boxShadow: 3,
                  p: { xs: 2, sm: 3 },
               }}
            >
               {token ? <Dashboard setToken={setToken} /> : <Login setToken={setToken} />}
            </Box>
         </Container>
      </CataloguesProvider>
   );
}

export default App;
