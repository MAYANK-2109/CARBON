# Pre-Deployment Checklist

Use this checklist before deploying to production.

## Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Fix any linting errors
- [ ] Run tests: `npm run test`
- [ ] All tests pass
- [ ] No console.error or console.warn in production code
- [ ] Remove any hardcoded API URLs or secrets

## Environment & Secrets
- [ ] Generate production secrets: `node scripts/generate-secrets.js`
- [ ] Set `NODE_ENV=production`
- [ ] Set `MONGODB_URI` to MongoDB Atlas
- [ ] Set `GEMINI_API_KEY` from Google AI Studio
- [ ] Set `CORS_ORIGIN` to your Vercel frontend URL
- [ ] Set `VITE_API_URL` to your backend URL
- [ ] All required env vars are set (see `.env.example`)
- [ ] No secrets in `.env` file (only in deployment platform)

## Database
- [ ] MongoDB cluster created (MongoDB Atlas)
- [ ] Database user created with secure password
- [ ] IP whitelist configured (or 0.0.0.0/0 for testing)
- [ ] Connection string tested locally
- [ ] Database migrations run (if applicable)

## Backend Build
- [ ] `npm run build -w server` succeeds locally
- [ ] `npm run start -w server` works locally
- [ ] `npm run test -w server` passes
- [ ] Build output in `server/dist/` is correct
- [ ] No errors in compiled JavaScript

## Frontend Build
- [ ] `npm run build -w client` succeeds locally
- [ ] `npm run preview` works
- [ ] Build output in `client/dist/` has all assets
- [ ] No console errors in DevTools
- [ ] All images/fonts load correctly
- [ ] API calls point to correct backend URL in build

## API Testing (Locally First)
- [ ] `/api/health` responds
- [ ] `/api/auth/register` works
- [ ] `/api/auth/login` works
- [ ] `/api/auth/me` works after login
- [ ] `/api/chat/message` works (protected route)
- [ ] `/api/calculate/*` works
- [ ] Cookie handling works (HttpOnly cookies set)
- [ ] CORS headers are correct

## UI Testing
- [ ] Homepage loads
- [ ] Login page works
- [ ] Register page works
- [ ] Dashboard loads after login
- [ ] Chat page works (calls API correctly)
- [ ] Calculator works
- [ ] History/Tips pages load
- [ ] Mobile responsive (test at 320px, 768px, 1920px)
- [ ] No 404 errors on navigation

## Security
- [ ] Passwords are hashed (check DB)
- [ ] JWTs are signing correctly
- [ ] CORS is restricted to frontend domain
- [ ] Rate limiting is active
- [ ] HttpOnly cookies are set
- [ ] No PII logged in console
- [ ] No API keys exposed in frontend code

## Platform Setup

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist added
- [ ] Connection string copied

### Railway (Backend)
- [ ] Project created
- [ ] GitHub repo connected
- [ ] Environment variables added
- [ ] Build command set: `npm run build -w server`
- [ ] Start command set: `npm run start -w server`
- [ ] Domain/URL obtained

### Vercel (Frontend)
- [ ] Project created
- [ ] GitHub repo connected
- [ ] Framework: Vite selected
- [ ] Root directory: `./client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `client/dist`
- [ ] Environment variables added
- [ ] Domain/URL obtained

## Post-Deployment Tests

### Backend
```bash
# Test health endpoint
curl https://your-backend-url.com/api/health

# Expected: {"success": true, "data": {"status": "healthy", ...}}
```

### Frontend
```bash
# Test in browser
https://your-frontend.vercel.app
```

### Full Flow
- [ ] Load frontend
- [ ] Register new account (check MongoDB)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Chat sends message and gets response
- [ ] Navigation works
- [ ] Logout works
- [ ] Can login again

### Monitor
- [ ] Check Railway logs for errors
- [ ] Check Vercel logs for build errors
- [ ] Check browser console for errors
- [ ] Test on mobile (iOS Safari, Chrome)
- [ ] Test on different browsers

## Documentation
- [ ] README.md updated with deployment URL
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] Team knows how to access logs
- [ ] Team knows deployment passwords/secrets

## Monitoring & Maintenance
- [ ] Set up error tracking (Sentry recommended)
- [ ] Set up uptime monitoring (Uptime Robot)
- [ ] Set up backups for MongoDB
- [ ] Document troubleshooting steps
- [ ] Create runbook for common issues

---

## Deployment Steps

1. **Prepare**
   - Complete all checks above
   - Commit all changes to GitHub

2. **Deploy Backend**
   ```bash
   # Railway handles this automatically when you connect
   # Or manually:
   git push
   # Watch Railway dashboard
   ```

3. **Deploy Frontend**
   ```bash
   # Vercel handles this automatically
   # Or manually:
   vercel --prod
   ```

4. **Verify**
   - Test all endpoints
   - Check logs for errors
   - Confirm frontend can reach backend

5. **Monitor**
   - Watch logs for first hour
   - Monitor error rates
   - Check user feedback

---

## Rollback Plan

If something goes wrong:

1. **Frontend Issue**
   - Vercel automatically keeps previous deployment
   - Click "Deployments" → previous version → "Promote to Production"

2. **Backend Issue**
   - Railway keeps previous deployment
   - Click "Deployments" → previous → "Re-deploy"

3. **Database Issue**
   - MongoDB Atlas has automatic backups
   - Contact MongoDB support if needed

4. **Emergency Shutdown**
   - Pause deployments
   - Stop Railway backend service
   - Announce outage to users
