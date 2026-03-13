# Lab – React Client for Blueprints (Redux + Axios + JWT)

> Basado en el cliente HTML/JS del repo de referencia, este laboratorio moderniza el _frontend_ con **React + Vite**, **Redux Toolkit**, **Axios** (con interceptores y JWT), **React Router** y pruebas con **Vitest + Testing Library**.

## Objetivos de aprendizaje

- Diseñar una SPA en React aplicando **componetización** y **Redux (reducers/slices)**.
- Consumir APIs REST de Blueprints con **Axios** y manejar **estados de carga/errores**.
- Integrar **autenticación JWT** con interceptores y rutas protegidas.
- Aplicar buenas prácticas: estructura de carpetas, `.env`, linters, testing, CI.

## Requisitos previos

- Tener corriendo el backend de Blueprints de los **Labs 3 y 4** (APIs + seguridad).
- Node.js 18+ y npm.

Ver la especificación de glosario clave, consulta las [Definiciones del laboratorio](./DEFINICIONES.md).

## Endpoints esperados (ajústalos si tu backend quedo diferente)

- `GET /api/blueprints` → lista general o catálogo para derivar autores.
- `GET /api/blueprints/{author}`
- `GET /api/blueprints/{author}/{name}`
- `POST /api/blueprints` (requiere JWT)
- `POST /api/auth/login` → `{ token }`

Configura la URL base en `.env`.

## Cómo arrancar

```bash
npm install
cp .env.example .env
# edita .env con la URL del backend
npm run dev
```

Abre `http://localhost:5173`

## Variables de entorno

Crea un archivo `.env` en la raíz:

```variable
VITE_API_BASE_URL=http://localhost:8080/api
```

> **Tip:** en producción usa variables seguras o un _reverse proxy_.

## Estructura

```carpetas
blueprints-react-lab/
├─ src/
│  ├─ components/
│  ├─ features/blueprints/blueprintsSlice.js
│  ├─ pages/
│  ├─ services/apiClient.js   # axios + interceptores JWT
│  ├─ store/index.js          # Redux Toolkit
│  ├─ App.jsx, main.jsx, styles.css
├─ tests/
├─ .github/workflows/ci.yml
├─ index.html, package.json, vite.config.js, README.md
```

## 📌 Requerimientos del laboratorio

## 1. Canvas (lienzo)

- Agregar un lienzo (Canvas) a la página.
- Incluir un componente `BlueprintCanvas` con un identificador propio.
- Definir dimensiones adecuadas (ej. `520×360`) para que no ocupe toda la pantalla pero permita dibujar los planos.

## 2. Listar los planos de un autor

- Permitir ingresar el nombre de un autor y consultar sus planos desde el backend (o mock).
- Mostrar los resultados en una tabla con las siguientes columnas:
  - Nombre del plano
  - Número de puntos
  - Botón `Open` para abrirlo

## 3. Seleccionar un plano y graficarlo

Al hacer clic en el botón `Open`, debe:

- Actualizar un campo de texto con el nombre del plano actual.
- Obtener los puntos del plano correspondiente.
- Dibujar consecutivamente los segmentos de recta en el canvas y marcar cada punto.

## 4. Servicios: `apimock` y `apiclient`

- Implementar dos servicios con la misma interfaz:
  - `apimock`: retorna datos de prueba desde memoria.
  - `apiclient`: consume el API REST real con Axios.
- La interfaz de ambos debe incluir los métodos:
  - `getAll`
  - `getByAuthor`
  - `getByAuthorAndName`
  - `create`
- Habilitar el cambio entre `apimock` y `apiclient` con una sola línea de código:
  - Definir un módulo `blueprintsService.js` que importe uno u otro según una variable en `.env`.
  - Ejemplo en `.env` (Vite):

```env
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` usa el mock.
- `VITE_USE_MOCK=false` usa el API real.

## 5. Interfaz con React

- El nombre del plano actual debe mostrarse en el DOM como parte del estado global (Redux).
- Evitar manipular directamente el DOM; usar componentes y props/estado.

## 6. Estilos

