# Plataforma Administrativa de Catálogo de Productos

Plataforma full-stack con React, TypeScript y Bootstrap en el frontend, y Django, DRF y PostgreSQL en el backend.

## Requisitos Previos
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (v14+)

## Configuración del Backend (Django)
1. Navega a la carpeta del backend: `cd backend`
2. Crea el entorno virtual: `python -m venv venv` y actívalo.
3. Instala las dependencias: `pip install -r requirements.txt`
4. Crea un archivo `.env` basado en `.env.example` y configura tus credenciales de PostgreSQL.
5. Ejecuta las migraciones: `python manage.py migrate`
6. Crea un superusuario: `python manage.py createsuperuser`
7. Inicia el servidor: `python manage.py runserver`

## Configuración del Frontend (React)
1. Navega a la carpeta del frontend: `cd frontend`
2. Instala los módulos: `npm install`
3. Crea un archivo `.env` e incluye: `VITE_API_URL=http://localhost:8000/api/`
4. Inicia el servidor de desarrollo: `npm run dev`

## Deploy
- **Backend:** Configurar un entorno en Render o Railway usando Gunicorn y un archivo `Procfile`. Asegurar que las variables de entorno de producción estén establecidas.
- **Frontend:** Ejecutar `npm run build`. Subir la carpeta `dist/` a Vercel, Netlify o AWS S3.