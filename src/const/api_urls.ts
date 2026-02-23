export const API_URL_TEST = "https://api.condusef.gob.mx";
export const API_URL_PROD = "https://api-redeco.condusef.gob.mx";

export const ENV_KEY = "APP_ENV";

export const getApiUrl = (): string => {
   const env = localStorage.getItem(ENV_KEY);
   return env === "test" ? API_URL_TEST : API_URL_PROD;
};