- Agregar estilos para mejorar la presentación.
- Se puede usar Bootstrap u otro framework CSS.
- Ajustar la tabla, botones y tarjetas para acercarse al mock de referencia.

## 7. Pruebas unitarias

- Agregar pruebas con Vitest + Testing Library para validar:
  - Render del canvas.
  - Envío de formularios.
  - Interacciones básicas con Redux (por ejemplo: dispatch de `fetchByAuthor`).

---

### Notas rápidas y recomendaciones

- Para el canvas en tests con jsdom: agregar un mock de `HTMLCanvasElement.prototype.getContext` en `tests/setup.js`.
- Para usar `@testing-library/jest-dom` con Vitest: en `tests/setup.js` importar `import '@testing-library/jest-dom'` y asegurarse de que Vitest provea el global `expect` (configurar `vitest.config.js` con la opción `test: { globals: true, setupFiles: './tests/setup.js' }`).
- Para la conmutación de servicios en Vite, usar `import.meta.env.VITE_USE_MOCK` para leer la variable en tiempo de ejecución.

## 📌 Recomendaciones y actividades sugeridas para el exito del laboratorio

1. **Redux avanzado**
   - [ ] Agrega estados `loading/error` por _thunk_ y muéstralos en la UI.
   - [ ] Implementa _memo selectors_ para derivar el top-5 de blueprints por cantidad de puntos.
2. **Rutas protegidas**
   - [ ] Crea un componente `<PrivateRoute>` y protege la creación/edición.
3. **CRUD completo**
   - [ ] Implementa `PUT /api/blueprints/{author}/{name}` y `DELETE ...` en el slice y en la UI.
   - [ ] Optimistic updates (revertir si falla).
4. **Dibujo interactivo**
   - [ ] Reemplaza el `svg` por un lienzo donde el usuario haga _click_ para agregar puntos.
   - [ ] Botón “Guardar” que envíe el blueprint.
5. **Errores y _Retry_**
   - [ ] Si `GET` falla, muestra un banner y un botón **Reintentar** que dispare el thunk.
6. **Testing**
   - [ ] Pruebas de `blueprintsSlice` (reducers puros).
   - [ ] Pruebas de componentes con Testing Library (render, interacción).
7. **CI/Lint/Format**
   - [ ] Activa **GitHub Actions** (workflow incluido) → lint + test + build.
8. **Docker (opcional)**
   - [ ] Crea `Dockerfile` (+ `compose`) para front + backend.

## Criterios de evaluación

- Funcionalidad y cobertura de casos (30%)
- Calidad de código y arquitectura (Redux, componentes, servicios) (25%)
- Manejo de estado, errores, UX (15%)
- Pruebas automatizadas (15%)
- Seguridad (JWT/Interceptores/Rutas protegidas) (10%)
- CI/Lint/Format (5%)

## Scripts

- `npm run dev` – servidor de desarrollo Vite
- `npm run build` – build de producción
- `npm run preview` – previsualizar build
- `npm run lint` – ESLint
- `npm run format` – Prettier
- `npm test` – Vitest

---

### Extensiones propuestas del reto

- **Redux Toolkit Query** para _caching_ de requests.
- **MSW** para _mocks_ sin backend.
- **Dark mode** y diseño responsive.

> Este proyecto es un punto de partida para que tus estudiantes evolucionen el cliente clásico de Blueprints a una SPA moderna con prácticas de la industria.

---

# INFORME DE LABORATORIO

**Integrantes**

- _Jacobo Diaz Alvarado_
- _Santiago Carmona Pineda_

---

## Entendiendo el proyecto

Se empezará haciendo una breve descripción de la estructura de carpetas dentro de `src`.

### components

Esta carpeta se encarga de crear componentes que son reutilizados en diferentes partes del frontend.

- **BlueprintCanvas**: este componente funcional es el encargado de dibujar la cuadrícula, la línea de puntos y los puntos de un _blueprint_.

- **BlueprintForm**: es un formulario para crear un _blueprint_.

- **BlueprintList**: es un componente que muestra una lista de blueprints como tarjetas.

### features/blueprints

