# Next-Scene React App - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB database (already configured in backend)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend React:**
```bash
cd frontend/react
npm install
```

### Step 2: Environment Configuration

**Backend** (`backend/.env`):
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

**Frontend** (`frontend/react/.env`):
```env
VITE_API_URL=http://localhost:4000
```

### Step 3: Start Servers

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
You should see: `Backend server listening on http://localhost:4000`

**Terminal 2 - Start React App:**
```bash
cd frontend/react
npm run dev
```
Opens at: `http://localhost:5173`

## ✅ Verify Backend Connection

### Test Backend Health
```bash
curl http://localhost:4000/health
```
Should return: `{"status":"ok"}`

### Test Movies Endpoint
```bash
curl http://localhost:4000/api/movies
```
Should return JSON array of movies

### Browser Console
1. Open React app: `http://localhost:5173`
2. Open DevTools (F12)
3. Go to Network tab
4. Look for API calls to `localhost:4000`
5. Check if responses return data (not 404 or CORS errors)

## 🔧 Troubleshooting

### Issue: "Failed to fetch movies"

**Solution 1**: Check backend is running
```bash
cd backend
npm start
```

**Solution 2**: Verify .env file exists
```bash
# In frontend/react/.env
VITE_API_URL=http://localhost:4000
```

**Solution 3**: Restart Vite dev server (it needs restart after .env changes)
```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Issue: CORS Errors

Backend already has CORS enabled. If you still see errors, update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: No Movies Showing

**Check Database**:
1. Verify MongoDB is connected (check backend console for connection message)
2. Run seed script to populate database:
```bash
cd backend
node src/scripts/insertMovies.js
```

### Issue: Theme Toggle Not Working

Check that theme initialization script is in `index.html`:
```html
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(theme);
  })();
</script>
```

### Issue: User Authentication Not Persisting

AuthContext stores user in localStorage. Check browser console for:
```javascript
localStorage.getItem('user')
```

## 🎨 Design Verification

### Header Design Checklist
- ✅ Toggle switch (not dropdown) for theme with sun/moon icons
- ✅ User avatar is gray circle with user icon (not initials dropdown)
- ✅ Mobile header shows film icon, title, and avatar
- ✅ Theme toggle animates from left to right in dark mode

### Footer Design Checklist
- ✅ Desktop footer has SVG social icons (Twitter, Facebook, Instagram)
- ✅ Mobile nav at bottom with 5 icons
- ✅ Active state highlights current page

## 📡 API Endpoints Used

All endpoints defined in `src/services/api.js`:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

### Movies
- `GET /api/movies` - All movies (supports `?limit=n`)
- `GET /api/movies/:id` - Single movie
- `GET /api/movies/search?q=query` - Search
- `GET /api/movies/genre/:genre` - Filter by genre

### Watchlist
- `GET /api/watchlist/:userId` - User's watchlist
- `POST /api/watchlist/add` - Add movie
- `DELETE /api/watchlist/remove` - Remove movie
- `PATCH /api/watchlist/watched` - Mark watched

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - All users
- `POST /api/admin/movies` - Add movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie

## 🔍 Testing Backend Integration

### 1. Sign Up Test
1. Go to `http://localhost:5173/signup`
2. Fill form and submit
3. Open DevTools Network tab
4. Check POST request to `http://localhost:4000/api/auth/signup`
5. Should return status 200 with user data

### 2. Movie Loading Test
1. Go to `http://localhost:5173`
2. Scroll to "Latest Movies" section
3. Check Network tab for GET `http://localhost:4000/api/movies?limit=4`
4. Should see movie cards with posters

### 3. Watchlist Test
1. Sign in first
2. Go to a movie details page
3. Click "Add to Watchlist"
4. Check Network tab for POST `http://localhost:4000/api/watchlist/add`
5. Go to Watchlist page - movie should appear

## 📝 Common Commands

```bash
# Backend
cd backend
npm start              # Start server
npm run dev           # Start with nodemon
node src/scripts/insertMovies.js  # Seed database

# Frontend
cd frontend/react
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint

# Both (from project root)
# Terminal 1:
cd backend && npm start

# Terminal 2:
cd frontend/react && npm run dev
```

## 🎯 Next Steps

1. ✅ Both servers running
2. ✅ Backend connected to MongoDB
3. ✅ React app loads at localhost:5173
4. ✅ API calls successful (check Network tab)
5. ✅ Movies display on homepage
6. ✅ Sign in/Sign up works
7. ✅ Watchlist functionality works
8. ✅ Theme toggle works
9. ✅ Design matches original HTML

## 💡 Tips

- **Always start backend first** before React app
- **Restart Vite dev server** after changing .env file
- **Check browser console** for any errors
- **Use Network tab** to debug API calls
- **localStorage** contains user and theme data
- **Port 4000** = Backend, **Port 5173** = React app

## 📚 Project Structure

```
Next-Scene/
├── backend/
│   ├── src/
│   │   ├── server.js          # Express server
│   │   ├── routes/            # API routes
│   │   ├── models/            # MongoDB models
│   │   └── setup/db.js        # Database connection
│   ├── .env                   # Backend config
│   └── package.json
│
└── frontend/
    ├── react/
    │   ├── src/
    │   │   ├── App.jsx        # Router config
    │   │   ├── services/api.js # API calls
    │   │   ├── context/       # State management
    │   │   ├── pages/         # 12 pages
    │   │   ├── components/    # UI components
    │   │   └── layouts/       # Header, Footer
    │   ├── .env               # Frontend config
    │   └── package.json
    │
    └── [original HTML files]  # Original design reference
```

## ✨ Features Implemented

- ✅ Complete design conversion from HTML to React
- ✅ All 12 pages (Home, SignIn, SignUp, Browse, MovieDetails, Dashboard, Watchlist, Profile, About, AdminDashboard, AdminBrowse, Search)
- ✅ Context providers (Auth, Theme, Watchlist)
- ✅ Protected routes with authentication
- ✅ Admin routes with role checking
- ✅ Full backend API integration
- ✅ Dark mode with localStorage persistence
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Movie search and filtering
- ✅ Watchlist management
- ✅ User authentication and profiles
- ✅ Admin dashboard with charts
- ✅ Exact design match with original HTML
