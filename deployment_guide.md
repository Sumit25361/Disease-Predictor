# Deployment Guide & Troubleshooting

If you are seeing "404 Not Found" errors or registration is failing on your deployed site, follow these steps.

## 1. The "Why" - Understanding the Issue
When you run the app locally, your frontend (React) talks to `localhost:5000` (Backend).
When you deploy to Vercel/Netlify/Render, `localhost` refers to the **user's phone or laptop**, not your backend server.
**You must tell your frontend where your backend lives.**

## 2. The Fix - Set Environment Variables

You need to set the `VITE_API_URL` environment variable in your frontend hosting provider.

### If using Vercel:
1. Go to your Project Dashboard.
2. Click **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-app.onrender.com/api`  <-- *Replace this with your ACTUAL backend URL set up on Render/Heroku*
4. **Redeploy** your application (Environment variables only take effect after a new deployment).

### If using Render (for Frontend):
1. Go to your Static Site "Environment" tab.
2. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-service-name.onrender.com/api`
3. Manual Deploy -> Deploy latest commit.

## 3. Fixing "404 Not Found" on Refresh (Vercel)
If you get a 404 error when you refresh a page like `/login` or `/register`, it's because Vercel looks for a file named `login.html` instead of using React to handle the route.

We have added a `vercel.json` file to your `frontend` folder to fix this automatically. Ensure this file is pushed to your repository.

## 4. Backend Health Check
Verify your backend is actually running by visiting:
`https://your-backend-app.onrender.com/api/health`
You should see `{"status": "healthy", ...}`. If this link is broken, your backend is down, and the frontend cannot work.
