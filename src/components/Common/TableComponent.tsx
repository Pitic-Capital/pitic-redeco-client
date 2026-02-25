import {
   Box,
   Chip,
   InputAdornment,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TablePagination,
   TableRow,
   TextField,
   Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface TableComponentProps {
   data: any[];
   label: string;
   rowsPerPageDefault?: number;
}

export const TableComponent = ({ data, label, rowsPerPageDefault = 10 }: TableComponentProps) => {
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);
   const [search, setSearch] = useState("");

   const items: any[] = Array.isArray(data) ? data : Object.values(data ?? {});

   if (!items.length)
      return (
         <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">Sin datos para "{label}"</Typography>
         </Paper>
      );

   const keys = Object.keys(items[0]);

   const filtered = search.trim()
      ? items.filter((item) =>
           keys.some((k) =>
              String(item[k] ?? "")
                 .toLowerCase()
                 .includes(search.toLowerCase()),
           ),
        )
      : items;

   const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

   return (
      <TableContainer component={Paper} elevation={2}>
         {/* Header */}
         <Box
            sx={{
               px: 2,
               pt: 2,
               pb: 1,
               display: "flex",
               alignItems: "center",
               justifyContent: "space-between",
               flexWrap: "wrap",
               gap: 1,
            }}
         >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Typography variant="subtitle1" fontWeight="bold" color="#305e58ff">
                  {label}
               </Typography>
               <Chip label={filtered.length} size="small" sx={{ bgcolor: "#305e58ff", color: "#fff" }} />
            </Box>
         </Box>

         {/* Tabla */}
         <Table size="small" stickyHeader>
            <TableHead>
               <TableRow>
                  {keys.map((key) => (
                     <TableCell
                        key={key}
                        sx={{ bgcolor: "#305e58ff", color: "#fff", fontWeight: "bold", whiteSpace: "nowrap" }}
                     >
                        {key}
                     </TableCell>
                  ))}
               </TableRow>
            </TableHead>
            <TableBody>
               {paginated.length > 0 ? (
                  paginated.map((item, idx) => (
                     <TableRow key={idx} hover sx={{ "&:hover": { bgcolor: "#f0f7f6" } }}>
                        {keys.map((key) => (
                           <TableCell key={key} sx={{ maxWidth: 300, wordBreak: "break-word" }}>
                              {item[key] ?? "—"}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={keys.length} align="center" sx={{ color: "text.secondary", py: 3 }}>
                        Sin resultados para "{search}"
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>

         {filtered.length > rowsPerPageDefault && (
            <TablePagination
               component="div"
               count={filtered.length}
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
            />
         )}
      </TableContainer>
   );
};
