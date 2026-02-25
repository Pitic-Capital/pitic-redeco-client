import { createContext, useContext, useEffect, useState } from "react";
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

const getAuthToken = () => localStorage.getItem("AUTH_TOKEN_REDECO") ?? "";

type CatalogueContextType = {
   mediosRecepcion: any[];
   nivelesAtencion: any[];
   productos: any[];
   estados: any[];
   causas: any[];
   postalCodes: any[];
   municipalities: any[];
   neighborhoods: any[];
   fetchCausas: (productId: string) => Promise<void>;
   fetchPostalCodes: (code: string) => Promise<void>;
   fetchMunicipalities: (stateId: string, cp: string) => Promise<void>;
   fetchNeighborhoods: (municipalityId: string) => Promise<void>;
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

   useEffect(() => {
      const fetchInitial = async () => {
         const token = getAuthToken();
         try {
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
         } catch (error) {
            console.error("Error fetching catalogues:", error);
         }
      };

      fetchInitial();
   }, []);

   const fetchCausas = async (productId: string) => {
      try {
         const response = await getCatalogoCausas(getAuthToken(), productId);
         setCausas(response.data?.causas ?? []);
      } catch (error) {
         console.error("Error fetching causas:", error);
      }
   };

   const fetchPostalCodes = async (state: string) => {
      try {
         const response = await getCodigosPostales(Number(state));
         const formatted = response.data?.codigos_postales?.map(({ codigo_sepomex }) => ({
            id: codigo_sepomex,
            label: `CP: ${codigo_sepomex}`,
         }));
         setPostalCodes(formatted ?? []);
      } catch (error) {
         console.error("Error fetching postal codes:", error);
      }
   };

   const fetchMunicipalities = async (state: string, cp: string) => {
      try {
         const response = await getMunicipios(Number(state), cp);
         const formatted = response.data?.municipios?.map(({ municipio, municipioId }) => ({
            id: municipioId,
            label: municipio,
         }));
         setMunicipalities(formatted ?? []);
      } catch (error) {
         console.error("Error fetching municipalities:", error);
      }
   };

   const fetchNeighborhoods = async (cp: string) => {
      try {
         const response = await getColonias(cp);
         const formatted = response.data?.colonias?.map(({ colonia, coloniaId }) => ({
            id: coloniaId,
            label: colonia,
         }));
         setNeighborhoods(formatted ?? []);
      } catch (error) {
         console.error("Error fetching neighborhoods:", error);
      }
   };

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
