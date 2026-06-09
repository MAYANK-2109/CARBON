# Deployment Guide — CARBON on Vercel

This guide explains how to deploy the Carbon Footprint Assistant on Vercel.

## Architecture

- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Express.js + MongoDB (deploy separately, or use Vercel serverless)
- **Database**: MongoDB Atlas (cloud-hosted)

## Option 1: Deploy Frontend on Vercel + Backend Elsewhere (Recommended for Development)

### Step 1: Prepare Backend Deployment

Choose one of these hosting services for the backend:

#### A) Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project → Deploy from repo
4. Select your GitHub repo
5. Add environment variables (see below)
6. Deploy

#### B) Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create → New Web Service
4. Select repo and branch
5. Set:
   - Build Command: `npm run build`
   - Start Command: `npm run start -w server`
6. Add environment variables
7. Deploy

#### C) Heroku (Legacy but works)
```bash
# Install Heroku CLI
brew install heroku  # or download from heroku.com

# Login
heroku login

# Create app
heroku create your-carbon-backend

# Add MongoDB
heroku addons:create mongolab

# Deploy
git push heroku main
```

### Step 2: Set Up MongoDB Atlas

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Sign up and create a free cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/carbon-footprint`
4. Add your backend's IP to the allowlist (or allow 0.0.0.0/0 for testing)

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. Configure project:
   - Framework: Vite
   - Root Directory: `./client`
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
6. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
7. Deploy!

### Step 4: Configure Environment Variables

**On your backend service (Railway/Render/Heroku):**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbon-footprint
JWT_SECRET=<generate-random-string>
JWT_REFRESH_SECRET=<generate-random-string>
ENCRYPTION_KEY=<generate-32-byte-hex-string>
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
GEMINI_API_KEY=<your-gemini-api-key>
```

**On Vercel (frontend):**
```
VITE_API_URL=https://your-backend-url.com/api
```

### Step 5: Generate Secure Secrets

Run this in Node.js to generate the JWT secrets:
```javascript
require('crypto').randomBytes(32).toString('hex')
```

For ENCRYPTION_KEY (32-byte hex = 64 characters):
```javascript
require('crypto').randomBytes(32).toString('hex')
```

---

## Option 2: Deploy Both on Vercel (Advanced)

Vercel has limited support for Express.js. Use this if you want both frontend and backend on Vercel.

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Create `api/` directory for serverless functions:
   ```bash
   mkdir api
   ```

3. Convert Express routes to serverless functions (complex setup - contact support if needed)

4. Deploy:
   ```bash
   vercel
   ```

**Note**: This requires restructuring the backend into Vercel's serverless function format. Not recommended for Express.js with persistent connections.

---

## Environment Variables Needed

Generate these securely before deployment:

| Variable | Type | Example |
|----------|------|---------|
| `VITE_API_URL` | Client | `https://backend.example.com/api` |
| `MONGODB_URI` | Backend | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Backend | 32-byte random string |
| `JWT_REFRESH_SECRET` | Backend | 32-byte random string |
| `ENCRYPTION_KEY` | Backend | 64-character hex string |
| `CORS_ORIGIN` | Backend | `https://frontend.vercel.app` |
| `GEMINI_API_KEY` | Backend | Your Google Gemini API key |

---

## Troubleshooting

### "Cannot find module '@carbon/shared'"
Make sure the root `package.json` has workspaces configured:
```json
{
  "workspaces": ["shared", "server", "client"]
}
```

### CORS errors
Set `CORS_ORIGIN` on backend to match your Vercel frontend URL exactly, including the domain.

### Database connection fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP allowlist includes your backend's IP
- For development, use `127.0.0.1` if running locally

### 404 on API routes
Verify `VITE_API_URL` matches your backend URL exactly (including `/api`)

---

## Local Development

Run both services locally:
```bash
npm run dev
```

Or separately:
```bash
npm run dev:client  # Port 5173
npm run dev:server  # Port 5000
```

---

## Post-Deployment Checklist

- [ ] Frontend accessible at Vercel URL
- [ ] Backend responds to `/api/health`
- [ ] Login/Register works
- [ ] Chat API calls succeed
- [ ] Profile loads without 401 errors
- [ ] Tokens refresh silently on expiration

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
