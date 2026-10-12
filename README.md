# Axioma — Club de Matemáticas del Tec de Monterrey

![CI](https://github.com/catherinegd7/AXIOMA/actions/workflows/ci.yml/badge.svg)

**🔗 Sitio en vivo:** https://axioma-five-brown.vercel.app/

Sitio construido con **React + Vite**, **Tailwind CSS** y **React Router** en
el frontend, más un backend en **Express + MongoDB** que sirve todo el
contenido que cambia con frecuencia (equipo, eventos, galería, archivo de
problemas, recursos descargables). Es un híbrido: un one-pager con
navegación por anclas (scroll suave) para la portada, más páginas
independientes con rutas reales para contenido que no tiene sentido como
sección scrolleable (`/problemas`, `/perfil`, `/admin/*`).

## Cómo correr el proyecto

### Solo el frontend (portada sin datos dinámicos)

```bash
npm install
npm run dev
```

### Frontend + backend (necesario para todo lo que lee de la base de datos)

Casi todo el sitio lee de MongoDB a través de un backend en Express: el
equipo, los eventos, la galería, el archivo de problemas y los recursos
descargables ya no son arrays escritos a mano.

1. **Crea tu `.env`** copiando `.env.example` y generando tu propia clave:
   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   # pega el resultado como valor de JWT_SECRET en tu .env
   ```
2. **`MONGO_URI`**: pídele a alguien del equipo la cadena de conexión de
   MongoDB Atlas (todos trabajan sobre la misma base de datos compartida, no
   una local cada quien) y pégala en tu `.env`. Si prefieres una base local
   propia para probar cosas sin afectar a nadie, puedes usar
   `mongodb://localhost:27017/axioma` con MongoDB instalado localmente, pero
   entonces necesitas sembrar tus propios datos (ver el siguiente paso).
3. **Instala dependencias y llena la base de datos** (si es tu primera vez
   con una base local propia — si ya usas la base compartida del equipo,
   **sáltate este paso**, ya tiene datos reales):
   ```bash
   npm install
   npm run seed          # problemas + categorías + equipo (destructivo: borra comentarios)
   npm run seed:equipo    # SOLO actualiza el equipo, sin tocar problemas/comentarios
   ```
   `npm run seed` es seguro de correr más de una vez, pero **borra todos los
   comentarios** de la gente al volver a crear los problemas — úsalo solo
   para levantar una base nueva desde cero, no en la base compartida del
   equipo. `npm run seed:equipo` es el que se usa normalmente para
   actualizar nombres/fotos del equipo — no toca problemas, categorías,
   comentarios ni eventos.
4. **Corre ambos servidores** (en dos terminales separadas):
   ```bash
   npm run server   # backend, http://localhost:4000
   npm run dev      # frontend, http://localhost:5173
   ```

### Subir imágenes/PDFs desde los paneles de admin (opcional)

Los pósters de eventos, las fotos de galería y los recursos descargables
(PDFs) se suben a [Cloudinary](https://cloudinary.com) directo desde el
navegador. Sin configurar esto, esos paneles siguen funcionando pero sin la
opción de subir archivo (ver `.env.example` para los pasos exactos:
`VITE_CLOUDINARY_CLOUD_NAME` y `VITE_CLOUDINARY_UPLOAD_PRESET`).

**Importante si vas a probar en el sitio deployado (no solo en local):**
Vercel no lee tu `.env` — hay que agregar esas mismas variables en
**Vercel → Settings → Environment Variables** y luego darle **Redeploy**
para que tomen efecto (los env vars de Vite se "hornean" en el build).

### Iniciar sesión con Google (opcional)

Sin esto todo funciona igual, solo no aparece el botón de Google.

1. En [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   → **Crear credenciales → ID de cliente de OAuth** → tipo **Aplicación web**.
   (Si te lo pide, configura antes la pantalla de consentimiento: tipo
   "Externo", con tu correo como usuario de prueba.)
2. En **Orígenes autorizados de JavaScript** agrega `http://localhost:5173`
   y la URL de producción.
3. Copia el **ID de cliente** (`….apps.googleusercontent.com`) en tu `.env`
   en **ambas** variables, `GOOGLE_CLIENT_ID` y `VITE_GOOGLE_CLIENT_ID`, y
   reinicia `npm run server` y `npm run dev`. El "secreto del cliente" no se
   usa.

Cómo funciona: el botón de Google le da al frontend un ID token firmado por
Google; el backend lo verifica (`POST /api/auth/google`), crea la cuenta en
`users` si no existe (username sacado del correo, sin contraseña, con
`googleId`) y regresa el mismo tipo de sesión (JWT) que el login con
contraseña. Si ya existe una cuenta **con contraseña** con ese correo, no se
liga automáticamente.

### Pruebas del backend

```bash
npm run test
```

Corre contra una base de datos separada que se limpia sola entre cada
prueba, nunca toca los datos reales. Este mismo comando corre
automáticamente en GitHub Actions en cada push/PR (ver el badge arriba),
junto con `npm run lint` y `npm run build`.

## Panel de administración (`/admin`)

La forma normal de agregar/editar contenido ya no es tocar código: quien
tenga una cuenta con `isAdmin: true` puede entrar a `/admin` desde su perfil
y editar todo desde el navegador.

| Ruta | Para qué |
| --- | --- |
| `/admin/eventos` | Crear, editar y borrar los eventos de la portada (con póster opcional). |
| `/admin/galeria` | Subir, editar, reordenar y borrar las fotos de Galería. |
| `/admin/recursos` | Subir PDFs y otros documentos descargables — aparecen en `/problemas` y `/recursos`. |

`isAdmin` no se puede activar desde el sitio (no hay endpoint para
"hacerme admin a mí mismo" a propósito, por seguridad) — se pone a mano
directo en MongoDB Atlas, en el documento del usuario.

El **equipo** (`/admin` no lo cubre) sigue siendo el único contenido que se
edita por código: en `server/src/data/equipoEventos.js`, corriendo después
`npm run seed:equipo`. Ese mismo archivo tiene un respaldo casi idéntico en
`src/components/sections/Equipo.jsx` (`MIEMBROS_RESPALDO`) que se usa solo
si la API no responde — si editas uno, edita el otro también.

## Dos repositorios de GitHub

Este proyecto vive en dos repos que se mantienen sincronizados a mano:

- **[`catherinegd7/AXIOMA`](https://github.com/catherinegd7/AXIOMA)** — el
  repo de trabajo, donde se abren los Pull Requests y corre el CI.
- **[`AXIOMA-tec/axioma`](https://github.com/AXIOMA-tec/axioma)** — el que
  tiene conectado el deployment de Vercel (el sitio en vivo de arriba).

Después de mergear un PR en `catherinegd7/AXIOMA`, hay que empujar ese mismo
`main` también a `AXIOMA-tec/axioma` para que el cambio llegue al sitio:

```bash
git remote add axioma-tec https://github.com/AXIOMA-tec/axioma.git  # una sola vez
git push origin main
git push axioma-tec main
```

Si alguien subió cambios directo a cualquiera de los dos repos (pasa
seguido, sobre todo con lotes de problemas nuevos), el push puede rechazarse
por estar desactualizado — en ese caso, `git fetch` + `git merge` del que
esté adelantado antes de volver a subir.

## Estructura del proyecto

```
/src
  /components
    Navbar.jsx              # Fijo arriba en todas las rutas
    CustomCursor.jsx        # Cursor personalizado (punto + anillo)
    AuthForm.jsx            # Formulario compartido de login/registro
    AuthProvider.jsx        # Contexto de sesión (useAuth)
    GoogleButton.jsx
    /sections               # Secciones de la portada (one-pager)
      Hero.jsx               # id="inicio"
      QuienesSomos.jsx       # id="quienes-somos"
      Equipo.jsx             # id="equipo"
      AxiomaCurioso.jsx      # entre Equipo y Eventos, sin id (no navegable)
      Eventos.jsx            # id="eventos"
      Galeria.jsx            # id="galeria"
      Contacto.jsx           # id="contacto"
  /pages
    HomePage.jsx             # Ruta "/" — Navbar + todas las secciones
    CuentaPage.jsx           # Ruta "/cuenta" — login/registro
    PerfilPage.jsx           # Ruta "/perfil" — datos de tu cuenta + tus comentarios
    ProblemasPage.jsx        # Ruta "/problemas" — Navbar + Problemas.jsx
    Problemas.jsx            # Todo el contenido del archivo de problemas
    RecursosPage.jsx         # Ruta "/recursos" — todos los PDFs, por año
    AdminPage.jsx            # Ruta "/admin" — índice de secciones editables
    AdminEventosPage.jsx     # Ruta "/admin/eventos"
    AdminGaleriaPage.jsx     # Ruta "/admin/galeria"
    AdminRecursosPage.jsx    # Ruta "/admin/recursos"
  /hooks
    useApiData.js            # Pide datos a la API con un respaldo si falla
    useIsAdmin.js             # Confirma isAdmin pidiendo /api/auth/me
    useBloquearScroll.js      # Bloquea el scroll de fondo con un modal abierto
  /lib
    api.js                    # Cliente de la API (fetchJSON/apiFetch)
    auth.js                   # Contexto de sesión
    cloudinary.js              # Subida de imágenes/archivos a Cloudinary
    contacto.js                 # Correo, WhatsApp e Instagram del club, en un solo lugar
  App.jsx                    # Solo define <BrowserRouter> y las <Route>
  index.css                  # Tailwind + paleta de colores
```

También existe `/server` — el backend en Express + MongoDB que sirve casi
todo el contenido dinámico del sitio.

```
/server/src
  app.js                   # Arma la app de Express (rutas, cors, rate limit)
  server.js                # Entry point real: conecta Mongo + app.listen()
  seed.js                  # Siembra problemas/categorías/equipo desde cero (destructivo)
  seedEquipo.js            # Solo actualiza el equipo (npm run seed:equipo)
  /data
    problemasReales.js     # Todos los problemas reales (Putnam, OMUM, HMMT)
    equipoEventos.js        # Directores, coordinadores y asesores del equipo
  /models                  # User, Category, Problem, Comment, Miembro, Evento, Foto, Recurso
  /routes
    auth.routes.js           # Login, registro, Google
    categories.routes.js
    problems.routes.js        # Incluye /count, para la cifra de Quiénes Somos
    comments.routes.js        # Comentarios de un problema específico
    misComentarios.routes.js  # Tus comentarios, en cualquier problema (para /perfil)
    miembros.js
    eventos.js
    galeria.js
    recursos.js
  /middleware
    auth.js                 # requireAuth / requireAdmin
  /__tests__               # Pruebas con vitest + supertest (npm run test)
```

## Cómo funciona la navegación del Navbar

El Navbar (`src/components/Navbar.jsx`) es compartido:

- Si ya estás en `/`, los links de sección hacen `scrollIntoView` directo.
- Si estás en otra ruta (ej. `/problemas`), esos mismos links navegan a `/`
  pasando el id de la sección por `state`. `HomePage.jsx` lee ese `state` en
  un `useEffect` al montarse y hace el scroll una vez que el one-pager ya
  está renderizado.
- "Problemas" es un `<Link to="/problemas">` normal de React Router.

## Notas por sección/página

- **Hero**: mensaje de bienvenida, botones "Únete" (Instagram) y "Ver
  problemas", símbolos matemáticos flotando de fondo.
- **QuienesSomos**: propósito y visión reales (basados en el Anexo 3 de
  LiFE), franja de cifras con el contador de problemas leído en vivo de la
  API (`GET /api/problems/count`).
- **Equipo**: directores, coordinadores y asesores — datos en
  `server/src/data/equipoEventos.js` (ver "Panel de administración" arriba).
- **AxiomaCurioso**: tres axiomas matemáticos reales explicados de forma
  ligera, solo para bajarle el tono formal a la página entre Equipo y
  Eventos.
- **Eventos**: se editan desde `/admin/eventos`. Los "próximos" siempre se
  muestran antes que los "pasados", sin importar el orden en que se hayan
  creado.
- **Galería**: se edita desde `/admin/galeria`. Dos filas que se deslizan en
  sentidos opuestos con el scroll.
- **Contacto**: correo, Instagram y WhatsApp — todo en `src/lib/contacto.js`.
- **Problemas** (`/problemas`): filtros (año, tema, tipo de concurso),
  navegación por carpetas (una por competencia), buscador, y un panel de
  "Recursos" con los PDFs más recientes (todos están en `/recursos`,
  agrupados por año). El enunciado se renderiza con **KaTeX**. Cada problema
  tiene su propio hilo de comentarios (hace falta sesión iniciada para
  comentar).
- **Perfil** (`/perfil`): datos de tu cuenta y un historial de "Tus
  comentarios" — privado, solo tú ves los tuyos.

## Paleta de colores

La paleta neutra de la portada vive en `src/index.css` bajo el bloque
`@theme` (`--color-brand-50` a `--color-brand-900`, clases `bg-brand-*`,
`text-brand-*`, etc.). El trío de color de marca (dorado `#FFB401`, naranja
`#E57505`, rojo `#B70B0D`) aparece en Hero y Contacto como fondo completo, y
dosificado en detalles del resto del sitio (íconos, acentos) — la página de
Problemas usa su propio sistema, plano y en blanco y negro con un solo
acento dorado, deliberadamente distinto al resto.
