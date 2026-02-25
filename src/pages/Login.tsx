import {
   Box,
   Button,
   CircularProgress,
   FormControlLabel,
   IconButton,
   InputAdornment,
   Switch,
   TextField,
   Tooltip,
   Typography,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ENV_KEY, renewToken } from "../api/redeco.client";
import { useSnackbar } from "../context/SnackbarContext";

const Login = ({ setToken }) => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [isTest, setIsTest] = useState(() => localStorage.getItem(ENV_KEY) === "test");
   const { showSnackbar } = useSnackbar();

   const handleEnvToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.checked ? "test" : "prod";
      localStorage.setItem(ENV_KEY, value);
      setIsTest(e.target.checked);
   };

   const iniciarSesion = async () => {
      if (!username.trim() || !password.trim()) {
         showSnackbar("Usuario y contraseña son requeridos.", "warning");
         return;
      }
      setLoading(true);

      try {
         const response = await renewToken({ username, password });
         const token = response.data.user?.token_access;
         if (!token) throw new Error("Token no encontrado en la respuesta");

         localStorage.setItem("AUTH_TOKEN_REDECO", token);
         setToken(token);
      } catch (err) {
         showSnackbar(
            "Credenciales incorrectas o error de conexion: " + (err?.response?.data?.message || err.message),
            "error",
         );
      } finally {
         setLoading(false);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") iniciarSesion();
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
            onChange={(e) => {
               setUsername(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
         />
         <TextField
            label="Contraseña"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => {
               setPassword(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            InputProps={{
               endAdornment: (
                  <InputAdornment position="end">
                     <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                     </IconButton>
                  </InputAdornment>
               ),
            }}
         />

         <Button
            variant="contained"
            fullWidth
            onClick={iniciarSesion}
            disabled={loading}
            sx={{ bgcolor: "#305e58ff" }}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
         >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
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
