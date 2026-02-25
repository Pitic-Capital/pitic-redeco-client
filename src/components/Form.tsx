import {
   TextField,
   Button,
   Stack,
   Box,
   Chip,
   CircularProgress,
   MenuItem,
   Select,
   FormControl,
   InputLabel,
   Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import { es } from "date-fns/locale";
import { sendQuejas } from "../api/redeco.client";
import { useCatalogues } from "../context/CataloguesContext";
import { useSnackbar } from "../context/SnackbarContext";

const Form = () => {
   const {
      mediosRecepcion,
      nivelesAtencion,
      productos,
      estados,
      causas,
      postalCodes,
      municipalities,
      neighborhoods,
      loading: catalogsLoading,
      fetchCausas,
      fetchPostalCodes,
      fetchMunicipalities,
      fetchNeighborhoods,
   } = useCatalogues();

   const mapOptions = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => {
         const [id, label] = Object.values(item);
         return { id, label };
      });
   };

   const getFirstId = (arr) => (arr?.length ? Object.values(arr[0])[0] : null);

   // Cuando productos carga, obtener causas del primer producto y datos geograficos por defecto
   useEffect(() => {
      if (!productos.length) return;
      fetchCausas(getFirstId(productos) as string);
      fetchMunicipalities("26", "83000");
      fetchNeighborhoods("83000");
   }, [productos]);

   const fieldConfig = useMemo(
      () => ({
         QuejasDenominacion: {
            label: "Denominación o razón social",
            type: "string",
            options: [],
            default: "Pitic Capital, S.A.P.I. de C.V., SOFOM, E.N.R.",
            onChange: () => {},
         },
         QuejasSector: {
            label: "Sector",
            type: "string",
            options: [],
            default: "Sociedades Financieras de Objeto Múltiple E.N.R.",
            onChange: () => {},
         },
         QuejasNoMes: {
            label: "Mes a informar",
            type: "select",
            options: Array.from({ length: 12 }, (_, i) => ({
               id: i + 1,
               label: new Date(0, i).toLocaleString("es-MX", { month: "long" }).replace(/^./, (c) => c.toUpperCase()),
            })),
            default: 1,
            onChange: () => {},
         },

         QuejasNum: { label: "Número de quejas", type: "number", options: [], default: 1, onChange: () => {} },
         QuejasFolio: { label: "Número de folio", type: "string", options: [], default: "", onChange: () => {} },
         QuejasFecRecepcion: {
            label: "Fecha de la queja",
            type: "date",
            options: [],
            default: new Date(),
            onChange: () => {},
         },
         QuejasMedio: {
            label: "Medio de recepción o canal",
            type: "select",
            options: mapOptions(mediosRecepcion),
            default: getFirstId(mediosRecepcion),
            onChange: () => {},
         },
         QuejasNivelAT: {
            label: "Nivel de atención",
            type: "select",
            options: mapOptions(nivelesAtencion),
            default: getFirstId(nivelesAtencion),
            onChange: () => {},
         },
         QuejasProducto: {
            label: "Producto y/o Servicio",
            type: "select",
            options: mapOptions(productos),
            default: getFirstId(productos),
            onChange: (value) => {
               fetchCausas(value);
            },
         },
         QuejasCausa: {
            label: "Causa de la queja",
            type: "select",
            options: mapOptions(causas),
            default: getFirstId(causas),
            onChange: () => {},
         },
         QuejasPORI: {
            label: "PORI",
            type: "select",
            options: [
               { id: "SI", label: "Sí" },
               { id: "NO", label: "No" },
            ],
            default: "SI",
            onChange: () => {},
         },
         QuejasEstatus: {
            label: "Estado",
            type: "select",
            options: [
               { id: 1, label: "Pendiente" },
               { id: 2, label: "Concluido" },
            ],
            default: 1,
            onChange: () => {},
         },
         QuejasEstados: {
            label: "Entidad Federativa",
            type: "select",
            options: mapOptions(estados),
            default: 26,
            onChange: (value) => {
               fetchPostalCodes(String(value));
            },
         },
         QuejasMunId: {
            label: "Municipio o Alcaldía",
            type: "select",
            options: mapOptions(municipalities),
            default: 30,
            onChange: () => {},
         },
         QuejasLocId: { label: "Localidad", type: "string", options: [], default: null, onChange: () => {} },
         QuejasColId: {
            label: "Colonia",
            type: "select",
            options: mapOptions(neighborhoods),
            default: getFirstId(neighborhoods),
            onChange: () => {},
         },
         QuejasCP: {
            label: "Código Postal",
            type: "string",
            options: [],
            default: 83000,
            onChange: (value) => {
               fetchNeighborhoods(value);
            },
         },
         QuejasTipoPersona: {
            label: "Tipo de persona",
            type: "select",
            options: [
               { id: 1, label: "Física" },
               { id: 2, label: "Moral" },
            ],
            default: 1,
            onChange: () => {},
         },
         QuejasSexo: {
            label: "Sexo",
            type: "select",
            options: [
               { id: "H", label: "Hombre" },
               { id: "M", label: "Mujer" },
            ],
            default: "H",
            onChange: () => {},
         },
         QuejasEdad: { label: "Edad", type: "number", options: [], default: 0, onChange: () => {} },
         QuejasFecResolucion: {
            label: "Fecha de resolución",
            type: "date",
            options: [],
            default: new Date(),
            onChange: () => {},
         },
         QuejasFecNotificacion: {
            label: "Fecha de notificación",
            type: "date",
            options: [],
            default: new Date(),
            onChange: () => {},
         },
         QuejasRespuesta: {
            label: "Sentido de la resolución",
            type: "select",
            options: [
               { id: 1, label: "Totalmente favorable al usuario" },
               { id: 2, label: "Desfavorable al Usuario" },
               { id: 3, label: "Parcialmente favorable al usuario" },
               { id: null, label: "N/A" },
            ],
            default: 1,
            onChange: () => {},
         },
         QuejasNumPenal: {
            label: "Número de penalización",
            type: "number",
            options: [],
            default: 0,
            onChange: () => {},
         },
         QuejasPenalizacion: {
            label: "Tipo de penalización",
            type: "select",
            options: [
               { id: 1, label: "Contractuales - Cancelación del contrato" },
               { id: 2, label: "Contractuales - Reasignación de cartera" },
               { id: 3, label: "Económicas - Multa" },
            ],
            default: 1,
            onChange: () => {},
         },
      }),
      [mediosRecepcion, nivelesAtencion, productos, estados, causas, postalCodes, municipalities, neighborhoods],
   );

   const defaultValues = Object.fromEntries(Object.entries(fieldConfig).map(([key, config]) => [key, config.default]));

   const { control, handleSubmit, reset } = useForm({ defaultValues });

   const isTestEnv = localStorage.getItem("APP_ENV") === "test";

   const fillTestData = () => {
      const folio = `TEST/${new Date().getFullYear()}/REDECO_${Date.now()}`;
      reset({
         ...defaultValues,
         QuejasFolio: folio,
         QuejasNoMes: 1,
         QuejasNum: 1,
         QuejasFecRecepcion: new Date(new Date().getFullYear(), 0, 1), // 01/01/año actual
         QuejasMedio: getFirstId(mediosRecepcion),
         QuejasNivelAT: getFirstId(nivelesAtencion),
         QuejasProducto: getFirstId(productos),
         QuejasCausa: getFirstId(causas),
         QuejasPORI: "NO",
         QuejasEstatus: 1,
         QuejasEstados: 26,
         QuejasMunId: getFirstId(municipalities) ?? 30,
         QuejasLocId: null,
         QuejasColId: getFirstId(neighborhoods),
         QuejasCP: 83000,
         QuejasTipoPersona: 1,
         QuejasSexo: "H",
         QuejasEdad: 25,
         QuejasFecResolucion: null,
         QuejasFecNotificacion: null,
         QuejasRespuesta: null,
         QuejasNumPenal: null,
         QuejasPenalizacion: null,
      });
   };

   const { showSnackbar } = useSnackbar();

   const formatToDDMMYY = (value: Date | string | null): string | null => {
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return null;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());
      return `${day}/${month}/${year}`;
   };

   /** Campos de texto opcionales sin valor → "null" string (requisito API) */
   const toNullStr = (v: any) => (v === null || v === undefined || v === "" ? "null" : v);
   /** Campos numéricos opcionales sin valor → null JS (la API valida el tipo) */
   const toNullNum = (v: any): number | null =>
      v === null || v === undefined || v === 0 || v === "" ? null : Number(v);

   const onSubmit = async (data: any) => {
      const token = localStorage.getItem("AUTH_TOKEN_REDECO");
      if (!token) return;

      const pendiente = Number(data.QuejasEstatus) === 1;

      try {
         const formattedData = {
            ...data,
            QuejasCP: Number(data.QuejasCP),
            QuejasFecRecepcion: formatToDDMMYY(data.QuejasFecRecepcion),
            // Si status=Pendiente, estas fechas y campos DEBEN ser null (no "null" string)
            QuejasFecResolucion: pendiente ? null : (formatToDDMMYY(data.QuejasFecResolucion) ?? null),
            QuejasFecNotificacion: pendiente ? null : (formatToDDMMYY(data.QuejasFecNotificacion) ?? null),
            QuejasRespuesta: pendiente ? null : toNullNum(data.QuejasRespuesta),
            // Numericos opcionales
            QuejasLocId: toNullNum(data.QuejasLocId),
            QuejasNumPenal: toNullNum(data.QuejasNumPenal),
            QuejasPenalizacion: toNullNum(data.QuejasPenalizacion),
            QuejasEdad: toNullNum(data.QuejasEdad),
            // String/char opcionales
            QuejasSexo: toNullStr(data.QuejasSexo),
         };

         const res = await sendQuejas(token, [formattedData]);
         const foliosEnviados = res?.data?.["Quejas enviadas"]?.join(", ") ?? data.QuejasFolio;
         showSnackbar(`Queja enviada correctamente. Folio: ${foliosEnviados}`, "success");
         reset(defaultValues);
      } catch (err: any) {
         const apiErrors = err?.response?.data?.errors;
         if (apiErrors) {
            showSnackbar((Object.values(apiErrors) as string[][]).flat().join("\n"), "error");
         } else {
            showSnackbar(err?.response?.data?.message || err.message || "Error desconocido", "error");
         }
      }
   };

   return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
         <Box sx={{ maxWidth: 960, mx: "auto", width: "100%" }}>
            {catalogsLoading ? (
               <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 4, justifyContent: "center" }}>
                  <CircularProgress size={24} sx={{ color: "#305e58ff" }} />
                  <Typography color="text.secondary">Cargando catálogos...</Typography>
               </Box>
            ) : (
               <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={2}>
                     {/* Banner de ambiente de pruebas */}
                     {isTestEnv && (
                        <Box
                           sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 1.5,
                              bgcolor: "#fff8e1",
                              borderRadius: 1,
                              border: "1px solid #ffe082",
                           }}
                        >
                           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                 label="TEST"
                                 size="small"
                                 sx={{ bgcolor: "#f57c00", color: "#fff", fontWeight: "bold", fontSize: 10 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                 Ambiente de pruebas
                              </Typography>
                           </Box>
                           <Button size="small" variant="outlined" color="warning" onClick={fillTestData}>
                              Llenar datos de prueba
                           </Button>
                        </Box>
                     )}
                     <Box
                        sx={{
                           display: "flex",
                           flexWrap: "wrap",
                           gap: 2,
                        }}
                     >
                        {Object.entries(fieldConfig).map(([name, config]) => (
                           <Box
                              key={name}
                              sx={{
                                 flex: "1 1 45%",
                                 minWidth: "250px",
                              }}
                           >
                              <Controller
                                 name={name}
                                 control={control}
                                 render={({ field }) => {
                                    switch (config.type) {
                                       case "date":
                                          return (
                                             <DatePicker
                                                label={config.label}
                                                value={(field.value as Date) || null}
                                                onChange={(date) => field.onChange(date)}
                                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                                minDate={new Date("2000-01-01")}
                                                maxDate={new Date()}
                                             />
                                          );
                                       case "select":
                                          return (
                                             <FormControl fullWidth>
                                                <InputLabel>{config.label}</InputLabel>
                                                <Controller
                                                   name={name}
                                                   control={control}
                                                   render={({ field }) => (
                                                      <Select
                                                         {...field}
                                                         label={fieldConfig[name].label}
                                                         size="small"
                                                         onChange={(e) => {
                                                            field.onChange(e);
                                                            fieldConfig[name]?.onChange?.(e.target.value);
                                                         }}
                                                         MenuProps={{
                                                            PaperProps: {
                                                               style: {
                                                                  maxHeight: 300,
                                                                  overflow: "auto",
                                                                  whiteSpace: "normal",
                                                                  wordBreak: "break-word",
                                                               },
                                                            },
                                                         }}
                                                      >
                                                         {fieldConfig[name].options.map((option) => (
                                                            <MenuItem key={option.id} value={option.id}>
                                                               {option.label}
                                                            </MenuItem>
                                                         ))}
                                                      </Select>
                                                   )}
                                                />
                                             </FormControl>
                                          );
                                       default:
                                          return (
                                             <TextField
                                                {...field}
                                                type={config.type === "number" ? "number" : "text"}
                                                label={config.label}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                   field.onChange(e);
                                                   config.onChange?.(e.target.value);
                                                }}
                                             />
                                          );
                                    }
                                 }}
                              />
                           </Box>
                        ))}
                     </Box>
                     <Button type="submit" variant="contained" sx={{ bgcolor: "#305e58ff" }}>
                        Enviar
                     </Button>
                  </Stack>
               </form>
            )}
         </Box>
      </LocalizationProvider>
   );
};

export default Form;