- **blueprintsSlice**: aquí se encuentra la lógica de cómo se deben guardar los datos para el frontend.

### pages

Aquí se encuentran las páginas de nuestro frontend que usan algunos de los componentes ya creados anteriormente. Por ahora tenemos `BlueprintDetailPage`, `BlueprintsPage`, `LoginPage` y `NotFound`.

### services

- _apiClient_: aquí se encuentran las implementaciones de _Axios_ y _JWT_ de nuestro proyecto.

### store

- _index_: es la configuración central de Redux.

---

## Parte I

Se nos pide modificar el componente de _BlueprintCanvas_. Se modifica la dimensión y se le agrega un `id`.

```javascript
export default function BlueprintCanvas({ id, points = [], width = 520, height = 360 })...
```

## Parte II

Se nos pide conectar el frontend en React con el backend en Spring Boot. Para esto nos apoyamos en el laboratorio #5, donde ya se había implementado una _API REST_ protegida con autenticación _JWT_.

### Creación de _blueprintsService_

Este nuevo servicio permite realizar peticiones HTTP hacia los endpoints REST del backend, utilizando las URLs definidas previamente en el laboratorio #5. Cada función del servicio corresponde a un endpoint específico del _BlueprintsAPIController_.

```js
import api from './apiClient'

// GET todos los planos
export const getBlueprints = async () => {
  const res = await api.get('/v1/blueprints')
  return res.data
}

// GET planos por autor
export const getBlueprintsByAuthor = async (author) => {
  const res = await api.get(`/v1/blueprints/${author}`)
  return res.data.data
}

// GET plano por autor y nombre
export const getBlueprint = async (author, name) => {
  const res = await api.get(`/v1/blueprints/${author}/${name}`)
  return res.data.data
}

// POST crear nuevo blueprint
export const createBlueprint = async (blueprint) => {
  const res = await api.post('/v1/blueprints', blueprint)
  return res.data.data
}

// PUT agregar un punto
export const addPoint = async (author, name, point) => {
  const res = await api.put(`/v1/blueprints/${author}/${name}/points`, point)
  return res.data.data
}
```

Un detalle a aclarar es el uso de `data.data`. Se debe a que nuestra _API REST_ retorna un _ApiResponse_.

En nuestra _API REST_ habíamos definido las URLs de esta forma `/v1/blueprint/...` así que tuvimos que modificar las URLs que había en `blueprintsSlice`.

```js
export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  // Modificación de URLs
  const { data } = await api.get('/v1/blueprints')
  const authors = [...new Set(data.data.map((bp) => bp.author))]
  return authors
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  // Modificación de URLs
  const { data } = await api.get(`/v1/blueprints/${encodeURIComponent(author)}`)
  // Adaptación a ApiResponse
  return { author, items: data.data }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    // Modificación de URLs
    const { data } = await api.get(
      `/v1/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
    )
    // Adaptación a ApiResponse
    return data.data
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  // Modificación de URLs
  const { data } = await api.post('/v1/blueprints', payload)
  return data
})
```

### Correcciones en _LoginPage_

También fue necesario corregir dos errores en `LoginPage.jsx`. El primero fue la URL del login, que apuntaba a `/api/auth/login` cuando el endpoint real del backend es `/auth/login`. El segundo fue que el token se guardaba como `data.token`, pero el backend retorna `data.access_token`.

```js
// Antes
const { data } = await api.post('/auth/login', { username, password })
localStorage.setItem('token', data.token)

