import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useCatalogues } from "../context/CataloguesContext";
import { useMemo } from "react";
import { TableComponent } from "./Common/TableComponent";

const Catalogues = () => {
   const { mediosRecepcion, nivelesAtencion, productos, estados, loading } = useCatalogues();

   const catalogos = useMemo(
      () => [
         { data: mediosRecepcion, label: "Medios de recepción" },
         { data: nivelesAtencion, label: "Niveles de atención" },
         { data: productos, label: "Productos" },
         { data: estados, label: "Estados" },
      ],
      [mediosRecepcion, nivelesAtencion, productos, estados],
   );

   return (
      <Stack spacing={3}>
         {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 6, justifyContent: "center" }}>
               <CircularProgress size={24} sx={{ color: "#305e58ff" }} />
               <Typography color="text.secondary">Cargando catálogos...</Typography>
            </Box>
         ) : (
            <>
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                     flexWrap: "wrap",
                     gap: 1,
                  }}
               >
                  <Typography variant="h6" fontWeight="bold" color="#305e58ff">
                     Catálogos
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                     {catalogos.map(({ label, data }) => {
                        const count = Array.isArray(data) ? data.length : Object.values(data ?? {}).length;
                        const ok = count > 0;
                        return (
                           <Chip
                              key={label}
                              label={`${label}: ${count}`}
                              size="small"
                              icon={ok ? <CheckCircleIcon /> : <ErrorIcon />}
                              color={ok ? "success" : "error"}
                              variant="outlined"
                           />
                        );
                     })}
                  </Box>
               </Box>

               <Box
                  sx={{
                     display: "grid",
                     gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                     gap: 3,
                  }}
               >
                  {catalogos.map(({ data, label }) => (
                     <TableComponent key={label} data={data} label={label} rowsPerPageDefault={5} />
                  ))}
               </Box>
            </>
         )}
      </Stack>
   );
};

export default Catalogues;
