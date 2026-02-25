import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
   getCatalogoMediosRecepcion,
   getCatalogoNivelesAtencion,
   getCatalogoProductos,
   getCatalogoCausas,
   getEstados,
   getCodigosPostales,
   getMunicipios,
   getColonias,
} from "../api/redeco.client";
import type { MedioRecepcion, NivelAtencion, Producto, Estado, Causa, SelectOption } from "../types/redeco.types";

const getAuthToken = () => localStorage.getItem("AUTH_TOKEN_REDECO") ?? "";

type CatalogueContextType = {
   mediosRecepcion: MedioRecepcion[];
   nivelesAtencion: NivelAtencion[];
   productos: Producto[];
   estados: Estado[];
   causas: Causa[];
   postalCodes: SelectOption[];
   municipalities: SelectOption[];
   neighborhoods: SelectOption[];
   loading: boolean;
   fetchCausas: (productId: string) => Promise<void>;
   fetchPostalCodes: (stateId: string) => Promise<void>;
   fetchMunicipalities: (stateId: string, cp: string) => Promise<void>;
   fetchNeighborhoods: (cp: string) => Promise<void>;
};

export const CataloguesContext = createContext<CatalogueContextType>({} as CatalogueContextType);
export const useCatalogues = () => useContext(CataloguesContext);

export const CataloguesProvider = ({ children }) => {
   const [mediosRecepcion, setMediosRecepcion] = useState([]);
   const [nivelesAtencion, setNivelesAtencion] = useState([]);
   const [productos, setProductos] = useState([]);
   const [estados, setEstados] = useState([]);
   const [causas, setCausas] = useState([]);
   const [postalCodes, setPostalCodes] = useState([]);
   const [municipalities, setMunicipalities] = useState([]);
   const [neighborhoods, setNeighborhoods] = useState([]);
   const [loading, setLoading] = useState(true);

   // Carga inicial de catalogos estaticos
   const MAX_RETRIES = 3;

   useEffect(() => {
      const fetchInitial = async () => {
         setLoading(true);
         for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
               const token = getAuthToken();
               const [medios, niveles, prods, ests] = await Promise.all([
                  getCatalogoMediosRecepcion(token),
                  getCatalogoNivelesAtencion(token),
                  getCatalogoProductos(token),
                  getEstados(),
               ]);
               setMediosRecepcion(medios.data?.medio ?? []);
               setNivelesAtencion(niveles.data?.nivelesDeAtencion ?? []);
               setProductos(prods.data?.products ?? []);
               setEstados(ests.data?.estados ?? []);
               break; // exito — salir del loop
            } catch (error) {
               console.warn(`Error al cargar catalogos (intento ${attempt}/${MAX_RETRIES}):`, error);
               if (attempt < MAX_RETRIES) {
                  await new Promise((res) => setTimeout(res, 1000 * 2 ** (attempt - 1))); // 1s, 2s, 4s
               } else {
                  console.error("No se pudieron cargar los catalogos tras varios intentos.");
               }
            }
         }
         setLoading(false);
      };

      fetchInitial();
   }, []);

   const fetchCausas = useCallback(async (productId: string) => {
      try {
         const { data } = await getCatalogoCausas(getAuthToken(), productId);
         setCausas(data?.causas ?? []);
      } catch (error) {
         console.error("Error al cargar causas:", error);
      }
   }, []);

   const fetchPostalCodes = useCallback(async (stateId: string) => {
      try {
         const { data } = await getCodigosPostales(Number(stateId));
         setPostalCodes(
            data?.codigos_postales?.map(({ codigo_sepomex }) => ({
               id: codigo_sepomex,
               label: `CP: ${codigo_sepomex}`,
            })) ?? [],
         );
      } catch (error) {
         console.error("Error al cargar codigos postales:", error);
      }
   }, []);

   const fetchMunicipalities = useCallback(async (stateId: string, cp: string) => {
      try {
         const { data } = await getMunicipios(Number(stateId), cp);
         setMunicipalities(
            data?.municipios?.map(({ municipio, municipioId }) => ({
               id: municipioId,
               label: municipio,
            })) ?? [],
         );
      } catch (error) {
         console.error("Error al cargar municipios:", error);
      }
   }, []);

   const fetchNeighborhoods = useCallback(async (cp: string) => {
      try {
         const { data } = await getColonias(cp);
         setNeighborhoods(
            data?.colonias?.map(({ colonia, coloniaId }) => ({
               id: coloniaId,
               label: colonia,
            })) ?? [],
         );
      } catch (error) {
         console.error("Error al cargar colonias:", error);
      }
   }, []);

   return (
      <CataloguesContext.Provider
         value={{
            mediosRecepcion,
            nivelesAtencion,
            productos,
            estados,
            causas,
            postalCodes,
            municipalities,
            neighborhoods,
            loading,
            fetchCausas,
            fetchPostalCodes,
            fetchMunicipalities,
            fetchNeighborhoods,
         }}
      >
         {children}
      </CataloguesContext.Provider>
   );
};