// Después
const { data } = await axios.post('http://localhost:8080/auth/login', { username, password })
localStorage.setItem('token', data.access_token)
```

Sin embargo, estos cambios no fueron suficientes. Fue necesario modificar `SecurityConfig` en el backend para habilitar `CORS` (Cross-Origin Resource Sharing), ya que el navegador bloqueaba las peticiones del frontend (`localhost:5173`) hacia el backend (`localhost:8080`) al tratarse de orígenes distintos.

```java
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/auth/login").permitAll()
                        .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/**").hasAnyAuthority("SCOPE_blueprints.read", "SCOPE_blueprints.write")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

---

## Parte III

En esta parte se probó que funcionara el frontend en nuestra máquina.

**Captura de login autorizado**
![alt text](<img/Captura de pantalla 2026-03-10 002856.png>)

**Captura de búsqueda por autor**
![alt text](<img/Captura de pantalla 2026-03-10 003020.png>)

**Captura de gráfica de puntos**
![alt text](<img/Captura de pantalla 2026-03-10 003032.png>)

---

## Parte IV

En esta parte se nos pide "quemar" el frontend con mocks. Dentro de la carpeta `services` creamos una carpeta llamada `mocks`. A continuación se explicará los nuevos archivos creados en esta carpeta.

- `apiclient.js`: este service perimíte llamar a la _API REST_ a través de verbos _http_ junto a su recpectiva _URL_.

```js
import api from '../apiClient.js'

export const getAll = async () => {
  const { data } = await api.get('/v1/blueprints')
  return data.data
}

export const getByAuthor = async (author) => {
  const { data } = await api.get(`/v1/blueprints/${encodeURIComponent(author)}`)
  return data.data
}

export const getByAuthorAndName = async (author, name) => {
  const { data } = await api.get(
    `/v1/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`,
  )
  return data.data
}

export const create = async (blueprint) => {
  const { data } = await api.post('/v1/blueprints', blueprint)
  return data.data
}
```

- `apimocks`: aquí se quemaron los datos de un _author_ y se implementaron los métodos _getAll_, _getByAuthor_, _getByAuthorAndName_ y _create_.

```js
const mockData = [
  {
    author: 'hemingway',
    name: 'El viejo y el mar',
    points: [
      { x: 10, y: 10 },
      { x: 100, y: 150 },
      { x: 200, y: 80 },
    ],
  },
  {
    author: 'hemingway',
    name: 'Adiós a las armas',
    points: [
      { x: 50, y: 50 },
      { x: 300, y: 200 },
    ],
  },
  {
    author: 'kafka',
    name: 'La metamorfosis',
    points: [
      { x: 20, y: 30 },
      { x: 150, y: 100 },
      { x: 400, y: 250 },
    ],
  },
]

export const getAll = async () => mockData

export const getByAuthor = async (author) => {
  const result = mockData.filter((item) => item.author === author)
  if (!result.length) {
    throw new Error(`No se encontraron obras para el autor ${author}`)
  }
  return result
}

export const getByAuthorAndName = async (author, name) => {
  const result = mockData.find((item) => item.author === author && item.name === name)
  if (!result) {
    throw new Error(`No se encontró la obra ${name} del autor ${author}`)
  }
  return result
}

export const create = async (blueprint) => {
  mockData.push(blueprint)
  return blueprint
}
```

- `blueprintService`: este servicio se encarga de de decidir si usar el `mock` o utilizar la _API REST_ deependiendo del valor de verdad del `.env`.

```js
import * as mock from './apimock.js'
import * as client from './apiclient.js'

const service = import.meta.env.VITE_USE_MOCK === 'true' ? mock : client

export const getAll = service.getAll
export const getByAuthor = service.getByAuthor
export const getByAuthorAndName = service.getByAuthorAndName
export const create = service.create
```

- `.env`: aquí es donde decidimos qué valor de verdad ponerle al uso de mocks

```
VITE_USE_MOCK=false
```

Después de la creación de estos archivos se modificó `blueprintsSlice.js`, reemplazando las llamadas directas a api por las funciones del nuevo `blueprintsService.js`. De esta forma, el slice ya no depende directamente del backend, sino del servicio activo según la variable `VITE_USE_MOCK`.

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getAll,
  getByAuthor,
  getByAuthorAndName,
  create,
} from '../../services/mocks/blueprintsService.js'

export const fetchAuthors = createAsyncThunk('blueprints/fetchAuthors', async () => {
  const blueprints = await getAll()
  return [...new Set(blueprints.map((bp) => bp.author))]
})

export const fetchByAuthor = createAsyncThunk('blueprints/fetchByAuthor', async (author) => {
  const items = await getByAuthor(author)
  return { author, items }
})

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }) => {
    return await getByAuthorAndName(author, name)
  },
)

export const createBlueprint = createAsyncThunk('blueprints/createBlueprint', async (payload) => {
  return await create(payload)
})
```

---

## Parte V

En esta parte se requiere que el nombre del plano actual se muestre en el DOM como parte del **estado global de Redux**, evitando manipulación directa del DOM.

### Cambios en `BlueprintsPage.jsx`

Se reemplazó el `<h3>` que mostraba el nombre del plano directamente en el encabezado de la sección por un campo de texto de solo lectura (`<input type="text" readOnly>`). Este campo obtiene su valor desde el selector de Redux `current?.name`, lo que garantiza que el nombre del plano es un reflejo directo del estado global y no una manipulación directa del DOM.

```jsx
{
  /* current (Redux state) → campo de texto de solo lectura */
}
;<div className="field-group">
  <label className="field-label" htmlFor="current-bp-name">
    Blueprint name
  </label>
  <input
    id="current-bp-name"
    type="text"
    className="input current-blueprint-input"
    readOnly
    value={current?.name ?? ''}
    placeholder="No blueprint selected"
  />
