import { useState } from "react";
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { deleteQueja, getQuejas } from "../api/redeco.client";
import { TableComponent } from "./Common/TableComponent";
import { useSnackbar } from "../context/SnackbarContext";
import ConfirmDeleteDialog from "./Common/ConfirmDeleteDialog";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

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
   const [consultData, setConsultData] = useState([]);

   const [pendingRow, setPendingRow] = useState<any>(null);
   const [deleteLoading, setDeleteLoading] = useState(false);

   const { showSnackbar } = useSnackbar();

   const getToken = () => localStorage.getItem("AUTH_TOKEN_REDECO");

   const handleConsultar = async () => {
      const token = getToken();
      if (!token) return showSnackbar("Token no disponible. Inicia sesión nuevamente.", "error");

      const mesNumero = meses.indexOf(mes) + 1;
      setLoading(true);
      try {
         const { data } = await getQuejas(token, anio, mesNumero);
         const quejas = data?.quejas ?? [];
         setConsultData(quejas);
         if (quejas.length === 0) showSnackbar(`No se encontraron quejas para ${mes} ${anio}.`, "info");
      } catch (err: any) {
         showSnackbar("Error al consultar quejas: " + (err?.response?.data?.error || err.message), "error");
         setConsultData([]);
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteConfirm = async () => {
      if (!pendingRow) return;
      const folio = pendingRow.folio;
      setPendingRow(null);

      const token = getToken();
      if (!token) return showSnackbar("Token no disponible.", "error");

      setDeleteLoading(true);
      try {
         await deleteQueja(token, folio);
         showSnackbar(`Queja "${folio}" eliminada correctamente.`, "success");
         setConsultData((prev) => prev.filter((q: any) => q.folio !== folio));
      } catch (err: any) {
         showSnackbar("Error al eliminar: " + (err?.response?.data?.error || err.message), "error");
      } finally {
         setDeleteLoading(false);
      }
   };

   return (
      <Box
         display="flex"
         flexDirection="column"
         gap={2}
         sx={{ maxWidth: 960, mx: "auto", width: "100%", minHeight: "calc(100dvh - 150px)" }}
      >
         {/* Controles de consulta */}
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
               <Select value={anio} label="Año" onChange={(e) => setAnio(Number(e.target.value))}>
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

         {/* Tabla con boton de eliminar por fila */}
         {consultData.length > 0 && (
            <Box>
               <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                  {consultData.length} queja{consultData.length !== 1 ? "s" : ""} — {mes} {anio}
               </Typography>
               <TableComponent
                  data={consultData}
                  label="Quejas"
                  rowsPerPageDefault={10}
                  onDeleteRow={(row) => setPendingRow(row)}
               />
            </Box>
         )}

         <ConfirmDeleteDialog
            open={!!pendingRow}
            folio={pendingRow?.folio}
            loading={deleteLoading}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setPendingRow(null)}
         />
      </Box>
   );
};

export default ComplaintConsult;
