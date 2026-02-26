# AI Social Media Manager - SaaS Specification

## 1. Project Overview

**Project Name:** SocialFlow AI

**Type:** SaaS Web Application

**Core Functionality:** An AI-powered social media management platform that helps businesses generate engaging social media posts, captions, and images. Users define their brand voice, and the AI creates a content calendar with scheduled posts. Payment is handled via M-Pesa Daraja API with monthly subscriptions.

**Target Users:** Small businesses, entrepreneurs, marketing agencies, and content creators who need efficient social media management.

---

## 2. Technology Stack

- **Frontend:** Next.js 14 (App Router)
- **Backend:** Python FastAPI
- **Database:** MongoDB
- **Authentication:** JWT-based auth
- **Payment:** M-Pesa Daraja API (STK Push)
- **AI Generation:** Rule-based + Template system (simulated AI for demo)

---

## 3. UI/UX Specification

### Color Palette
- **Primary:** `#6366F1` (Indigo)
- **Secondary:** `#1E1B4B` (Deep Navy)
- **Accent:** `#F59E0B` (Amber)
- **Background:** `#0F0F23` (Dark)
- **Surface:** `#1A1A2E` (Card Dark)
- **Text Primary:** `#F8FAFC` (White)
- **Text Secondary:** `#94A3B8` (Gray)
- **Success:** `#10B981` (Green)
- **Error:** `#EF4444` (Red)

### Typography
- **Headings:** "Clash Display", sans-serif (from CDN)
- **Body:** "Satoshi", sans-serif (from CDN)
- **Monospace:** "JetBrains Mono" (for code/technical)

### Layout Structure
- **Navigation:** Fixed sidebar (280px) on desktop, bottom nav on mobile
- **Content:** Max-width 1400px, responsive grid
- **Breakpoints:** Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

### Visual Effects
- Glassmorphism cards with backdrop-blur
- Subtle gradient animations on hero sections
- Smooth page transitions
- Hover effects with scale and glow
- Loading skeletons for async content

---

## 4. Core Features

### 4.1 Authentication System
- User registration with email/password
- Login with JWT tokens
- Protected routes
- Session management

### 4.2 Brand Voice Setup
- Business name input
- Business description (textarea)
- Industry selection (dropdown)
- Tone selection (Professional, Casual, Humorous, Inspirational, Technical)
- Target audience demographics
- Brand colors (color picker)

### 4.3 AI Content Generator
- Content type selection (Post, Caption, Story, Thread)
- Platform selection (Instagram, Twitter, LinkedIn, Facebook)
- Topic/keyword input
- Generate button with loading state
- Multiple variations output
- Copy to clipboard functionality
- Regenerate option

### 4.4 Content Calendar
- Monthly calendar view
- Add/edit/delete posts
- Drag-and-drop scheduling
- Filter by platform
- Status indicators (draft, scheduled, published)
- Preview mode

### 4.5 Image Generation
- Text-to-image prompts
- Template-based image creation
- Brand overlay options
- Download functionality

### 4.6 Payment System (M-Pesa Daraja)
- Subscription plans:
  - **Free Tier:** 10 posts/month, no automation
  - **Pro Tier:** KES 2,500/month - Unlimited posts, basic automation
  - **Premium Tier:** KES 5,000/month - Unlimited posts, full automation + AI images
- STK Push payment initiation
- Payment confirmation webhook
- Subscription status tracking

### 4.7 Posting Automation (Premium)
- Connect social media accounts (mock)
- Auto-post scheduled content
- Engagement tracking (mock)
- Analytics dashboard

---

## 5. Page Structure

### Pages
1. **Landing Page** (`/`) - Marketing page with features, pricing, CTA
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - New user signup
4. **Dashboard** (`/dashboard`) - Overview with quick stats
5. **Brand Voice** (`/dashboard/brand`) - Brand configuration
6. **Content Generator** (`/dashboard/generate`) - AI content creation
7. **Calendar** (`/dashboard/calendar`) - Content calendar
8. **Images** (`/dashboard/images`) - Image generation
9. **Settings** (`/dashboard/settings`) - User settings & subscription

---

## 6. API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Brand
- `GET /api/brand`
- `POST /api/brand`
- `PUT /api/brand`

### Content
- `POST /api/content/generate`
- `GET /api/content`
- `POST /api/content`
- `PUT /api/content/{id}`
- `DELETE /api/content/{id}`

### Images
- `POST /api/images/generate`

### Payments
- `POST /api/payments/stk-push`
- `POST /api/payments/callback` (webhook)
- `GET /api/payments/status/{id}`

### Subscription
- `GET /api/subscription`
- `POST /api/subscription/activate`

---

## 7. Database Schema

### Users Collection
```
json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "hashed_string",
  "name": "string",
  "subscription": "free|pro|premium",
  "subscription_expiry": "datetime",
  "mpesa_phone": "string",
  "created_at": "datetime"
}
```

### Brand Profiles Collection
```
json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "business_name": "string",
  "description": "string",
  "industry": "string",
  "tone": "string",
  "target_audience": "string",
  "brand_colors": ["string"]
}
```

### Content Collection
```
json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "platform": "string",
  "content_type": "string",
  "body": "string",
  "image_url": "string",
  "scheduled_date": "datetime",
  "status": "draft|scheduled|published",
  "created_at": "datetime"
}
```

---

## 8. Acceptance Criteria

1. ✅ User can register and login
2. ✅ User can configure brand voice
3. ✅ User can generate AI content (posts, captions)
4. ✅ User can view and manage content calendar
5. ✅ User can initiate M-Pesa payment
6. ✅ Payment webhook processes successfully
7. ✅ Premium features unlock after payment
8. ✅ Responsive design works on mobile and desktop
9. ✅ All pages load without errors
10. ✅ Form validations work correctly
