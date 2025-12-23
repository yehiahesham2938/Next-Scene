# 📁 Deployment Directory

This directory contains all deployment-related configuration files and documentation for the Movie Explorer application.

---

## 📄 **Files**

### **Docker & Container Configuration**
- **`Dockerfile.backend`** - Backend Docker container configuration
- **`Dockerfile.frontend`** - Frontend Docker container configuration
- **`docker-compose.yml`** - Local development with Docker Compose
- **`nginx.conf`** - Nginx configuration for frontend container
- **`fly.toml`** - Fly.io deployment configuration

### **Documentation**
- **`DEPLOYMENT_STATUS.md`** - Current deployment status and quick reference
- **`REDEPLOYMENT_GUIDE.md`** - How to redeploy after code changes ⭐
- **`FULL_DEPLOYMENT_GUIDE.md`** - Complete initial deployment guide (coming soon)

---

## 🚀 **Quick Start**

### **Already Deployed? Need to Update?**
👉 See [REDEPLOYMENT_GUIDE.md](./REDEPLOYMENT_GUIDE.md)

### **First Time Deployment?**
👉 See [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) for overview

---

## 🏗️ **Current Architecture**

```
┌─────────────────┐
│   Users/Web     │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Vercel  │ ← Frontend (React + Vite)
    │   CDN    │
    └────┬─────┘
         │
    ┌────▼─────────┐
    │   Fly.io     │ ← Backend (Docker + Express)
    │  Container   │
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │  MongoDB     │ ← Database
    │   Atlas      │
    └──────────────┘
```

---

## 🔄 **Common Tasks**

### **Redeploy Backend After Changes**
```bash
cd backend
fly deploy
```

### **Redeploy Frontend After Changes**
```bash
git push
# Vercel auto-deploys!
```

### **Run Locally with Docker**
```bash
cd deployment
docker-compose up
```

### **View Backend Logs**
```bash
fly logs
```

### **Check Backend Health**
```bash
curl https://next-scene-backend.fly.dev/health
```

---

## 📋 **File Usage**

### **`Dockerfile.backend`**
Used by:
- Fly.io (production deployment)
- Can be used for local Docker testing

### **`Dockerfile.frontend`**
Used by:
- Local Docker Compose setup
- Optional: Can deploy to container platforms

### **`docker-compose.yml`**
Used for:
- Local development with Docker
- Testing full-stack locally

### **`fly.toml`**
Used by:
- Fly.io CLI for backend deployment
- Defines app configuration, resources, health checks

### **`nginx.conf`**
Used by:
- Frontend Docker container
- Configures routing, caching, compression

---

## 🎯 **Deployment Flow**

### **Production**
1. **Backend**: Code → Git → `fly deploy` → Fly.io
2. **Frontend**: Code → Git → `git push` → Vercel (auto)

### **Local Development**
1. **Option A**: Use npm dev servers (recommended)
   ```bash
   cd backend && npm run dev
   cd frontend/react && npm run dev
   ```

2. **Option B**: Use Docker Compose
   ```bash
   cd deployment && docker-compose up
   ```

---

## 🔐 **Environment Variables**

### **Backend (Fly.io Secrets)**
```bash
fly secrets set MONGO_URI="your-mongodb-uri"
fly secrets set NODE_ENV="production"
```

### **Frontend (Vercel)**
Set in Vercel dashboard:
- `VITE_API_URL=https://next-scene-backend.fly.dev`

---

## 📚 **Documentation Index**

- **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)** - Overview, quick commands, status
- **[REDEPLOYMENT_GUIDE.md](./REDEPLOYMENT_GUIDE.md)** - Update & redeploy workflows
- **Root [README.md](../README.md)** - Project overview and setup

---

## ✅ **Health Checks**

- **Backend**: https://next-scene-backend.fly.dev/health
- **Frontend**: https://your-app.vercel.app
- **Status**: `fly status`

---

## 💡 **Tips**

1. **Always test locally before deploying**
2. **Use `fly logs` to debug backend issues**
3. **Check Vercel dashboard for frontend build errors**
4. **Keep this deployment directory organized**
5. **Don't commit secrets to git** (use Fly secrets and Vercel env vars)

---

**Need Help?**
- Backend deployment: See `fly --help`
- Frontend deployment: Check Vercel dashboard
- Redeployment: Read [REDEPLOYMENT_GUIDE.md](./REDEPLOYMENT_GUIDE.md)
