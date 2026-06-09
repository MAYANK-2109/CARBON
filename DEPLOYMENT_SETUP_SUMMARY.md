# Vercel Deployment Setup — Summary

## What's Been Set Up

You now have everything configured to deploy the Carbon Footprint Assistant to production:

### ✅ Configuration Files
- **`vercel.json`** — Vercel frontend configuration (React + Vite)
- **`.env.example`** — Updated with all required environment variables
- **`scripts/generate-secrets.js`** — Helper to generate secure production secrets

### ✅ Documentation
1. **`VERCEL_QUICKSTART.md`** — 5-minute quick start guide
2. **`DEPLOYMENT_GUIDE.md`** — Comprehensive deployment instructions
3. **`docs/RAILWAY_DEPLOYMENT.md`** — Backend deployment on Railway
4. **`DEPLOYMENT_CHECKLIST.md`** — Pre-deployment quality checklist

---

## Recommended Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│           Your Users' Browsers                  │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTPS
                  ▼
        ┌─────────────────────┐
        │  Vercel (Frontend)  │
        │  React + Vite       │
        │  vercel.app domain  │
        └──────────┬──────────┘
                   │
                   │ API calls to VITE_API_URL
                   │
                   ▼
        ┌─────────────────────┐
        │ Railway (Backend)   │
        │ Express + MongoDB   │
        │ railway.app domain  │
        └──────────┬──────────┘
                   │
                   │ Mongoose/MongoDB driver
                   │
                   ▼
        ┌─────────────────────┐
        │ MongoDB Atlas       │
        │ (Cloud Database)    │
        └─────────────────────┘
```

---

## Quick Deployment Steps

### 1️⃣ Backend (Railway) — 5 minutes
```bash
# 1. Go to railway.app
# 2. Create new project from GitHub
# 3. Add environment variables (JWT_SECRET, MONGODB_URI, etc.)
# 4. Get backend URL: https://carbon-backend-prod.up.railway.app
```

### 2️⃣ Frontend (Vercel) — 3 minutes
```bash
# 1. Go to vercel.com
# 2. Import project from GitHub
# 3. Set VITE_API_URL=<backend-url>/api
# 4. Deploy
```

### 3️⃣ Test
```bash
# Frontend: https://carbon.vercel.app
# Register → Login → Chat should work!
```

---

## Environment Variables You'll Need

### MongoDB Atlas (create free at mongodb.com/cloud)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-footprint
```

### Google Gemini API (create free at ai.google.dev)
```
GEMINI_API_KEY=your-api-key
```

### Generate these (run `node scripts/generate-secrets.js`)
```
JWT_SECRET=<random-32-bytes>
JWT_REFRESH_SECRET=<random-32-bytes>
ENCRYPTION_KEY=<random-32-bytes-hex>
```

### Get these from deployment platforms
```
CORS_ORIGIN=https://your-frontend.vercel.app
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

## Files Structure

```
CARBON/
├── client/                    # React frontend
│   ├── src/
│   ├── dist/                  # Builds here
│   └── package.json
├── server/                    # Express backend
│   ├── src/
│   ├── dist/                  # Builds here
│   └── package.json
├── shared/                    # Shared types
│   └── src/
├── scripts/
│   └── generate-secrets.js    # Generate production secrets
├── docs/
│   └── RAILWAY_DEPLOYMENT.md  # Backend deployment guide
├── vercel.json                # Vercel config (frontend only)
├── .env.example               # Template for environment
├── VERCEL_QUICKSTART.md       # 5-minute setup
├── DEPLOYMENT_GUIDE.md        # Detailed instructions
├── DEPLOYMENT_CHECKLIST.md    # Quality checklist
└── package.json               # Root workspaces
```

---

## Key Decisions Made

### ✅ Frontend on Vercel
- **Pro**: Easy deployment, auto-scaling, free tier
- **Pro**: Vercel ↔ GitHub integration seamless
- **Pro**: CLI tools make it simple

### ✅ Backend on Railway
- **Pro**: Supports Node.js perfectly
- **Pro**: Easier than converting to serverless functions
- **Pro**: $5/month after free tier (affordable)
- **Pro**: Can handle long connections (WebSockets, etc.)

### ✅ Database on MongoDB Atlas
- **Pro**: Managed cloud database (no ops needed)
- **Pro**: Free tier supports small projects
- **Pro**: Automatic backups and monitoring
- **Pro**: Easy scaling when needed

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Set `CORS_ORIGIN` to exact Vercel frontend URL |
| 401 after deploy | Token refresh interceptor handles this automatically |
| Database connection fails | Add IP to MongoDB Atlas allowlist |
| Build fails on Vercel | Check `npm run build` works locally first |
| API calls 404 | Verify `VITE_API_URL` includes `/api` suffix |
| Chat doesn't work | Ensure `GEMINI_API_KEY` is set on backend |

---

## Cost Breakdown

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Vercel (Frontend) | ✅ Forever | $0 |
| Railway (Backend) | ✅ 100 hrs/mo | $5 |
| MongoDB (Database) | ✅ 512MB | $0 |
| **Total** | | **$5** |

Upgrade to professional when you need more resources.

---

## What to Read Next

1. **Start here**: `VERCEL_QUICKSTART.md` (5 minutes)
2. **Detailed setup**: `DEPLOYMENT_GUIDE.md` (15 minutes)
3. **Backend specifically**: `docs/RAILWAY_DEPLOYMENT.md` (10 minutes)
4. **Before going live**: `DEPLOYMENT_CHECKLIST.md` (30 minutes)

---

## Next Steps

- [ ] Read VERCEL_QUICKSTART.md
- [ ] Generate production secrets: `node scripts/generate-secrets.js`
- [ ] Set up MongoDB Atlas (free tier)
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Test the full flow
- [ ] Monitor logs for issues
- [ ] Go live! 🚀

---

## Support & Troubleshooting

- **Vercel Issues**: Check Vercel dashboard → Deployments/Logs
- **Railway Issues**: Check Railway dashboard → Logs
- **Database Issues**: MongoDB Atlas console → Monitoring
- **Application Errors**: Browser console + backend logs

Good luck! You're almost there! 🎉
