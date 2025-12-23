# 🚀 Backend Deployment to Fly.io

## ✅ Current Setup

**Your configuration:**
- 📁 `backend/fly.toml` - Main Fly.io configuration (✅ ACTIVE)
- 📁 `deployment/Dockerfile.backend` - Docker build file
- 🌐 App name: `next-scene-backend`
- 🔗 URL: https://next-scene-backend.fly.dev

---

## 🔄 How to Deploy Backend After Code Changes

### **Step 1: Navigate to Backend Directory**

```bash
cd backend
```

**Important:** Always run `fly deploy` from the `backend/` directory!

### **Step 2: Deploy**

```bash
fly deploy
```

That's it! Fly.io will:
1. Read `backend/fly.toml` configuration
2. Build using `../deployment/Dockerfile.backend`
3. Deploy to `next-scene-backend.fly.dev`

---

## 📊 What Happens During Deployment

```
backend/
├── fly.toml                    ← Fly reads this config
│   └── dockerfile = '../deployment/Dockerfile.backend'
│
deployment/
└── Dockerfile.backend          ← Fly builds from this
    ├── Copies backend/ code
    ├── Installs dependencies
    ├── Exposes port 8080
    └── Starts server
```

**Build Process:**
1. ✅ Fly.io reads `backend/fly.toml`
2. ✅ Uses Dockerfile at `../deployment/Dockerfile.backend`
3. ✅ Copies all files from `backend/` directory into container
4. ✅ Runs `npm ci --only=production`
5. ✅ Starts server with `node src/server.js`
6. ✅ Server listens on port 8080 (from PORT env var)

---

## 🎯 Full Deployment Example

```bash
# 1. Make your backend code changes in backend/src/...

# 2. Test locally (optional)
cd backend
npm run dev
# Test at http://localhost:4000

# 3. Commit to git (recommended)
git add .
git commit -m "Update backend: add new feature"
git push

# 4. Deploy to Fly.io
cd backend
fly deploy

# 5. Monitor deployment
# Wait for: ✅ Monitoring Deployment → Successful

# 6. Check health
curl https://next-scene-backend.fly.dev/health
# Should return: {"status":"ok"}
```

---

## 🔍 Verify Deployment

```bash
# Check app status
fly status

# View logs
fly logs

# View recent deployments
fly releases

# Test health endpoint
curl https://next-scene-backend.fly.dev/health
```

---

## ⚙️ Configuration Details

### **Port Configuration:**
- **Local dev:** `PORT=4000` (from server.js default)
- **Fly.io:** `PORT=8080` (from fly.toml)
- **Your server.js:** `const port = process.env.PORT || 4000` ✅

### **Environment Variables (Secrets):**
```bash
# View secrets
fly secrets list

# Update secrets
fly secrets set MONGO_URI="your-connection-string"
fly secrets set NODE_ENV="production"
```

### **Health Checks:**
- Path: `/health`
- Interval: Every 30 seconds
- Timeout: 5 seconds
- Configured in: `backend/fly.toml`

---

## 🐛 Troubleshooting

### **Issue: "Could not find Dockerfile"**

**Solution:**
```bash
# Make sure you're in the backend directory
cd backend
pwd  # Should show: .../Movie-Explorer/backend

# Check fly.toml has correct path
cat fly.toml | grep dockerfile
# Should show: dockerfile = '../deployment/Dockerfile.backend'

# Deploy
fly deploy
```

### **Issue: Build Fails**

**Check logs:**
```bash
fly logs
```

**Test Docker build locally:**
```bash
cd backend
docker build -f ../deployment/Dockerfile.backend -t test-backend .
```

### **Issue: Deployment Times Out**

**Try remote build:**
```bash
fly deploy --remote-only
```

### **Issue: Health Checks Failing**

**Check:**
1. Server is listening on `0.0.0.0` (not just `localhost`)
2. PORT env var is set to 8080
3. `/health` endpoint exists and responds

**View logs:**
```bash
fly logs
```

---

## 🔄 Rollback If Needed

```bash
# View releases
fly releases

# Rollback to previous version
fly releases rollback
```

---

## 📋 Quick Command Reference

```bash
fly deploy              # Deploy current code
fly logs                # View application logs
fly logs -f             # Follow logs in real-time
fly status              # Check app status
fly releases            # View deployment history
fly releases rollback   # Rollback to previous version
fly secrets list        # View secrets
fly secrets set X=Y     # Update secret
fly apps restart        # Restart app
fly info                # View app info
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code changes tested locally
- [ ] No syntax errors
- [ ] Dependencies updated in package.json if needed
- [ ] Git committed (recommended)

After deploying:
- [ ] Wait for "Successful" message
- [ ] Check health: `curl https://next-scene-backend.fly.dev/health`
- [ ] View logs: `fly logs`
- [ ] Test API endpoints
- [ ] Check frontend can connect

---

## 🎉 You're Ready!

**To deploy backend after code changes:**

```bash
cd backend
fly deploy
```

**Monitor at:**
- Health: https://next-scene-backend.fly.dev/health
- Dashboard: https://fly.io/dashboard
- Logs: `fly logs`

---

**Questions? Check the [REDEPLOYMENT_GUIDE.md](./REDEPLOYMENT_GUIDE.md) for more scenarios!**
