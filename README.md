# pitic-redeco-client

Frontend para la integración con la **API REDECO de CONDUSEF**. Permite a instituciones financieras registrar, consultar y eliminar quejas de usuarios a través de una interfaz web amigable.

**URL produccion:** https://Pitic-Capital.github.io/pitic-redeco-client

---

## Requisitos

- Node.js >= 16
- npm >= 8

---

## Ejecucion local

```bash
npm install
npm start
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Deploy a GitHub Pages

```bash
npm run deploy
```

Esto ejecuta el build de produccion y publica automaticamente en la rama `gh-pages`.

---

## Modulos principales

### `src/api/redeco.client.ts`

Cliente centralizado con todas las llamadas a la API REDECO. Organizado en regiones:

| Region                    | Funciones                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| Config de ambiente        | `getApiUrl`, `ENV_KEY`, URLs de produccion y pruebas                                                    |
| Autenticacion             | `createSuperUser`, `createUser`, `getToken`, `renewToken`                                               |
| Quejas                    | `sendQuejas`, `deleteQueja`, `getQuejas`                                                                |
| Catalogos institucionales | `getCatalogoMediosRecepcion`, `getCatalogoNivelesAtencion`, `getCatalogoProductos`, `getCatalogoCausas` |
| SEPOMEX                   | `getEstados`, `getCodigosPostales`, `getMunicipios`, `getColonias`                                      |

### `src/types/redeco.types.ts`

Tipos TypeScript para todos los payloads y respuestas de la API (`Queja`, `TokenResponse`, `EnvioQuejasResponse`, etc.).

### `src/pages/`

| Archivo         | Descripcion                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| `Login.tsx`     | Autenticacion con usuario y contrasena. Incluye toggle de ambiente (produccion / pruebas). |
| `Dashboard.tsx` | Vista principal con tabs para consultar quejas, registrar una nueva y ver catalogos.       |

### `src/components/`

| Archivo                | Descripcion                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `Form.tsx`             | Formulario para el registro de quejas con todos los campos del diccionario REDECO. |
| `ComplaintConsult.tsx` | Consulta de quejas por mes y ano.                                                  |
| `Catalogues.tsx`       | Visualizacion de los catalogos disponibles de la institucion.                      |

### `src/context/CataloguesContext.tsx`

Context global que carga y expone los catalogos de REDECO y SEPOMEX al inicio de la sesion. Disponible en todos los componentes via `useCatalogues()`.

---

## Ambientes

El ambiente se controla desde el toggle en la pantalla de Login y se persiste en `localStorage` bajo la llave `APP_ENV`.

| Valor            | URL                                  |
| ---------------- | ------------------------------------ |
| `prod` (default) | `https://api-redeco.condusef.gob.mx` |
| `test`           | `https://api.condusef.gob.mx`        |

---

## Referencia API

Documentacion completa de los endpoints en [api-redeco-docs.condusef.gob.mx](https://api-redeco-docs.condusef.gob.mx/guia.php).  
Soporte tecnico CONDUSEF: `soporte.api@condusef.gob.mx`
