# 🎬 Movie Explorer - Deployment Summary

## 🏗️ **Current Architecture**

```
Frontend (Vercel)     →     Backend (Fly.io)     →     Database (MongoDB Atlas)
React + Vite                Docker + Express            Already configured
```

---

## 📦 **Deployed Services**

### **Backend (Fly.io with Docker)**
- **URL**: https://next-scene-backend.fly.dev
- **Health Check**: https://next-scene-backend.fly.dev/health
- **Technology**: Node.js + Express in Docker container
- **Deployment**: `fly deploy` from `backend/` directory

### **Frontend (Vercel)**
- **URL**: https://your-app.vercel.app
- **Technology**: React + Vite + Tailwind CSS
- **Deployment**: Automatic on `git push` to main branch
- **Environment**: Production uses Fly.io backend, local uses localhost:4000

### **Database (MongoDB Atlas)**
- **Provider**: MongoDB Atlas (Free Tier)
- **Connection**: Already configured in backend
- **Access**: Backend only (no direct frontend access)

---

## 🚀 **Quick Deploy Guide**

### **Frontend Only** (Most Common)
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys!
```

### **Backend Only**
```bash
cd backend
fly deploy
```

### **Both**
```bash
# Update code, then:
git add .
git commit -m "Update app"
git push

cd backend
fly deploy
```

---

## 🧪 **Local Development**

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:4000

# Terminal 2: Frontend
cd frontend/react
npm install
npm run dev
# Runs on http://localhost:5173
```

Frontend automatically uses:
- **Local**: `http://localhost:4000`
- **Production**: `https://next-scene-backend.fly.dev`

---

## 📁 **Deployment Configuration Files**

All deployment files are now organized in the `deployment/` directory:

### **Active Files:**
- ✅ `deployment/fly.toml` - Fly.io configuration
- ✅ `deployment/Dockerfile.backend` - Backend containerization
- ✅ `deployment/Dockerfile.frontend` - Frontend containerization
- ✅ `deployment/docker-compose.yml` - Local development
- ✅ `deployment/nginx.conf` - Nginx configuration for frontend
- ✅ `frontend/react/.env` - Environment variables

### **Documentation:**
- 📖 `deployment/FULL_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- 📖 `deployment/REDEPLOYMENT_GUIDE.md` - How to redeploy after updates
- 📖 `README.md` - Project documentation

---

## 🔧 **Environment Variables**

### **Backend (Fly.io Secrets)**
```bash
fly secrets list
# MONGO_URI - MongoDB connection string
# NODE_ENV - Set to "production"
```

### **Frontend (Vercel)**
```env
VITE_API_URL=https://next-scene-backend.fly.dev
```

### **Local Development**
```env
# frontend/react/.env
VITE_API_URL=https://next-scene-backend.fly.dev
# Code falls back to http://localhost:4000 in dev mode
```

---

## 🎯 **Useful Commands**

### **Fly.io (Backend)**
```bash
fly logs                 # View logs
fly status              # Check status
fly deploy              # Deploy updates
fly secrets set KEY=val # Update secrets
fly info                # Get app info
```

### **Vercel (Frontend)**
```bash
# All automatic via git push!
# Or use Vercel dashboard
```

### **Docker (Local)**
```bash
cd deployment
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
```

---

## ✅ **Health Checks**

- Backend: https://next-scene-backend.fly.dev/health
- Frontend: https://your-app.vercel.app
- Database: Check via backend API calls

---

## 💰 **Costs**

All free tier services:
- ✅ Fly.io: Free
- ✅ Vercel: Free
- ✅ MongoDB Atlas: Free

**Total: $0/month** 🎉

---

## 📚 **Full Documentation**

- **Initial Setup**: See `deployment/FULL_DEPLOYMENT_GUIDE.md`
- **Redeployment**: See `deployment/REDEPLOYMENT_GUIDE.md`

---

**Last Updated**: December 23, 2025  
**Backend**: Fly.io (Docker)  
**Frontend**: Vercel  
**Database**: MongoDB Atlas
