# Rehab Tracker ⚕️ (Apple Design System)

Rehab Tracker es una plataforma web minimalista y moderna diseñada para el seguimiento de la rehabilitación física, con una estética inspirada profundamente en el lenguaje de diseño de Apple e iOS.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)

## ✨ Características

- **Diseño Apple-Style**: Interfaz limpia, tipografía SF-style, efectos de vidrio (frosted glass), y navegación fluida tipo iOS.
- **Gestión de Lesiones**: Agrupa tus sesiones por lesión (hombro, rodilla, etc.) con colores distintivos.
- **Seguimiento de Dolor**: Registro diario de intensidad del dolor (1-10) con sliders intuitivos.
- **Gráficas de Evolución**: Visualización clara del progreso mediante gráficas de área suaves con gradientes.
- **Historial Detallado**: Registro de ejercicios realizados y notas adicionales por cada sesión.
- **Consistencia Total**: Misma experiencia premium en escritorio y móvil, con soporte automático para Dark Mode.
- **Autenticación Segura**: Login mediante Magic Link (OTP) a través de Supabase Auth.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS.
- **Backend/Base de Datos**: Supabase (PostgreSQL).
- **Gráficas**: Recharts.
- **Iconos**: Lucide React.
- **Notificaciones**: React Hot Toast.

## 🚀 Instalación Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/ronymateo2/rehab_tracker.git
    cd rehab-tracker
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz con tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    ```

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

## 📊 Base de Datos (Supabase)

El esquema de la base de datos está disponible en `supabase_schema.sql`. Incluye:
- Tabla `lesions` para las categorías de lesiones.
- Tabla `sessions` para los registros de dolor y ejercicios.
- Políticas de seguridad (RLS) para que cada usuario solo acceda a su propia información.

## 📱 Mobile Friendly

La aplicación está optimizada para ser instalada como una **PWA** (Progressive Web App) en iOS y Android, ocultando controles del navegador para una experiencia 100% nativa.
