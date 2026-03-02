# SocialFlow AI - AI Social Media Manager

A local AI-powered social media management SaaS that generates social media posts, captions, and images for businesses. Features brand voice configuration, content calendar, and M-Pesa payment integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Local Development

1. **Start Backend** (Terminal 1):
```
bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on: http://localhost:8000

2. **Start Frontend** (Terminal 2):
```
bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3001

---

## ☁️ Deploy to Cloud

### Frontend (Netlify) - FREE

1. Push your code to GitHub

2. Go to [Netlify.com](https://netlify.com) and sign up

3. Click "Add New..." → "Project"

4. Import your GitHub repository

5. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Publish Directory: `.next`

6. Click "Deploy"!

### Backend (Railway) - FREE

1. Go to [Railway.app](https://railway.app) and sign up

2. Click "New Project" → "Deploy from GitHub repo"

3. Select your repository

4. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   - `SECRET_KEY`: Generate a random string
   - `MPESA_CONSUMER_KEY`: Your M-Pesa key (optional)
   - `MPESA_CONSUMER_SECRET`: Your M-Pesa secret (optional)

6. Click "Deploy"!

---

## 📱 Access Your Deployed App

After deployment:
- **Frontend**: Your Netlify URL (e.g., `https://your-app.netlify.app`)
- **Backend API**: Your Railway URL (e.g., `https://your-backend.railway.app`)

### Update Frontend for Production

1. In your Netlify dashboard, add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your Railway backend URL

2. Create a `netlify.toml` file in frontend:
```
toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend.railway.app/:splat"
  status = 200
```

3. Redeploy to apply changes

---

## 💳 M-Pesa Payment Setup

For real M-Pesa payments:

1. Get M-Pesa Daraja API credentials from [Safaricom Developer Portal](https://developer.safaricom.co.ke)

2. Add to backend environment variables:
```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

---

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Zustand
- **Backend**: FastAPI, SQLite
- **Auth**: JWT
- **Payment**: M-Pesa Daraja API (STK Push)

---

## 📄 License

MIT
