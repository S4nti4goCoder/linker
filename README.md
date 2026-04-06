# LinKer 🔗

Red social moderna construida con React 19 y Supabase. Permite a los usuarios crear publicaciones, interactuar mediante likes y comentarios, enviar mensajes directos, recibir notificaciones en tiempo real y explorar perfiles públicos.

---

## 🚀 Tech Stack

| Tecnología                | Uso                                       |
| ------------------------- | ----------------------------------------- |
| React 19                  | UI y componentes                          |
| Vite 7                    | Bundler y dev server                      |
| Tailwind CSS 4            | Estilos                                   |
| Supabase                  | Auth, Base de datos y Realtime            |
| Cloudflare R2             | Almacenamiento de archivos (imágenes/videos) |
| Cloudflare Workers        | API proxy para subida de archivos         |
| TanStack Query v5         | Server state, caché y paginación          |
| Zustand v5                | Estado global del cliente                 |
| React Router v7           | Navegación                                |
| React Hook Form           | Manejo de formularios                     |
| Sonner                    | Notificaciones toast                      |
| Dayjs                     | Manejo de fechas y tiempo relativo        |
| Iconify                   | Íconos                                    |
| Fast Average Color        | Extracción de color dominante de imágenes |
| Browser Image Compression | Compresión de imágenes a WebP             |
| nsfwjs                    | Detección de contenido NSFW              |

---

## ✨ Funcionalidades

### Autenticación

- Registro e inicio de sesión con email/contraseña y Google OAuth via Supabase Auth
- Rutas protegidas — redirige al login si no está autenticado
- Onboarding obligatorio: al registrarse, el usuario debe configurar foto y nombre antes de acceder
- Recuperación de contraseña por email

### Publicaciones

- Crear publicaciones con texto, imagen o video
- Compresión automática de imágenes a WebP antes de subir
- Soporte para emojis con picker integrado
- Paginación infinita con scroll detection
- Likes en tiempo real con toggle (dar/quitar like)
- Editar y eliminar publicaciones propias con confirmación
- Guardar publicaciones en colecciones
- Actualización optimista y sincronización en tiempo real vía Supabase Realtime

### Comentarios

- Modal de comentarios por publicación
- Likes en comentarios con contador en tiempo real
- Respuestas a comentarios (hilo anidado)
- Soporte de emojis en comentarios

### Mensajes directos

- Chat en tiempo real entre usuarios
- Lista de conversaciones con último mensaje y estado de lectura
- Indicador de usuario en línea / última conexión
- Filtro de contenido en mensajes

### Notificaciones

- Dropdown de notificaciones en tiempo real (desktop y mobile)
- Tipos: `like`, `comentario`, `respuesta`, `seguidor`, `advertencia`
- Badge de no leídas con contador
- Marcar todas como leídas
- Implementadas con triggers PostgreSQL + Supabase Realtime

### Perfiles

- Mi perfil: foto, banner con color extraído, stats (publicaciones y likes recibidos), edición
- Perfil público: vista de perfil de otros usuarios con sus publicaciones
- Sistema de seguidores (seguir/dejar de seguir)
- Navegación al perfil desde cualquier publicación o comentario

### Búsqueda

- Barra de búsqueda de usuarios en el header
- Resultados en tiempo real con 2+ caracteres escritos
- Identifica al usuario propio con etiqueta "Tú"
- Navegación directa al perfil desde los resultados

### Moderación de contenido

- Filtro de texto con blocklist de palabras explícitas (español/inglés)
- Detección de imágenes NSFW con nsfwjs (TensorFlow.js)
- Sistema de reportes con motivos predefinidos
- Aplicado en publicaciones, comentarios y mensajes

### Panel de administración

- Gestión de reportes pendientes (descartar o eliminar publicación)
- Sistema de strikes (3 strikes = ban automático)
- Búsqueda y gestión de usuarios (ban/unban manual)
- Sistema de apelaciones para usuarios baneados
- Historial de acciones administrativas
- Monitoreo de uso de almacenamiento en R2

### UI/UX

- Modo oscuro / claro persistente
- Dark mode con variables CSS personalizadas
- Diseño responsive (desktop y mobile)
- Bottom sheet para notificaciones en mobile
- Skeleton loaders en la carga inicial
- Página 404 personalizada
- Error boundary global
- Términos de servicio y política de privacidad

---

## 📁 Estructura del proyecto

