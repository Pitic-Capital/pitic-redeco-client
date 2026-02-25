import {
   Box,
   Button,
   CircularProgress,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
   open: boolean;
   folio?: string;
   loading?: boolean;
   onConfirm: () => void;
   onCancel: () => void;
}

const ConfirmDeleteDialog = ({ open, folio, loading = false, onConfirm, onCancel }: ConfirmDeleteDialogProps) => (
   <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 2, minWidth: 360 } }}>
      <DialogTitle sx={{ bgcolor: "#305e58ff", color: "#fff", fontWeight: "bold", py: 1.5 }}>
         Confirmar eliminación
      </DialogTitle>
      <DialogContent>
         <Box sx={{ pt: 2 }}>
            <DialogContentText textAlign="center">
               ¿Deseas eliminar la queja con folio <strong>{folio}</strong>? Esta acción no se puede deshacer.
            </DialogContentText>
         </Box>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2 }}>
         <Button variant="outlined" onClick={onCancel} sx={{ borderColor: "#305e58ff", color: "#305e58ff" }}>
            Cancelar
         </Button>
         <Button
            color="error"
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
         >
            Eliminar
         </Button>
      </DialogActions>
   </Dialog>
);

export default ConfirmDeleteDialog;