</div>
```

Cuando el usuario hace clic en `Open` de cualquier fila de la tabla, se despacha el thunk `fetchBlueprint`, que actualiza `current` en el slice. El componente lee `current.name` vía `useSelector`, y React re-renderiza el input automáticamente sin tocar el DOM directamente.

---

## Parte VI

En esta parte se mejora la presentación visual de la aplicación mediante estilos CSS.

### Cambios en `styles.css`

Se refactorizó completamente el archivo de estilos:

- **Variables CSS**: se centralizaron los colores, radios y espaciados en `:root` para facilitar el mantenimiento.
- **Tabla (`bp-table`)**: se añadieron estilos de cabecera con fondo diferenciado, bordes entre filas, efecto hover por fila y alineación tipográfica para mejorar la legibilidad.
- **Botones**: se añadieron transiciones suaves (`hover`, `active`) y una variante compacta (`.btn-sm`) para el botón `Open` dentro de la tabla.
- **Barra de búsqueda (`.search-bar`)**: `display: flex` con espaciado para alinear el input y el botón horizontalmente.
- **Badge**: componente pill para mostrar el número de puntos de cada plano, con color accent y borde sutil.
- **Campo de nombre actual (`.current-blueprint-input`)**: estilo distintivo con color accent (`#93c5fd`) para resaltar visualmente el plano seleccionado.
- **Header y nav**: bordes inferiores, transiciones en links y estado `active` más claro.
- **Tarjetas (`.card`)**: sombra más pronunciada y padding ajustado.

---

## Recomendaciones y actividades sugeridas

### Actividad 1: Redux avanzado

- **Estados loading/error por thunk**

Se agregaron estados de carga y error individuales por cada thunk en `blueprintsSlice.js`, reemplazando el estado global `status` por uno específico para cada operación.

```javascript
initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    fetchAuthorsStatus: 'idle',
    fetchByAuthorStatus: 'idle',
    fetchBlueprintStatus: 'idle',
    createBlueprintStatus: 'idle',
    error: null,
},
```

Cada thunk ahora maneja sus propios estados `pending`, `fulfilled` y `rejected`:

```javascript
.addCase(fetchByAuthor.pending, (s) => { s.fetchByAuthorStatus = 'loading' })
.addCase(fetchByAuthor.fulfilled, (s, a) => {
    s.fetchByAuthorStatus = 'succeeded'
    s.byAuthor[a.payload.author] = a.payload.items
})
.addCase(fetchByAuthor.rejected, (s, a) => {
    s.fetchByAuthorStatus = 'failed'
    s.error = a.error.message
})
```

Estos estados se muestran en la UI de `BlueprintsPage.jsx`:

```jsx
{
  fetchByAuthorStatus === 'loading' && <p>Cargando blueprints...</p>
}
{
  fetchByAuthorStatus === 'failed' && <p style={{ color: '#f87171' }}>Error: {error}</p>
}
```

- **Memo selectors para top-5**

Se instaló `reselect` y se implementó un memo selector que deriva el top 5 de blueprints por cantidad de puntos de un autor, sin recalcular si los datos no cambiaron.

