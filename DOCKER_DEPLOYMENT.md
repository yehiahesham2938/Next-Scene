# � Complete Deployment Guide - Fly.io Backend + Vercel Frontend

Simple, step-by-step guide to deploy your Movie Explorer app.

**Architecture:**
- **Backend**: Docker on Fly.io (already deployed ✅)
- **Frontend**: Vercel (React + Vite)
- **Time**: 5 minutes
- **Cost**: $0

---

## ✅ **Prerequisites**

Your backend should already be deployed on Fly.io at:
```
https://next-scene-backend.fly.dev
```

If not, follow Part 1 of the Docker deployment guide first.

---

## 🎨 **Deploy Frontend on Vercel**

### **Step 1: Verify Environment Configuration**

Your frontend is already configured to use:
- **Production**: `https://next-scene-backend.fly.dev` (from `.env`)
- **Development**: `http://localhost:4000` (fallback in code)

The API URL handling in `frontend/react/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
```

This means:
- ✅ Production uses Fly.io backend
- ✅ Local development uses localhost:4000
- ✅ No code changes needed!

---

### **Step 2: Commit and Push Changes**

```bash
# From project root
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

### **Step 3: Login to Vercel**

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

---

### **Step 4: Import Your Project**

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find **"Movie-Explorer"** repository
3. Click **"Import"**

---

### **Step 5: Configure Project**

**Framework Preset:**
- Should auto-detect **"Vite"** ✅

**Root Directory:**
- Click **"Edit"** 
- Select **"frontend/react"**
- Click **"Continue"**

**Build Settings** (auto-filled):
- Build Command: `npm run build` ✅
- Output Directory: `dist` ✅
- Install Command: `npm install` ✅

---

### **Step 6: Add Environment Variable**

Click **"Environment Variables"** and add:

**Name**: `VITE_API_URL`  
**Value**: `https://next-scene-backend.fly.dev`

Click **"Add"**

---

### **Step 7: Deploy!**

1. Click the **"Deploy"** button
2. Wait 2-3 minutes
3. Watch the build process (optional)

🎉 **Deployment Complete!**

---

### **Step 8: Get Your Live URL**

Vercel will show your live URL:
```
https://movie-explorer-abc123.vercel.app
```

Click **"Visit"** to open your app!

---

### **Step 9: Test Your App**

1. **Visit your Vercel URL**
2. **Try these:**
   - Browse movies
   - Sign up/Login
   - Add to watchlist
   - Search movies

3. **Check Console** (F12):
   - Should see API calls to `next-scene-backend.fly.dev`
   - No errors ✅

---

## 🔄 **Local Development**

Your setup automatically handles local vs production:

```bash
# Terminal 1: Run backend locally
cd backend
npm run dev
# Backend runs on http://localhost:4000

# Terminal 2: Run frontend locally  
cd frontend/react
npm run dev
# Frontend runs on http://localhost:5173
```

The frontend will automatically use `localhost:4000` when `.env` is not loaded or in development mode.

---

## 🔧 **Update Your Deployed App**

### **Update Frontend:**

```bash
# Make changes, then:
git add .
git commit -m "Update frontend"
git push

# Vercel auto-deploys! ✨
```

### **Update Backend:**

```bash
cd backend
# Make changes, then:
fly deploy
```

---

## ✅ **Verification**

- [ ] Backend: `https://next-scene-backend.fly.dev/health` returns `{"status":"ok"}`
- [ ] Frontend: `https://your-app.vercel.app` loads
- [ ] Movies load from backend
- [ ] Sign up/login works
- [ ] Watchlist features work
- [ ] No console errors

---

## 🐛 **Troubleshooting**

### **Movies don't load**

**Check:**
1. Backend is running: `https://next-scene-backend.fly.dev/health`
2. Environment variable in Vercel is correct
3. Browser console for errors

**Fix:**
```bash
# Redeploy with correct env var
# Vercel → Settings → Environment Variables
# Update VITE_API_URL → Redeploy
```

