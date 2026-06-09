# Quick Start: Deploy to Vercel

## 5-Minute Setup

### 1️⃣ Prerequisites
- GitHub account (with repo pushed)
- MongoDB Atlas account (free tier available)
- Vercel account (free tier available)
- Backend hosting account (Railway, Render, or Heroku)

### 2️⃣ Set Up MongoDB

```bash
# Option A: Local (development only)
# Install MongoDB and run: mongod

# Option B: MongoDB Atlas (recommended for production)
# 1. Go to mongodb.com/cloud
# 2. Create free cluster
# 3. Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/carbon-footprint
```

### 3️⃣ Deploy Backend (Choose One)

#### Railway (Easiest)
```bash
# 1. Go to railway.app
# 2. Click "Create New Project" → "Deploy from GitHub repo"
# 3. Select your repo
# 4. Add environment variables (see below)
# 5. Deploy - Get your URL like: https://carbon-api-prod.up.railway.app
```

#### Render
```bash
# 1. Go to render.com
# 2. New Web Service → Deploy from GitHub
# 3. Build Command: npm run build
# 4. Start Command: npm run start -w server
# 5. Add environment variables
```

### 4️⃣ Generate Secrets

```bash
# Generate production secrets
node scripts/generate-secrets.js
```

### 5️⃣ Backend Environment Variables

Set on Railway/Render/Heroku:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-footprint
JWT_SECRET=<paste-from-generate-secrets.js>
JWT_REFRESH_SECRET=<paste-from-generate-secrets.js>
ENCRYPTION_KEY=<paste-from-generate-secrets.js>
CORS_ORIGIN=https://your-frontend.vercel.app
GEMINI_API_KEY=<your-gemini-api-key>
```

### 6️⃣ Deploy Frontend on Vercel

```bash
# Option A: Via Vercel Dashboard
# 1. Go to vercel.com
# 2. Import Project → Select GitHub repo
# 3. Configure:
#    - Framework: Vite
#    - Root: ./client
#    - Build: npm run build
#    - Output: client/dist
# 4. Add environment variable:
#    VITE_API_URL=https://your-backend-url.com/api
# 5. Deploy!

# Option B: Via Vercel CLI
npm install -g vercel
vercel
```

### 7️⃣ Verify Deployment

```bash
# Frontend should respond
curl https://your-frontend.vercel.app

# Backend health check
curl https://your-backend-url.com/api/health

# Try login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## Troubleshooting

### "Cannot GET /"
- Make sure `client/dist` is in the output directory
- Check build logs in Vercel dashboard

### 401 on API calls
- Verify `VITE_API_URL` matches backend exactly
- Check `CORS_ORIGIN` is set correctly on backend
- Ensure cookies are being sent (`withCredentials: true`)

### Database connection fails
- Test connection string locally first
- Add your backend's IP to MongoDB Atlas allowlist
- Or allow 0.0.0.0/0 (less secure)

### Chat API not working
- Verify `GEMINI_API_KEY` is set on backend
- Check backend logs for API errors

---

## Cost

**Free Tier:**
- Vercel: ✅ Free (frontend)
- MongoDB Atlas: ✅ Free (500MB storage)
- Railway: ✅ $5/month free credits (backend)
- Render: ✅ Free instance (auto-spins down)

**Production Recommendations:**
- Vercel Pro: $20/month
- MongoDB Atlas M2: $9/month
- Railway/Render Pro: $7-10/month

**Total: ~$36/month for production**

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy backend
3. ✅ Deploy frontend
4. ✅ Test thoroughly
5. ✅ Set up custom domain (optional)
6. ✅ Monitor logs and errors

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
