import { useState } from "react";
import {
   Alert,
   Box,
   Button,
   CircularProgress,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   Typography,
} from "@mui/material";
import { getQuejas } from "../api/redeco.client";
import { TableComponent } from "./Common/TableComponent";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); // 0-indexed

const meses = [
   "Enero",
   "Febrero",
   "Marzo",
   "Abril",
   "Mayo",
   "Junio",
   "Julio",
   "Agosto",
   "Septiembre",
   "Octubre",
   "Noviembre",
   "Diciembre",
];

const años = Array.from({ length: 10 }, (_, i) => currentYear - i);

const ComplaintConsult = () => {
   const [mes, setMes] = useState(meses[currentMonth]);
   const [anio, setAnio] = useState(currentYear);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [info, setInfo] = useState("");
   const [consultData, setConsultData] = useState([]);

   const handleConsultar = async () => {
      setError("");
      setInfo("");
      const token = localStorage.getItem("AUTH_TOKEN_REDECO");
      if (!token) return setError("Token no disponible. Inicia sesión nuevamente.");

      const mesNumero = meses.indexOf(mes) + 1;

      setLoading(true);
      try {
         const { data } = await getQuejas(token, anio, mesNumero);
         const quejas = data?.quejas ?? [];
         setConsultData(quejas);

         if (quejas.length === 0) {
            setInfo(`No se encontraron quejas para ${mes} ${anio}.`);
         }
      } catch (err: any) {
         const msg = err?.response?.data?.error || err.message || "Error desconocido";
         setError("Error al consultar quejas: " + msg);
         setConsultData([]);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box display="flex" flexDirection="column" gap={2} sx={{ maxWidth: 960, mx: "auto", width: "100%" }}>
         {/* Controles */}
         <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: { xs: "wrap", sm: "nowrap" } }}>
            <FormControl size="small" fullWidth sx={{ flex: { xs: "1 1 100%", sm: 2.5 } }}>
               <InputLabel>Mes</InputLabel>
               <Select value={mes} label="Mes" onChange={(e) => setMes(e.target.value)}>
                  {meses.map((m, index) => {
                     const esMesFuturo = anio === currentYear && index > currentMonth;
                     return (
                        <MenuItem key={m} value={m} disabled={esMesFuturo}>
                           {m}
                        </MenuItem>
                     );
                  })}
               </Select>
            </FormControl>

            <FormControl size="small" fullWidth sx={{ flex: { xs: "1 1 40%", sm: 2 } }}>
               <InputLabel>Año</InputLabel>
               <Select
                  value={anio}
                  label="Año"
                  onChange={(e) => {
                     setAnio(Number(e.target.value));
                  }}
               >
                  {años.map((a) => (
                     <MenuItem key={a} value={a}>
                        {a}
                     </MenuItem>
                  ))}
               </Select>
            </FormControl>

            <Button
               variant="contained"
               onClick={handleConsultar}
               disabled={loading}
               startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
               sx={{ bgcolor: "#305e58ff", flex: { xs: "1 1 40%", sm: 1.5 }, whiteSpace: "nowrap" }}
            >
               {loading ? "Consultando..." : "Consultar"}
            </Button>
         </Box>

         {/* Alertas */}
         {error && <Alert severity="error">{error}</Alert>}
         {info && <Alert severity="info">{info}</Alert>}

         {/* Resultados */}
         {consultData.length > 0 && (
            <Box>
               <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  {consultData.length} queja{consultData.length !== 1 ? "s" : ""} encontrada
                  {consultData.length !== 1 ? "s" : ""} — {mes} {anio}
               </Typography>
               <TableComponent data={consultData} label="Quejas" rowsPerPageDefault={10} />
            </Box>
         )}
      </Box>
   );
};

export default ComplaintConsult;
