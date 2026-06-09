# Deploy Backend to Railway

Railway is the easiest way to deploy Node.js backends. Here's how:

## Step-by-Step

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Authorize Railway to access your GitHub

### 2. Create New Project
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Select your CARBON repository
4. Select the branch (usually `main`)
5. Click "Deploy"

### 3. Configure Environment
1. Click the "Environment" tab in Railway dashboard
2. Add environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-footprint
JWT_SECRET=<from-generate-secrets.js>
JWT_REFRESH_SECRET=<from-generate-secrets.js>
ENCRYPTION_KEY=<from-generate-secrets.js>
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

### 4. Configure Build & Start
In Railway dashboard → Plugin:

1. Click "Plugins" → Add Plugin → PostgreSQL or MySQL (if needed)
2. Go to "Settings" tab
3. Set:
   - **Start Command**: `npm run start -w server`
   - **Build Command**: `npm run build -w server`
   - **Root Directory**: (leave empty)

### 5. Get Your Backend URL
- Railway gives you a URL like: `https://carbon-backend-prod.up.railway.app`
- Use this in your frontend's `VITE_API_URL` environment variable

### 6. Monitor Logs
- Click "Deployments" to see build logs
- Click "Logs" to see runtime logs
- Common issues appear here

---

## MongoDB Setup (Atlas)

If you haven't set up MongoDB yet:

### Free Tier
1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Sign up (free account)
3. Create a Shared Cluster (always free)
4. Set username & password
5. Click "Connect" → "Connect Your Application"
6. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/carbon-footprint?retryWrites=true&w=majority`

### Add IP Allowlist
1. Go to "Network Access" in MongoDB Atlas
2. Add IP: `0.0.0.0/0` (allows all - for testing only)
3. Or add Railway's outgoing IP (more secure)

---

## Verify Deployment

```bash
# Test API health
curl https://your-railway-url.up.railway.app/api/health

# Expected response:
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-...",
    "uptime": 12345
  }
}
```

---

## Troubleshooting

### Build fails
- Check "Build" tab for errors
- Ensure `npm run build` works locally first
- Run `npm run build -w server` to test

### Runtime errors
- Check "Logs" tab in Railway dashboard
- Look for "Cannot find module" errors
- Ensure all dependencies are in `server/package.json`

### Database connection fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP allowlist
- Test connection string locally with MongoDB Compass

### 401 errors on API
- Verify `CORS_ORIGIN` is set correctly
- Should be your exact Vercel frontend URL
- Check browser console for CORS errors

---

## Cost on Railway

**Free tier includes:**
- 100 hours/month of compute
- Good for small projects

**After free tier:**
- $5/month for continued service
- Pay-as-you-go beyond that
- Well worth it for a stable backend

---

## Next Steps
1. Deploy backend on Railway ✅
2. Get backend URL
3. Deploy frontend on Vercel with `VITE_API_URL=<backend-url>/api`
4. Test thoroughly
5. Set up custom domain (optional)
