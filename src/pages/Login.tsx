import { Alert, Box, Button, FormControlLabel, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { ENV_KEY, renewToken } from "../api/redeco.client";

const Login = ({ setToken }) => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [isTest, setIsTest] = useState(() => localStorage.getItem(ENV_KEY) === "test");

   const handleEnvToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.checked ? "test" : "prod";
      localStorage.setItem(ENV_KEY, value);
      setIsTest(e.target.checked);
   };

   const iniciarSesion = async () => {
      setError("");
      setSuccess("");

      try {
         const response = await renewToken({ username, password });
         const token = response.data.user?.token_access;
         if (!token) throw new Error("Token no encontrado en la respuesta");

         localStorage.setItem("AUTH_TOKEN_REDECO", token);
         setToken(token);
         setSuccess("Inicio de sesión exitoso");
      } catch (err) {
         setError("Error al consultar quejas: " + (err?.response?.data?.message || err.message));
      }
   };

   return (
      <Box
         sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
         }}
      >
         <Typography textAlign="center" sx={{ fontWeight: "bold", fontSize: 24, color: "#305e58ff" }}>
            REDECO
         </Typography>
         <Typography variant="h5" textAlign="center">
            Iniciar Sesión
         </Typography>

         <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
         />
         <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
         />

         {error && <Alert severity="error">{error}</Alert>}
         {success && <Alert severity="success">{success}</Alert>}

         <Button variant="contained" fullWidth onClick={iniciarSesion} sx={{ bgcolor: "#305e58ff" }}>
            Iniciar sesión
         </Button>

         <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip title={`Ambiente activo: ${isTest ? "Test" : "Produccion"}`}>
               <FormControlLabel
                  control={
                     <Switch
                        checked={isTest}
                        onChange={handleEnvToggle}
                        size="small"
                        sx={{
                           "& .MuiSwitch-thumb": { bgcolor: isTest ? "#f59e0b" : "#305e58ff" },
                           "& .MuiSwitch-track": { bgcolor: isTest ? "#fde68a" : "#a7c5c2" },
                        }}
                     />
                  }
                  label={
                     <Typography variant="caption" color="text.secondary">
                        {isTest ? "Test" : "Producción"}
                     </Typography>
                  }
               />
            </Tooltip>
         </Box>
      </Box>
   );
};

export default Login;
