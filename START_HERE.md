# Deployment Quick Reference

**Read this first → then follow the steps in order**

## Deployment Path Decision

### 🚀 Recommended (Most Reliable)
**Frontend on Vercel + Backend on Railway + Database on MongoDB Atlas**
- ✅ Easy setup (5-10 minutes)
- ✅ Free tier available
- ✅ Scales automatically
- ✅ No DevOps knowledge needed
- → **Follow: `VERCEL_QUICKSTART.md`**

### 🔧 Advanced (Single Platform)
**Both on Vercel (requires serverless function conversion)**
- ⚠️ Complex setup
- ⚠️ May require code changes
- ⚠️ Limited by serverless constraints
- → **Contact Vercel support if interested**

### 🏠 Local Only
**Run both on your machine**
- ✅ No cost
- ⚠️ Not suitable for production
- ⚠️ Only for development
- → **See README.md for `npm run dev`**

---

## Pre-Deployment Checklist (5 min)

- [ ] Code pushed to GitHub
- [ ] Tests pass: `npm run test`
- [ ] Linter passes: `npm run lint`
- [ ] Build works: `npm run build`
- [ ] No hardcoded secrets in code
- [ ] `.env.example` is up to date

---

## Step-by-Step Deployment

### ⏱️ Total Time: ~20 minutes

#### Step 1: Create Accounts (5 min)
```
☐ MongoDB Atlas: mongodb.com/cloud (free tier)
☐ Railway: railway.app (free tier)
☐ Vercel: vercel.com (free tier)
☐ Google AI Studio: ai.google.dev (free tier)
```

#### Step 2: Generate Secrets (1 min)
```bash
node scripts/generate-secrets.js
# Copy output - you'll need it
```

#### Step 3: Set Up Database (3 min)
```
1. MongoDB Atlas → Create Cluster (free)
2. Create database user
3. Get connection string: mongodb+srv://user:pass@cluster/db
4. Add IP: 0.0.0.0/0 (or specific IP)
```

#### Step 4: Deploy Backend (5 min)
```
1. Railway: Create project from GitHub
2. Add environment variables (from generate-secrets.js)
3. Set Start Command: npm run start -w server
4. Copy Railway URL: https://carbon-backend-prod.up.railway.app
```

#### Step 5: Deploy Frontend (5 min)
```
1. Vercel: Import project from GitHub
2. Set Root Directory: ./client
3. Add VITE_API_URL=https://your-backend-url/api
4. Deploy
```

#### Step 6: Test (1 min)
```bash
curl https://your-backend.up.railway.app/api/health
# Should return: {"success": true, "data": {"status": "healthy", ...}}
```

---

## Environment Variables Checklist

### 🔐 Backend (Railway)
```
✓ NODE_ENV=production
✓ MONGODB_URI=mongodb+srv://...
✓ JWT_SECRET=<from-generate-secrets>
✓ JWT_REFRESH_SECRET=<from-generate-secrets>
✓ ENCRYPTION_KEY=<from-generate-secrets>
✓ CORS_ORIGIN=https://your-vercel-frontend.vercel.app
✓ GEMINI_API_KEY=your-google-api-key
✓ PORT=5000
```

### 🎨 Frontend (Vercel)
```
✓ VITE_API_URL=https://your-railway-backend.up.railway.app/api
```

---

## File Reference

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel configuration for frontend |
| `.env.example` | Template for environment variables |
| `VERCEL_QUICKSTART.md` | **← Start here** |
| `DEPLOYMENT_GUIDE.md` | Detailed step-by-step guide |
| `docs/RAILWAY_DEPLOYMENT.md` | Backend-specific guide |
| `DEPLOYMENT_CHECKLIST.md` | Quality checklist before going live |
| `DEPLOYMENT_SETUP_SUMMARY.md` | Overview of what's been set up |
| `scripts/generate-secrets.js` | Generate secure production secrets |
| `.github/workflows/deploy.yml` | (Optional) Auto-deploy on push |

---

## Troubleshooting Quick Links

**Issue → Solution:**

| Problem | Fix |
|---------|-----|
| Build fails | Check `npm run build` locally first |
| API returns 401 | Check `CORS_ORIGIN` is set correctly |
| Database connection fails | Add IP to MongoDB Atlas allowlist |
| Chat doesn't work | Ensure `GEMINI_API_KEY` is set |
| Frontend can't reach API | Verify `VITE_API_URL` in Vercel env |
| Deployment stuck | Check Railway/Vercel logs |

See `DEPLOYMENT_GUIDE.md` section "Troubleshooting" for more.

---

## Commands Reference

```bash
# Local development
npm run dev              # Both frontend & backend

# Build for production
npm run build            # Everything
npm run build -w server  # Backend only
npm run build -w client  # Frontend only

# Testing
npm run test             # All tests
npm run lint             # Code quality

# Generate secrets
node scripts/generate-secrets.js

# Vercel CLI (if you want manual deployment)
npm install -g vercel
vercel              # Deploy to staging
vercel --prod       # Deploy to production
```

---

## After Deployment

- [ ] Test login/register
- [ ] Test chat functionality
- [ ] Test on mobile
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring (Uptime Robot)
- [ ] Set up error tracking (Sentry)
- [ ] Configure custom domain (optional)
- [ ] Announce to users 🎉

---

## Support Resources

- **Vercel**: vercel.com/docs
- **Railway**: railway.app/docs
- **MongoDB**: docs.mongodb.com
- **This project**: Check README.md or issues on GitHub

---

## Key Reminders

1. ⚠️ **Never commit `.env` file** (only `.env.example`)
2. ⚠️ **Regenerate secrets** for each environment
3. ⚠️ **Add IP whitelist** to MongoDB Atlas
4. ⚠️ **Test locally first** before deploying
5. ✅ **Keep production secrets secure** (use platform vaults)

---

## Next Step

👉 **Read `VERCEL_QUICKSTART.md` now!**

It's the fastest way to get deployed.