```javascript
import { createSelector } from 'reselect'

const selectByAuthor = (state) => state.blueprints.byAuthor
const selectSelectedAuthor = (_, author) => author

export const selectTop5 = createSelector(
  [selectByAuthor, selectSelectedAuthor],
  (byAuthor, author) => {
    const items = byAuthor[author] || []
    return [...items].sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0)).slice(0, 5)
  },
)
```

En `BlueprintsPage.jsx` se usa el selector y se muestra el resultado debajo de la tabla:

```jsx
const top5 = useSelector((state) => selectTop5(state, selectedAuthor))

{
  top5.length > 0 && (
    <div style={{ marginTop: 16 }}>
      <h4 style={{ marginBottom: 8 }}>Top 5 blueprints por puntos:</h4>
      {top5.map((bp, i) => (
        <p key={bp.name} style={{ margin: '4px 0' }}>
          {i + 1}. {bp.name} — {bp.points?.length || 0} puntos
        </p>
      ))}
    </div>
  )
}
```

--

### Actividad 2: Rutas protegidas

Se creó el componente `PrivateRoute.jsx` en `src/components/`. Este componente verifica si existe un token JWT en el `localStorage`. Si existe, muestra el contenido protegido; si no, redirige automáticamente al login.

```jsx
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}
```

Posteriormente se modificó `App.jsx` para proteger las rutas que requieren autenticación, envolviendo los componentes con `<PrivateRoute>`.

```jsx
import PrivateRoute from './components/PrivateRoute.jsx'

;<Routes>
  <Route
    path="/"
    element={
      <PrivateRoute>
        <BlueprintsPage />
      </PrivateRoute>
    }
  />
  <Route
    path="/blueprints/:author/:name"
    element={
      <PrivateRoute>
        <BlueprintDetailPage />
      </PrivateRoute>
    }
  />
  <Route path="/login" element={<LoginPage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

De esta forma, si un usuario intenta acceder a `/` o `/blueprints/:author/:name` sin estar autenticado, es redirigido automáticamente a `/login`.

---

### Actividad 3: CRUD completo

- **Backend**

Se agregaron dos nuevos endpoints en `BlueprintsAPIController.java`:

**DELETE** — elimina un blueprint por autor y nombre:

```java
@DeleteMapping("/{author}/{bpname}")
public ResponseEntity<ApiResponse<Void>> delete(
        @PathVariable String author,
        @PathVariable String bpname) {
    try {
        services.deleteBlueprint(author, bpname);
        return ResponseEntity.ok(new ApiResponse<>(200, "DELETE", null));
    } catch (BlueprintNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(404, "Not found", null));
    }
}
```

**PUT** — reemplaza completamente la lista de puntos de un blueprint:

```java
@PutMapping("/{author}/{bpname}")
public ResponseEntity<ApiResponse<Blueprint>> update(
        @PathVariable String author,
        @PathVariable String bpname,
        @RequestBody List<Point> newPoints) {
    try {
        Blueprint bp = services.updateBlueprint(author, bpname, newPoints);
        return ResponseEntity.ok(new ApiResponse<>(200, "UPDATED", bp));
    } catch (BlueprintNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(404, "Not Found", null));
    }
}
```

- **Frontend**

Se agregaron `deleteBlueprint` y `updateBlueprint` en `mocks/apiClient.js` y `mocks/apimock.js`, y se exportaron en `mocks/blueprintsService.js`.

En `blueprintsSlice.js` se implementaron dos nuevos thunks con **optimistic updates**: la UI se actualiza inmediatamente antes de que el backend confirme, y si la operación falla, se revierte al estado anterior.

```javascript
export const deleteBlueprintThunk = createAsyncThunk(
  'blueprints/deleteBlueprint',
  async ({ author, name }, { getState, rejectWithValue }) => {
    const prevItems = getState().blueprints.byAuthor[author] || []
    try {
      await deleteBlueprint(author, name)
      return { author, name }
    } catch (e) {
      return rejectWithValue({ author, prevItems })
    }
  },
)

