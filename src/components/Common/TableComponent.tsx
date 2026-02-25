import {
   Box,
   Chip,
   IconButton,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TablePagination,
   TableRow,
   Tooltip,
   Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface TableComponentProps {
   data: any[];
   label: string;
   rowsPerPageDefault?: number;
   onDeleteRow?: (row: any) => void;
}

export const TableComponent = ({ data, label, rowsPerPageDefault = 10, onDeleteRow }: TableComponentProps) => {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

   const items: any[] = Array.isArray(data) ? data : Object.values(data ?? {});

   if (!items.length)
      return (
         <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">Sin datos para "{label}"</Typography>
         </Paper>
      );

   const keys = Object.keys(items[0]);

   const paginated = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

   return (
      <TableContainer component={Paper} elevation={2} sx={{ overflowX: "auto" }}>
         {/* Header */}
         <Box
            sx={{
               px: { xs: 1.5, sm: 2 },
               pt: { xs: 1.5, sm: 2 },
               pb: 1,
               display: "flex",
               alignItems: { xs: "flex-start", sm: "center" },
               justifyContent: "space-between",
               flexDirection: { xs: "column", sm: "row" },
               flexWrap: "wrap",
               gap: 1,
            }}
         >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold" color="#305e58ff">
                  {label}
               </Typography>
               <Chip label={items.length} size="small" sx={{ bgcolor: "#305e58ff", color: "#fff" }} />
            </Box>
         </Box>

         {/* Tabla */}
         <Table size="small" stickyHeader sx={{ minWidth: 400 }}>
            <TableHead>
               <TableRow>
                  {keys.map((key) => (
                     <TableCell
                        key={key}
                        sx={{
                           bgcolor: "#305e58ff",
                           color: "#fff",
                           fontWeight: "bold",
                           whiteSpace: "nowrap",
                        }}
                     >
                        {key}
                     </TableCell>
                  ))}
                  {onDeleteRow && (
                     <TableCell sx={{ bgcolor: "#305e58ff", color: "#fff", fontWeight: "bold", width: 56 }}></TableCell>
                  )}
               </TableRow>
            </TableHead>
            <TableBody>
               {paginated.length > 0 ? (
                  paginated.map((item, idx) => (
                     <TableRow key={idx} hover sx={{ "&:hover": { bgcolor: "#f0f7f6" } }}>
                        {keys.map((key) => (
                           <TableCell key={key}>{item[key] ?? "—"}</TableCell>
                        ))}
                        {onDeleteRow && (
                           <TableCell align="center" sx={{ p: 0.5 }}>
                              <Tooltip title="Eliminar">
                                 <IconButton size="small" color="error" onClick={() => onDeleteRow(item)}>
                                    <DeleteIcon fontSize="small" />
                                 </IconButton>
                              </Tooltip>
                           </TableCell>
                        )}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell
                        colSpan={keys.length + (onDeleteRow ? 1 : 0)}
                        align="center"
                        sx={{ color: "text.secondary", py: 3 }}
                     >
                        Sin datos disponibles
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>

         {items.length > rowsPerPageDefault && (
            <TablePagination
               component="div"
               count={items.length}
               page={page}
               onPageChange={(_, newPage) => setPage(newPage)}
               rowsPerPage={rowsPerPage}
               onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value));
                  setPage(0);
               }}
               rowsPerPageOptions={[5, 10, 25, 50]}
               labelRowsPerPage="Filas:"
               labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
               sx={{
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon": {
                     display: { xs: "none", sm: "flex" },
                  },
               }}
            />
         )}
      </TableContainer>
   );
};
