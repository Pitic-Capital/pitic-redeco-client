import axios from "axios";
import type {
   CreateSuperUserPayload,
   CreateUserPayload,
   TokenPayload,
   TokenResponse,
   Queja,
   EnvioQuejasResponse,
} from "../types/redeco.types";

//#region Config de ambiente
export const API_URL_TEST = "https://api.condusef.gob.mx";
export const API_URL_PROD = "https://api-redeco.condusef.gob.mx";
export const ENV_KEY = "APP_ENV";
export const getApiUrl = (): string => (localStorage.getItem(ENV_KEY) === "test" ? API_URL_TEST : API_URL_PROD);
//#endregion

//#region Factory
const buildClient = (token?: string) =>
   axios.create({
      baseURL: getApiUrl(),
      headers: {
         "Content-Type": "application/json",
         ...(token && { Authorization: token }),
      },
   });
//#endregion

//#region Autenticacion
/** Crea el super usuario de la institucion. Requiere la clave REDECO. */
export const createSuperUser = (payload: CreateSuperUserPayload) =>
   buildClient().post("/auth/users/create-super-user/", payload);

/** Crea un usuario normal. Requiere token del super usuario. */
export const createUser = (token: string, payload: CreateUserPayload) =>
   buildClient(token).post("/auth/users/create-user/", payload);

/** Obtiene token inicial (GET). */
export const getToken = (payload: TokenPayload) =>
   buildClient().get<TokenResponse>("/auth/users/token/", { data: payload });

/** Renueva token (POST). */
export const renewToken = (payload: TokenPayload) => buildClient().post<TokenResponse>("/auth/users/token/", payload);
//#endregion

//#region Quejas
/** Envia una o mas quejas. */
export const sendQuejas = (token: string, quejas: Queja[]) =>
   buildClient(token).post<EnvioQuejasResponse>("/redeco/quejas", quejas);

/** Elimina una queja por folio. */
export const deleteQueja = (token: string, quejaFolio: string) =>
   buildClient(token).delete("/redeco/quejas/", {
      params: { quejaFolio },
   });

/** Consulta quejas reportadas por ano y mes. */
export const getQuejas = (token: string, year: number, month: number) =>
   buildClient(token).get("/redeco/quejas/", {
      params: { year, month },
   });
//#endregion

//#region Catalogos institucionales
/** Catalogo de medios de recepcion o canal. */
export const getCatalogoMediosRecepcion = (token: string) => buildClient(token).get("/catalogos/medio-recepcion");

/** Catalogo de niveles de atencion o contacto. */
export const getCatalogoNivelesAtencion = (token: string) => buildClient(token).get("/catalogos/niveles-atencion");

/** Lista de productos de la institucion financiera. */
export const getCatalogoProductos = (token: string) => buildClient(token).get("/catalogos/products-list");

/** Lista de causas por producto. */
export const getCatalogoCausas = (token: string, productId: string) =>
   buildClient(token).get("/catalogos/causas-list/", {
      params: { product: productId },
   });
//#endregion

//#region SEPOMEX
/** Lista de estados. */
export const getEstados = () => buildClient().get("/sepomex/estados/");

/** Codigos postales por estado. */
export const getCodigosPostales = (estadoId: number) =>
   buildClient().get("/sepomex/codigos-postales/", {
      params: { estado_id: estadoId },
   });

/** Municipios por estado y codigo postal. */
export const getMunicipios = (estadoId: number, cp: string) =>
   buildClient().get("/sepomex/municipios/", {
      params: { estado_id: estadoId, cp },
   });

/** Colonias por codigo postal. */
export const getColonias = (cp: string) =>
   buildClient().get("/sepomex/colonias/", {
      params: { cp },
   });
//#endregion
