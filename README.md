<div align="center">

# Controlia

**Sistema de gestión para comercios: stock, ventas, caja diaria y más, en un solo lugar.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[**Ver demo**](https://controlia-software.vercel.app) · [Repositorio del backend](https://github.com/Jonnhyortega/CONTROLIA_BACKEND)

</div>

> [!NOTE]
> El backend está en un servidor gratuito (Render), que se apaga cuando no recibe tráfico. La primera petición puede tardar entre 30 y 60 segundos mientras el servidor arranca (*cold start*). Después responde con normalidad.

---

## Sobre el proyecto

Controlia es un SaaS pensado para pequeños y medianos comercios que hoy llevan su negocio en planillas o cuadernos. Reúne en una sola aplicación web el control de stock, el registro de ventas, la caja del día, los clientes y los proveedores, con reportes para ver cómo va el negocio.

## Funcionalidades

- **Productos y stock**: alta, edición y baja de productos, historial de cambios por producto y lectura de códigos de barras con la cámara.
- **Ventas**: registro de ventas con paginación, comprobante imprimible y opción de revertir una venta.
- **Caja diaria**: apertura y cierre de caja con el resumen de los movimientos del día.
- **Movimientos**: ingresos y egresos con filtros.
- **Clientes y proveedores**: gestión completa de ambos.
- **Reportes**: gráficos de ventas y métricas del negocio.
- **Empleados y roles**: el administrador crea cuentas de empleado, puede activarlas, desactivarlas o cambiarles la contraseña.
- **Autenticación**: registro con verificación por email, recuperación de contraseña y login con Google.
- **Suscripciones**: planes Basic, Gestión y Avanzado con pago recurrente por Mercado Pago, y funciones habilitadas según el plan.
- **Personalización**: configuración del negocio y de la apariencia de la aplicación.

## Tecnologías

| Capa | Herramientas |
| --- | --- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Radix UI, Zod, Axios, ZXing (lector de códigos) |
| **Backend** | Node.js, Express 5, MongoDB + Mongoose, JWT, bcrypt, Zod |
| **Servicios** | Mercado Pago (suscripciones), Google Identity (login), Cloudinary (imágenes), Nodemailer (emails) |
| **Seguridad** | Helmet, CORS, rate limiting, contraseñas hasheadas, rutas protegidas por middleware |
| **Deploy** | Vercel (frontend), Render (backend) |

## Arquitectura

```
┌──────────────────────┐      REST API (JSON + JWT)     ┌──────────────────────┐
│  Frontend (Vercel)   │  ───────────────────────────▶  │   Backend (Render)   │
│  Next.js + React     │                                │   Express + Mongoose │
└──────────────────────┘                                └──────────┬───────────┘
                                                                   │
                                   ┌───────────────┬───────────────┼──────────────┐
                                   ▼               ▼               ▼              ▼
                               MongoDB       Mercado Pago     Cloudinary     Email (SMTP)
```

## Estructura del repositorio

```
controlia/
├── frontend/              # Aplicación Next.js
│   ├── src/app/           # Rutas: landing, login, dashboard, pricing, checkout...
│   │   └── dashboard/     # Productos, ventas, clientes, suscripción, ajustes
│   └── src/utils/api.ts   # Cliente HTTP hacia el backend
└── CONTROLIA_BACKEND/     # API REST (repositorio aparte)
    └── backend/src/
        ├── routes/        # users, products, sales, clients, suppliers, daily-cash...
        ├── controllers/
        ├── models/
        └── middleware/    # Autenticación, manejo de errores
```

## Cómo correrlo en local

**Requisitos:** Node.js 18 o superior y una base de MongoDB (local o Atlas).

### 1. Backend

```bash
git clone https://github.com/Jonnhyortega/CONTROLIA_BACKEND.git
cd CONTROLIA_BACKEND/backend
npm install
```

Crear un archivo `.env` con estas variables:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
MERCADOPAGO_ACCESS_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

```bash
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
```

Crear un archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

```bash
npm run dev
```

La aplicación queda en `http://localhost:3000`.

## Autor

**Jonathan Ortega** · [GitHub](https://github.com/Jonnhyortega)