export const updateBlueprintThunk = createAsyncThunk(
  'blueprints/updateBlueprint',
  async ({ author, name, points }, { getState, rejectWithValue }) => {
    const prevBlueprint = getState().blueprints.byAuthor[author]?.find((bp) => bp.name === name)
    try {
      const updated = await updateBlueprint(author, name, points)
      return { author, name, updated }
    } catch (e) {
      return rejectWithValue({ author, name, prevBlueprint })
    }
  },
)
```

En `BlueprintsPage.jsx` se agregaron los botones **Edit** y **Delete** en cada fila de la tabla. Al hacer clic en **Edit** aparece un textarea debajo del canvas para modificar los puntos en formato JSON. Al hacer clic en **Delete** se pide confirmación antes de eliminar.

### Actividad 4: Dibujo interactivo

Se creó el componente `InteractiveCanvas.jsx` en `src/components/`. Este componente extiende el comportamiento de `BlueprintCanvas` permitiendo al usuario hacer clic sobre el canvas para agregar puntos interactivamente.

```jsx
const handleClick = (e) => {
  const canvas = ref.current
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  const x = Math.round((e.clientX - rect.left) * scaleX)
  const y = Math.round((e.clientY - rect.top) * scaleY)
  setPoints((prev) => [...prev, { x, y }])
}
```

El cálculo de `scaleX` y `scaleY` es necesario porque el canvas puede tener un tamaño visual diferente al tamaño interno de coordenadas (`520x360`), por lo que se ajustan las coordenadas del click al sistema de coordenadas real del canvas.

El componente recibe `initialPoints` para mostrar los puntos existentes del blueprint al abrir el editor, y `onSave` como función que se llama al presionar **Guardar** con la lista de puntos actualizada. También incluye un botón **Limpiar** para borrar todos los puntos del canvas.

En `BlueprintsPage.jsx` se reemplazó el textarea de edición JSON por el nuevo `InteractiveCanvas`, de forma que al hacer clic en **Edit** el usuario puede dibujar los puntos directamente sobre el canvas en lugar de escribirlos manualmente.

---

### Actividad 5: Errores y Retry

Se agregaron banners de error con botón **Reintentar** en `BlueprintsPage.jsx` para los dos `GET` principales.

Cuando `fetchByAuthorStatus === 'failed'` (búsqueda por autor), se muestra un banner estilizado con el mensaje de error y un botón que vuelve a despachar el thunk `fetchByAuthor` con el mismo autor:

```jsx
{
  fetchByAuthorStatus === 'failed' && (
    <div className="error-banner" role="alert">
      <span>Error: {error}</span>
      <button className="btn-retry" onClick={() => dispatch(fetchByAuthor(selectedAuthor))}>
        Reintentar
      </button>
    </div>
  )
}
```

Cuando `fetchBlueprintStatus === 'failed'` (carga de un plano individual), se muestra otro banner que reintenta con el último plano que se intentó abrir. Para esto se agregó el estado local `lastOpenedBp`, que se actualiza cada vez que el usuario hace clic en **Open**:

```jsx
const [lastOpenedBp, setLastOpenedBp] = useState(null)

