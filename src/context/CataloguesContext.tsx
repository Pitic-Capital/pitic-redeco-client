import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../const/api_urls";

const AUTH_HEADER = () => {
   const token = localStorage.getItem("AUTH_TOKEN");
   return token ? { Authorization: token } : null;
};

const fetchFromApi = async (endpoint: string, params = "") => {
   const headers = AUTH_HEADER();
   if (!headers) return [];
   try {
      const { data } = await axios.get(`${getApiUrl()}${endpoint}${params}`, { headers });
      return data;
   } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
   }
};

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
         const medios = await fetchFromApi("/catalogos/medio-recepcion");
         const niveles = await fetchFromApi("/catalogos/niveles-atencion");
         const productos = await fetchFromApi("/catalogos/products-list");
         const estados = await fetchFromApi("/sepomex/estados/");

         setMediosRecepcion(medios?.medio);
         setNivelesAtencion(niveles?.nivelesDeAtencion);
         setProductos(productos?.products);
         setEstados(estados?.estados);
      };

      fetchInitial();
   }, []);

   const fetchCausas = async (productId: string) => {
      const response = await fetchFromApi("/catalogos/causas-list/", `?product=${productId}`);
      setCausas(response?.causas || []);
   };

   const fetchPostalCodes = async (state: string) => {
      const response = await fetchFromApi("/sepomex/codigos-postales/", `?estado_id=${state}`);
      const formattedPostal = response?.codigos_postales?.map(({ codigo_sepomex }) => ({
         id: codigo_sepomex,
         label: `CP: ${codigo_sepomex}`,
      }));
      setPostalCodes(formattedPostal);
   };

   const fetchMunicipalities = async (state: string, cp: string) => {
      const response = await fetchFromApi("/sepomex/municipios/", `?estado_id=${state}&cp=${cp}`);
      const formattedMunicipality = response?.municipios?.map(({ municipio, municipioId }) => ({
         id: municipioId,
         label: municipio,
      }));
      setMunicipalities(formattedMunicipality);
   };

   const fetchNeighborhoods = async (cp: string) => {
      const response = await fetchFromApi("/sepomex/colonias/", `?cp=${cp}`);
      const formatted = response?.colonias?.map(({ colonia, coloniaId }) => ({
         id: coloniaId,
         label: colonia,
      }));
      setNeighborhoods(formatted);
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
