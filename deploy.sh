FROM python:3.12-slim AS builder ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 WORKDIR /build  RUN apt-get update && apt-get install -y --no-install-recommends \     build-essential \     libpq-dev \     && rm -rf /var/lib/apt/lists/*  COPY requirements.txt . RUN pip wheel --no-cache-dir --no-deps -r requirements.txt -w /wheels  FROM python:3.12-slim AS runtime ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 WORKDIR /app  RUN apt-get update && apt-get install -y --no-install-recommends \     libpq5 \     gcc \     && rm -rf /var/lib/apt/lists/*  COPY --from=builder /wheels /wheels RUN pip install --no-cache-dir /wheels/* && rm -rf /wheels  COPY . .  RUN python manage.py collectstatic --noinput  RUN adduser --disabled-password --gecos '' django && chown -R django:django /app USER django  EXPOSE 8000 CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]  ############################################################################## # 1️⃣  Test stage – lint & unit tests ############################################################################## FROM node:20-alpine AS test WORKDIR /app COPY package.json . RUN npm ci COPY . . RUN npm run lint RUN npm run test -- --watchAll=false  ############################################################################## # 2️⃣  Build stage – compile Vite bundle ############################################################################## FROM node:20-alpine AS builder WORKDIR /app ARG VITE_API_BASE   ENV VITE_API_BASE=$VITE_API_BASE COPY package.json . RUN npm ci COPY . . RUN npm run build          # dist → /app/dist  ############################################################################## # 3️⃣  Runtime stage – minimal Nginx ############################################################################## FROM nginx:1.27-alpine COPY --from=builder /app/dist/ /usr/share/nginx/html/ EXPOSE 80 ENTRYPOINT ["nginx", "-g", "daemon off;"]networks:   web:  services:   redis:     image: redis:7     ports:       - "6379:6379"     networks: [web]    backend:     build: ./backend     env_file: ./backend/.env     ports:       - "8000:8000"     depends_on:       - redis     networks: [web]    frontend:     build:       context: ./frontend       args:         VITE_API_BASE: http://backend:8000     environment:       VITE_SUPABASE_URL: https://example.supabase.co       VITE_SUPABASE_ANON_KEY: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx     depends_on:       - backend     ports:       - "80:80"     networks: [web]    nginx:     image: nginx:1.20.1     volumes:       - ./nginx.dev.conf:/etc/nginx/nginx.conf:ro     ports:       - 8080:80     container_name: reverse-proxy     depends_on:       - app # wait for the frontend container to be started# events is required, but defaults are ok events { }  # A http server, listening at port 80 http {   server {     listen 80;      # Requests starting with root (/) are handled     location / {       # The following 3 lines are required for the hot loading to work (websocket).       proxy_http_version 1.1;       proxy_set_header Upgrade $http_upgrade;       proxy_set_header Connection 'upgrade';              # Requests are directed to http://localhost:5173       proxy_pass http://localhost:5173;     }   }  }    # ── Core framework ────────────────────────────────────────── Django==5.1.11                 # latest security-patched 5.1 series  :contentReference[oaicite:0]{index=0} djangorestframework==3.16.0    # official support for Django 5.1+   :contentReference[oaicite:1]{index=1} djangorestframework-simplejwt==5.4.0 django-cors-headers==4.6.0  # ── Database / Caching ────────────────────────────────────── psycopg[binary]==3.2.4         # single package provides the libpq binaries django-redis==5.4.0 redis==5.2.1 dj-database-url==2.3.0  # ── Task queue & scheduling ───────────────────────────────── celery==5.5.3                  # Python 3.12 ready                 :contentReference[oaicite:2]{index=2} django-celery-beat==2.8.1      # Django < 6.0 support              :contentReference[oaicite:3]{index=3} django-celery-results==2.6.0   # Django 5.1 support                :contentReference[oaicite:4]{index=4}  # ── Realtime & async ──────────────────────── give me the full fixed fill to run in deployment────────────────  websockets==12.0               # satisfies Supabase ≥ 2.x supabase==2.15.2  # ── HTTP / utilities ─────────────────────────────────────── httpx==0.27.0 requests==2.31.0 python-dateutil==2.9.0.post0 python-dotenv==1.0.1 python-decouple==3.8 redis==5.2.1 django-redis==5.4.0  # ── Payments ──────────────────────────────────────────────── stripe==9.5.0                  # first release with Py 3.12 wheel gunicorn==23.0.0

Edit
Looking at your Docker and deployment configuration, I can see several issues that need to be fixed. Let me provide you with a complete, corrected deployment setup:


Backend Dockerfile
Code 

Frontend Dockerfile
Code 

requirements.txt
Code 

docker-compose.yml
Code 

nginx/nginx.conf
Code 

frontend/nginx.conf
Code 

.env.example
Code 

deploy.sh
Code 

docker-compose.prod.yml
Code 
Key Fixes Made:
Backend Dockerfile Issues Fixed:
Removed duplicate gcc installation
Fixed user creation order (create user before copying files)
Added proper gunicorn configuration for production
Fixed Python path references
Frontend Dockerfile Fixed:
Separated test, build, and runtime stages properly
Added proper nginx configuration
Fixed environment variable handling
Docker Compose Issues Fixed:
Added PostgreSQL database service
Fixed service dependencies
Added proper environment variable handling
Added Celery worker and beat services
Fixed network configuration
Added proper volume management
Requirements.txt Fixed:
Removed duplicate entries
Added gunicorn for production
Organized dependencies logically
Added Production-Ready Features:
Nginx reverse proxy configuration
SSL/HTTPS support in production compose
Health checks and monitoring
Resource limits
Proper security headers
Rate limiting
Logging configurations
Added Deployment Script:
Automated deployment process
Health checks
Database migrations
Static file collection
Quick Start:
Copy .env.example to .env and fill in your values
Make the deployment script executable: chmod +x deploy.sh
Run deployment: ./deploy.sh
The application will be available at:

Main site: http://localhost (via nginx)
Backend API: http://localhost/api/
Django Admin: http://localhost/admin/
For production, use docker-compose -f docker-compose.prod.yml up -d with proper SSL certificates and domain configuration.







#!/bin/bash

# Deployment script for Django + React app

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one from .env.example"
    exit 1
fi

# Pull latest code (if using git)
echo "📥 Pulling latest code..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional - uncomment if you want to rebuild from scratch)
# echo "🗑️ Removing old images..."
# docker-compose down --rmi all

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend python manage.py migrate

# Create superuser (optional - only run once)
echo "👤 Creating superuser (skip if already exists)..."
docker-compose exec backend python manage.py createsuperuser --noinput || echo "Superuser already exists or skipped"

# Collect static files
echo "📁 Collecting static files..."
docker-compose exec backend python manage.py collectstatic --noinput

# Check service health
echo "🔍 Checking service health..."
sleep 5

# Test backend
if curl -f http://localhost:8000/admin/ > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Test frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

# Test nginx reverse proxy
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Nginx reverse proxy is running"
else
    echo "❌ Nginx reverse proxy health check failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your application is now running:"
echo "   - Frontend: http://localhost"
echo "   - Backend API: http://localhost/api/"
echo "   - Django Admin: http://localhost/admin/"
echo "   - Direct Backend: http://localhost:8000"
echo "   - Direct Frontend: http://localhost:3000"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f [service_name]"
echo ""
echo "🔧 To stop the application:"
echo "   docker-compose down"