const openBlueprint = (bp) => {
  setLastOpenedBp(bp)
  dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
}
```

```jsx
{
  fetchBlueprintStatus === 'failed' && (
    <div className="error-banner" role="alert">
      <span>Error al cargar el plano</span>
      {lastOpenedBp && (
        <button
          className="btn-retry"
          onClick={() =>
            dispatch(fetchBlueprint({ author: lastOpenedBp.author, name: lastOpenedBp.name }))
          }
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
```

Los estilos de `error-banner` y `btn-retry` ya estaban definidos en `styles.css`, con fondo rojo translúcido y diseño `flex` que ubica el mensaje a la izquierda y el botón a la derecha.

---

### Actividad 6: Testing

Se implementaron pruebas con **Vitest** y **Testing Library** cubriendo los dos aspectos requeridos: reducers puros y componentes con interacción.

#### Pruebas del slice (`blueprintsSlice.test.jsx`)

Se cubre exhaustivamente el reducer puro para cada thunk, incluyendo los tres ciclos de vida (`pending`, `fulfilled`, `rejected`) y los _optimistic updates_ de delete y update. También se prueba el memo selector `selectTop5`.

| Suite                  | Pruebas                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Initial state          | `authors`, `byAuthor`, `current`, todos los status, `error`                                                                |
| `fetchAuthors`         | pending → loading, fulfilled → autores guardados, rejected → error                                                         |
| `fetchByAuthor`        | pending → loading, fulfilled → `byAuthor[author]`, rejected → error                                                        |
| `fetchBlueprint`       | pending → loading, fulfilled → `current`, rejected → error                                                                 |
| `deleteBlueprintThunk` | pending → elimina optimistamente, rejected → revierte lista                                                                |
| `updateBlueprintThunk` | pending → actualiza puntos optimistamente, fulfilled → reemplaza con respuesta del servidor, rejected → revierte blueprint |
| `selectTop5`           | lista vacía, ordenamiento descendente, límite de 5, autor desconocido                                                      |

Ejemplo de prueba de _optimistic update_ en delete:

```js
it('pending → optimistically removes blueprint from list', () => {
  const state = reducer(
    withItems,
    deleteBlueprintThunk.pending('req', { author: 'hemingway', name: 'plano1' }),
  )
  expect(state.byAuthor['hemingway'].map((b) => b.name)).toEqual(['plano2'])
})

it('rejected → reverts list to prevItems', () => {
  const state = reducer(withItems, {
    type: deleteBlueprintThunk.rejected.type,
    payload: { author: 'hemingway', prevItems },
    error: { message: 'server error' },
  })
  expect(state.byAuthor['hemingway']).toEqual(prevItems)
})
```

#### Pruebas de componentes

- **`BlueprintCanvas.test.jsx`** — verifica que el componente renderiza un `<canvas>` en el DOM y que se llama a `getContext`:

```jsx
it('renderiza un canvas y llama getContext', () => {
  const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
  const { container } = render(
    <BlueprintCanvas
      points={[
        { x: 10, y: 10 },
        { x: 50, y: 60 },
      ]}
    />,
  )
  expect(container.querySelector('canvas')).toBeInTheDocument()
  expect(spy).toHaveBeenCalled()
})
```

- **`BlueprintForm.test.jsx`** — verifica que al completar el formulario y hacer submit, el callback `onSubmit` recibe los datos correctamente parseados:

```jsx
it('envía el formulario con puntos parseados', () => {
  const onSubmit = vi.fn()
  render(<BlueprintForm onSubmit={onSubmit} />)
  fireEvent.change(screen.getByLabelText(/Autor/i), { target: { value: 'john' } })
  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'house' } })
  fireEvent.change(screen.getByLabelText(/Puntos/i), { target: { value: '[{"x":1,"y":2}]' } })
  fireEvent.submit(screen.getByText(/Guardar/i))
  expect(onSubmit).toHaveBeenCalledWith({ author: 'john', name: 'house', points: [{ x: 1, y: 2 }] })
})
```

- **`BlueprintsPage.test.jsx`** — verifica que al escribir un autor y hacer clic en **Get blueprints**, se despacha el thunk `fetchByAuthor` con el valor correcto. Se usa un store de Redux configurado con estado inicial y un mock de los thunks para no requerir backend:

```jsx
it('despacha fetchByAuthor al hacer click en Get blueprints', () => {
  const store = makeStore()
  const spy = vi.spyOn(store, 'dispatch')
  render(
    <Provider store={store}>
      <BlueprintsPage />
    </Provider>,
  )
  fireEvent.change(screen.getByPlaceholderText(/Author/i), { target: { value: 'JohnConnor' } })
  fireEvent.click(screen.getByText(/Get blueprints/i))
  expect(spy).toHaveBeenCalledWith({ type: 'blueprints/fetchByAuthor', payload: 'JohnConnor' })
})
```

Para que las pruebas funcionen correctamente con jsdom se configuró en `tests/setup.js` la importación de `@testing-library/jest-dom` y un mock del contexto del canvas (`HTMLCanvasElement.prototype.getContext`).