### **CORS errors**

Update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'
  ]
}));
```

Then redeploy backend:
```bash
cd backend
fly deploy
```

---

## 📱 **Custom Domain (Optional)**

### **Add to Vercel:**
1. Project → Settings → Domains
2. Add your domain
3. Configure DNS
4. SSL auto-provisioned ✅

---

## 💰 **Costs**

- **Fly.io**: Free tier ✅
- **Vercel**: Free tier ✅  
- **MongoDB Atlas**: Free tier ✅

**Total: $0/month** 🎉

---

## 🎯 **Your Live App**

**Frontend**: https://your-app.vercel.app  
**Backend**: https://next-scene-backend.fly.dev  
**Health**: https://next-scene-backend.fly.dev/health

Share and enjoy! 🍿✨

---

## 🎯 **Part 1: Deploy Backend on Fly.io with Docker**

### **Step 1: Install Fly CLI**

**Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

After installation, close and reopen your terminal.

---

### **Step 2: Login to Fly.io**

```bash
fly auth login
```

This will open your browser. Sign in with GitHub or email. You'll see "successfully logged in" in your terminal.

---

### **Step 3: Navigate to Backend Directory**

```bash
# From your project root
cd backend
```

Make sure you're in `Movie-Explorer/backend` directory where `Dockerfile` exists.

---

### **Step 4: Launch Your App on Fly.io**

```bash
fly launch
```

You'll be asked several questions:

**Q: Choose an app name (optional):**
```
→ Press Enter (auto-generate) OR type: movie-explorer-backend
```

**Q: Choose a region for deployment:**
```
→ Choose closest to you (e.g., "iad" for US East, "lhr" for London)
```

**Q: Would you like to set up a PostgreSQL database?**
```
→ Type: N (No - we're using MongoDB)
```

**Q: Would you like to set up an Upstash Redis database?**
```
→ Type: N (No)
```

**Q: Would you like to deploy now?**
```
→ Type: N (No - we need to add environment variables first)
```

✅ Your app is now created but not deployed yet!

---

### **Step 5: Set Environment Variables (Secrets)**

```bash
fly secrets set MONGO_URI="mongodb+srv://yehiahesham:XufK5QFWV1PikUsm@next-scene.i8icl8s.mongodb.net/Next-Scene?appName=Next-Scene&retryWrites=true&w=majority"

fly secrets set NODE_ENV="production"
```

You'll see "Release created" for each secret. This is normal.

---

### **Step 6: Deploy Your Backend**

```bash
fly deploy
```

This will:
1. Build your Docker image (2-3 minutes)
2. Push to Fly.io registry
3. Deploy the container
4. Run health checks

Wait for: ✅ "Monitoring Deployment" → "Successful"

---

### **Step 7: Get Your Backend URL**

```bash
fly info
```

Look for **Hostname**. It will be something like:
```
Hostname = movie-explorer-backend.fly.dev
```

Or you can directly visit:
```
https://your-app-name.fly.dev
```

---

### **Step 8: Verify Backend is Working**

**Test the health endpoint:**

**Option A: Using browser**
- Visit: `https://your-app-name.fly.dev/health`
- You should see: `{"status":"ok"}`

**Option B: Using curl**
```bash
curl https://your-app-name.fly.dev/health
```

**Option C: Using Fly.io**
```bash
fly status
```

✅ If you see your app is **running** and health check returns `{"status":"ok"}`, your backend is live!

---

### **Step 9: Save Your Backend URL**

Copy your backend URL (e.g., `https://movie-explorer-backend.fly.dev`). You'll need it for the frontend!

```
Your Backend URL: https://_____________________.fly.dev
```

---

## 🎨 **Part 2: Deploy Frontend on Vercel**

### **Step 1: Update Frontend API URL**

1. **Open** `frontend/react/.env` file

2. **Update** with your Fly.io backend URL:
```env
VITE_API_URL=https://your-app-name.fly.dev
```

Replace `your-app-name.fly.dev` with your actual backend URL from Part 1.

3. **Save the file**

---

### **Step 2: Commit and Push Changes**

```bash
# Navigate to project root
cd ..

# Add changes
git add .

# Commit
git commit -m "Update API URL for production deployment"

# Push to GitHub
git push origin main
```

---

### **Step 3: Login to Vercel**

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

### **Step 4: Import Your Project**

1. On Vercel dashboard, click **"Add New..."** → **"Project"**

2. You'll see a list of your GitHub repositories

3. Find **"Movie-Explorer"** and click **"Import"**

---

### **Step 5: Configure Project Settings**

**Framework Preset:**
- Vercel should auto-detect "Vite"
- If not, select **"Vite"** from dropdown

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Select **"frontend/react"**
- Click **"Continue"**

**Build Settings** (Usually auto-filled):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Leave these as default ✅

---

### **Step 6: Add Environment Variables**

1. Click **"Environment Variables"** section to expand

2. Add your backend URL:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app-name.fly.dev`
   
   (Use your actual Fly.io backend URL)

3. Click **"Add"**

---

### **Step 7: Deploy!**

1. Click the big **"Deploy"** button

2. Wait 2-4 minutes while Vercel:
   - Clones your repository
   - Installs dependencies
   - Builds your React app
   - Deploys to their CDN

3. Watch the build logs (optional but cool to see!)

---

### **Step 8: Get Your Live URL**

Once deployment completes, you'll see:

🎉 **Congratulations!** 

Vercel will show your live URL:
```
https://movie-explorer-abc123.vercel.app
```

Click **"Visit"** to open your live app!

---

### **Step 9: Test Your Live App**

1. **Visit your Vercel URL**
2. **Try these features**:
   - Browse movies (should load from your backend)
   - Sign up for an account
   - Add a movie to watchlist
   - Search for movies

3. **Open Browser Console** (F12):
   - Check for any errors
   - API calls should go to your Fly.io backend

✅ If everything works, you're done!

---

## 🔧 **Part 3: Configure Automatic Deployments**

Every time you push to GitHub, Vercel will automatically rebuild and redeploy your frontend!

To enable automatic backend deployments:

```bash
# In your backend directory
fly deploy --auto-confirm
```

Or set up GitHub Actions to deploy on push (optional).

---

## 📊 **Your Deployment Architecture**

```
┌─────────────────────────────┐
│         Internet            │
│      (Your Users)           │
└──────────┬──────────────────┘
           │
    ┌──────▼──────────────┐
    │   Vercel CDN        │
    │   (Frontend)        │
    │ React + Vite        │
    └──────┬──────────────┘
           │ API Calls
    ┌──────▼──────────────┐
    │   Fly.io            │
    │   (Backend)         │
    │ Docker + Express    │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  MongoDB Atlas      │
    │   (Database)        │
    └─────────────────────┘
```

---

## ✅ **Verification Checklist**

After completing both deployments, verify everything works:

### **Backend Checks:**
- [ ] Health endpoint works: `https://your-app.fly.dev/health` returns `{"status":"ok"}`
- [ ] Fly.io dashboard shows app as **running**
- [ ] No errors in logs: `fly logs`

### **Frontend Checks:**
- [ ] Vercel deployment shows "Ready" status
- [ ] Can access homepage: `https://your-app.vercel.app`
- [ ] No console errors (F12 → Console)
- [ ] Movies load from backend
- [ ] Can sign up/login
- [ ] Can add movies to watchlist

### **Integration Checks:**
- [ ] API calls reach backend (check Network tab in F12)
- [ ] Database operations work (sign up, add to watchlist)
- [ ] No CORS errors in console

---

## 🐛 **Troubleshooting**

### **Issue: Backend Health Check Fails**

**Symptoms:** `fly deploy` times out, app not reachable

**Solutions:**
```bash
# Check logs
fly logs

# Common fixes:
# 1. Check if server is listening on 0.0.0.0
# 2. Verify PORT environment variable
# 3. Check MongoDB connection

# Restart the app
fly apps restart your-app-name
```

---

### **Issue: Frontend Can't Connect to Backend**

**Symptoms:** Movies don't load, "Failed to fetch" errors

**Solutions:**

1. **Check API URL in Vercel:**
   - Go to Vercel project → Settings → Environment Variables
   - Verify `VITE_API_URL` matches your Fly.io URL
   - Redeploy if you changed it

2. **Check CORS settings** in `backend/src/server.js`:
   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-app.vercel.app'
     ]
   }));
   ```

3. **Verify backend is accessible:**
   ```bash
   curl https://your-app.fly.dev/health
   ```

---

### **Issue: MongoDB Connection Error**

**Symptoms:** Backend logs show "MongooseServerSelectionError"

**Solutions:**

1. **Check MongoDB Atlas Network Access:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Database Access → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)

2. **Verify MONGO_URI secret:**
   ```bash
   fly secrets list
   ```

3. **Update secret if needed:**
   ```bash
   fly secrets set MONGO_URI="your-correct-uri"
   ```

---

### **Issue: Build Fails on Vercel**

**Symptoms:** Vercel shows "Build failed"

**Solutions:**

1. **Check build logs** in Vercel dashboard

2. **Common issues:**
   - Missing dependencies: Check `package.json`
   - ESLint errors: Review code or disable strict mode temporarily
   - Environment variables: Make sure `VITE_API_URL` is set

3. **Test build locally:**
   ```bash
   cd frontend/react
   npm rAppendix: un build
   ```

---

### **Issue: 404 on Frontend Routes**

**Symptoms:** Refresh on any page except home gives 404

**Solution:** Already configured in `vercel.json` ✅

If issue persists, add this to Vercel dashboard:
- Settings → Rewrites → Add: `/*` → `/index.html`

---

## 🔄 **Update Your Deployed App**

### **Update Backend:**

```bash
cd backend

# Make your changes, then:
git add .
git commit -m "Update backend"
git push

# Deploy to Fly.io
fly deploy
```

### **Update Frontend:**

```bash
# Make your changes, then:
git add .
git commit -m "Update frontend"
git push

# Vercel auto-deploys! ✨
# Check deployment at: https://vercel.com/your-project
```

---

## 📱 **Custom Domains (Optional)**

### **Add Custom Domain to Backend (Fly.io):**

```bash
fly certs create yourdomain.com
fly certs create www.yourdomain.com
```

Then add DNS records as instructed.

### **Add Custom Domain to Frontend (Vercel):**

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `movieexplorer.com`)
3. Follow DNS configuration instructions
4. SSL certificate auto-provisioned ✅

---

## 💰 **Pricing & Limits**

### **Fly.io Free Tier:**
- Up to 3 shared-cpu-1x 256mb VMs
- 160GB/month bandwidth
- Perfect for small projects ✅

### **Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL
- Perfect for frontend ✅

### **MongoDB Atlas Free Tier:**
- 512MB storage
- Shared cluster
- Already using this ✅

**Total Monthly Cost: $0** 🎉

---

## 🎯 **Quick Reference Commands**

### **Fly.io:**
```bash
fly logs                    # View logs
fly status                  # Check app status
fly apps list              # List your apps
fly deploy                 # Deploy updates
fly secrets list           # List secrets
fly secrets set KEY=value  # Add/update secret
fly apps restart app-name  # Restart app
fly apps destroy app-name  # Delete app
```

### **Vercel:**
```bash
# Or use the dashboard at vercel.com
# All deployments happen automatically on git push!
```

---

## 📚 **Additional Resources**

- **Fly.io Docs**: https://fly.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Docker Docs**: https://docs.docker.com

---

## 🎉 **You're Done!**

Your Movie Explorer app is now live and accessible worldwide!

**Your URLs:**
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-app.fly.dev
- **Health Check**: https://your-app.fly.dev/health

Share your live app and enjoy! 🍿✨

---

## 🧪 **Local Development with Docker**

### Option A: Backend Only (Docker)

```bash
# Build backend Docker image
cd backend
docker build -t movie-explorer-backend .

# Run backend container
docker run -p 4000:4000 \
  -e MONGO_URI="mongodb+srv://yehiahesham:XufK5QFWV1PikUsm@next-scene.i8icl8s.mongodb.net/Next-Scene" \
  -e NODE_ENV=development \
  -e PORT=4000 \
  movie-explorer-backend
```

Then run frontend normally:
```bash
cd frontend/react
npm run dev
```

### Option B: Full Stack with Docker Compose

```bash
# From project root
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

Access:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/health`

---

## 🔧 **Docker Commands Reference**

### Build Images
```bash
# Backend
docker build -t movie-explorer-backend ./backend

# Frontend
docker build -t movie-explorer-frontend ./frontend/react
```

### Run Containers
```bash
# Backend
docker run -d -p 4000:4000 \
  --name backend \
  -e MONGO_URI="your-mongo-uri" \
  movie-explorer-backend

# Frontend
docker run -d -p 80:80 \
  --name frontend \
  movie-explorer-frontend
```

### Manage Containers
```bash
# List running containers
docker ps

# Stop container
docker stop backend

# Remove container
docker rm backend

# View logs
docker logs backend -f

# Execute command in container
docker exec -it backend sh
```

### Push to Docker Hub (Optional)
```bash
# Login
docker login

# Tag images
docker tag movie-explorer-backend yourusername/movie-explorer-backend:latest

# Push
docker push yourusername/movie-explorer-backend:latest
```

---

## ✅ **Recommended Setup**

**For Production:**
- **Backend**: Fly.io with Docker (Free tier, fast, reliable)
- **Frontend**: Vercel (Free tier, excellent CDN)
- **Database**: MongoDB Atlas (Already configured)

**Total Cost**: $0/month
**Setup Time**: 15 minutes

---

## 🐛 **Troubleshooting**

### Issue: Docker build fails
```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t movie-explorer-backend ./backend
```

### Issue: Backend health check fails
```bash
# Check backend logs
docker logs backend

# Test health endpoint manually
curl http://localhost:4000/health
```

### Issue: MongoDB connection error
- Verify MongoDB Atlas allows connections from 0.0.0.0/0
- Check MONGO_URI environment variable is correct
- Test connection locally first

### Issue: CORS errors
Update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'
  ]
}));
```

---

## 📊 **Deployment Options Comparison**

| Platform | Docker Support | Free Tier | Cold Start | Speed | Setup Time |
|----------|----------------|-----------|------------|-------|------------|
| **Fly.io** | ✅ Native | ✅ Yes | ⚡ Fast | ⚡⚡⚡ | 10 min |
| **Railway** | ✅ Native | ⚠️ $5 credit | ⚡ Fast | ⚡⚡⚡ | 5 min |
| **Render** | ✅ Native | ✅ Yes | 🐌 Slow | ⚡⚡ | 10 min |
| **DigitalOcean** | ✅ Native | ❌ $5/mo | ⚡ Fast | ⚡⚡⚡ | 15 min |

---

## 🎯 **Quick Start (Fly.io + Vercel)**

```bash
# 1. Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 2. Deploy backend
cd backend
fly auth login
fly launch
fly secrets set MONGO_URI="your-uri" NODE_ENV="production" PORT="8080"
fly deploy

# 3. Get backend URL
fly info

# 4. Update frontend/.env
VITE_API_URL=https://your-app.fly.dev

# 5. Deploy frontend on Vercel
# (Use Vercel dashboard)
```

**Your app is now live!** 🎉

---

## 🎨 **Architecture**

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

Clean, professional, scalable! 🚀
