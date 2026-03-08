# LinKer 🔗

Red social moderna construida con React 19 y Supabase. Permite a los usuarios crear publicaciones, interactuar mediante likes y comentarios, recibir notificaciones en tiempo real y explorar perfiles públicos.

---

## 🚀 Tech Stack

| Tecnología                | Uso                                       |
| ------------------------- | ----------------------------------------- |
| React 19                  | UI y componentes                          |
| Vite 7                    | Bundler y dev server                      |
| Tailwind CSS 4            | Estilos                                   |
| Supabase                  | Auth, Base de datos, Storage y Realtime   |
| TanStack Query v5         | Server state, caché y paginación          |
| Zustand v5                | Estado global del cliente                 |
| React Router v7           | Navegación                                |
| React Hook Form           | Manejo de formularios                     |
| Sonner                    | Notificaciones toast                      |
| Dayjs                     | Manejo de fechas y tiempo relativo        |
| Iconify                   | Íconos                                    |
| Fast Average Color        | Extracción de color dominante de imágenes |
| Browser Image Compression | Compresión de imágenes antes de subir     |

---

## ✨ Funcionalidades

### Autenticación

- Registro e inicio de sesión con email y contraseña via Supabase Auth
- Rutas protegidas — redirige al login si no está autenticado
- Onboarding obligatorio: al registrarse, el usuario debe configurar foto y nombre antes de acceder

### Publicaciones

- Crear publicaciones con texto, imagen o video
- Soporte para emojis con picker integrado
- Paginación infinita con scroll detection
- Likes en tiempo real con toggle (dar/quitar like)
- Editar y eliminar publicaciones propias con confirmación
- Actualización optimista y sincronización en tiempo real vía Supabase Realtime

### Comentarios

- Modal de comentarios por publicación
- Likes en comentarios con contador en tiempo real
- Respuestas a comentarios (hilo anidado)
- Soporte de emojis en comentarios

### Notificaciones

- Dropdown de notificaciones en tiempo real
- Tipos: `like` en publicación, `like` en comentario, `comentario`, `respuesta`
- Badge de no leídas con contador
- Marcar todas como leídas
- Implementadas con triggers PostgreSQL + Supabase Realtime

### Perfiles

- Mi perfil: foto, banner con color extraído, stats (publicaciones y likes recibidos), edición
- Perfil público: vista de perfil de otros usuarios con sus publicaciones
- Navegación al perfil desde cualquier publicación o comentario

### Búsqueda

- Barra de búsqueda de usuarios en el header
- Resultados en tiempo real con 2+ caracteres escritos
- Identifica al usuario propio con etiqueta "Tú"
- Navegación directa al perfil desde los resultados

### UI/UX

- Modo oscuro / claro persistente
- Dark mode con variables CSS personalizadas
- Scrollbar oculto en todos los contenedores
- Skeleton loaders en la carga inicial de posts
- Página 404 personalizada
- Diseño responsive

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
│   │   ├── PublicacionCard.jsx    # Card con like, comentar, editar, eliminar
│   │   ├── ComentarioModal.jsx    # Modal de comentarios
│   │   ├── ComentarioCard.jsx     # Card con like y responder
│   │   ├── RespuestaCard.jsx
│   │   ├── HeaderSticky.jsx       # Header con búsqueda de usuarios
│   │   ├── InputPublicar.jsx
│   │   └── ...
│   ├── Sidebar/
│   │   ├── Sidebar.jsx
│   │   └── NotificacionesDropdown.jsx
│   └── ui/
│       ├── EmojiPickerSimple.jsx
│       ├── buttons/
│       └── spinners/
├── hooks/                         # Custom hooks reutilizables
├── layouts/MainLayout.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── MiPerfilPage.jsx
│   ├── PerfilPublicoPage.jsx
│   └── NotFoundPage.jsx
├── routers/router.jsx
├── stack/                         # Hooks de TanStack Query (queries + mutations)
├── store/                         # Stores de Zustand + lógica Supabase
└── supabase/supabase.config.jsx
```

---

## 🗄️ Base de datos (Supabase)

### Tablas

- `usuarios` — perfil del usuario (nombre, foto_perfil, id_auth)
- `publicaciones` — posts con descripcion, url, type, fecha
- `likes` — relación usuario ↔ publicación
- `comentarios` — comentarios por publicación
- `likes_comentarios` — likes en comentarios
- `respuestas_comentarios` — respuestas anidadas a comentarios
- `notificaciones` — notificaciones por tipo (like, comentario, respuesta)

### Funciones PostgreSQL

- `publicaciones_con_detalles(_id_usuario)` — posts con likes, comentarios y estado like del usuario
- `toggle_like(p_publicacion_id, p_user_id)` — dar/quitar like en publicación
- `toggle_like_comentario(p_comentario_id, p_user_id)` — dar/quitar like en comentario
- `comentarios_con_respuestas(id_publicacion)` — comentarios con conteo de respuestas

### Triggers

- `trigger_like` → notifica al autor de la publicación cuando alguien da like
- `trigger_comentario` → notifica al autor cuando alguien comenta
- `trigger_respuesta` → notifica al autor cuando alguien responde un comentario
- `trigger_like_comentario` → notifica al autor del comentario cuando le dan like

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

**Santiago Quintero** — [@s4nti4gocoder](https://github.com/s4nti4gocoder)