```
src/
├── App.jsx                        # QueryClient, tema, FormPost global
├── components/
│   ├── Forms/
│   │   ├── FormPost.jsx           # Modal crear publicación
│   │   └── FormActualizarPerfil.jsx
│   ├── HomePageComponents/
│   │   ├── PublicacionCard.jsx    # Card con like, comentar, reportar
│   │   ├── ComentarioModal.jsx    # Modal de comentarios
│   │   ├── ComentarioCard.jsx     # Card con like y responder
│   │   ├── RespuestaCard.jsx
│   │   ├── HeaderSticky.jsx       # Header con búsqueda de usuarios
│   │   ├── InputPublicar.jsx
│   │   └── ...
│   ├── Sidebar/
│   │   ├── Sidebar.jsx
│   │   └── NotificacionesDropdown.jsx
│   ├── ErrorBoundary.jsx
│   └── ui/
│       ├── EmojiPickerSimple.jsx
│       ├── CreatorBadge.jsx
│       ├── buttons/
│       └── spinners/
├── hooks/                         # Custom hooks reutilizables
├── layouts/MainLayout.jsx         # Layout principal + pantalla de ban
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── MiPerfilPage.jsx
│   ├── PerfilPublicoPage.jsx
│   ├── MensajesPage.jsx
│   ├── ColeccionesPage.jsx
│   ├── AdminPage.jsx              # Panel de administración
│   ├── TerminosPage.jsx
│   ├── PrivacidadPage.jsx
│   └── NotFoundPage.jsx
├── routers/router.jsx
├── stack/                         # Hooks de TanStack Query (queries + mutations)
├── store/                         # Stores de Zustand + lógica Supabase
├── utils/
│   ├── contentFilter.js           # Filtro de texto +18
│   ├── nsfwDetector.js            # Detección NSFW con IA
│   ├── r2.js                      # Utilidades Cloudflare R2
│   ├── creator.js                 # Configuración del creador/admin
│   └── validation.js              # Validación de archivos y URLs
└── supabase/supabase.config.jsx
```

---

## 🗄️ Base de datos (Supabase)

### Tablas

- `usuarios` — perfil (nombre, foto_perfil, banner, strikes, baneado)
- `publicaciones` — posts con descripcion, url, type, sentimiento, ubicacion
- `likes` — relación usuario ↔ publicación
- `comentarios` — comentarios por publicación
- `likes_comentarios` — likes en comentarios
- `respuestas_comentarios` — respuestas anidadas a comentarios
- `notificaciones` — notificaciones por tipo (like, comentario, respuesta, seguidor, advertencia)
- `seguidores` — relación seguidor ↔ seguido
- `conversaciones` — chats entre usuarios
- `mensajes` — mensajes directos
- `colecciones` — publicaciones guardadas
- `reportes` — reportes de contenido
- `admin_log` — historial de acciones administrativas
- `apelaciones` — apelaciones de usuarios baneados

### Funciones PostgreSQL

- `publicaciones_con_detalles(_id_usuario)` — posts con likes, comentarios y estado like del usuario
- `publicaciones_seguidos(...)` — posts de usuarios seguidos
- `publicaciones_liked(_id_usuario)` — posts que el usuario ha dado like
- `toggle_like(...)` — dar/quitar like en publicación
- `toggle_like_comentario(...)` — dar/quitar like en comentario
- `toggle_seguir(...)` — seguir/dejar de seguir usuario
- `comentarios_con_respuestas(...)` — comentarios con conteo de respuestas
- `listar_seguidores(...)` / `listar_siguiendo(...)` — listas de seguidores

### Triggers

- `trigger_like` → notifica al autor cuando alguien da like
- `trigger_comentario` → notifica al autor cuando alguien comenta
- `trigger_respuesta` → notifica al autor cuando alguien responde
- `trigger_like_comentario` → notifica al autor del comentario cuando le dan like
- `trigger_seguidor` → notifica al usuario cuando alguien lo sigue

---

## ☁️ Almacenamiento (Cloudflare R2)

Los archivos (imágenes y videos) se almacenan en Cloudflare R2 a través de un Cloudflare Worker que actúa como proxy.

- **Bucket:** `linker-storage`
- **Worker:** `linker-upload` (maneja PUT, DELETE y LIST)
- **Compresión:** Imágenes se comprimen a WebP (~100-200KB) antes de subir
- **Estructura:** `publicaciones/{id}.webp`, `usuarios/{id}.webp`, `banners/{id}.webp`
- **Free tier:** 10 GB almacenamiento, 0 costo de egress

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/s4nti4gocoder/linker.git
cd linker
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_R2_WORKER_URL=tu_cloudflare_worker_url
VITE_R2_PUBLIC_URL=tu_r2_public_url
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

---

## 📦 Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # Linter ESLint
```

---

## 👤 Autor

**Santiago Quintero** — [@S4nti4goCoder](https://github.com/S4nti4goCoder)
