"""
SocialFlow AI - Backend API
FastAPI application for AI Social Media Manager
Using SQLite database (no installation required)
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import sqlite3
import random
import os
import hashlib
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Initialize FastAPI
app = FastAPI(title="SocialFlow AI API", version="1.0.0")

# CORS - Allow all origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_PATH = "socialflow.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite database with tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            subscription TEXT DEFAULT 'free',
            subscription_expiry TEXT,
            mpesa_phone TEXT,
            created_at TEXT NOT NULL
        )
    ''')
    
    # Brands table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS brands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            business_name TEXT NOT NULL,
            description TEXT,
            industry TEXT,
            tone TEXT,
            target_audience TEXT,
            brand_colors TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Contents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            platform TEXT,
            content_type TEXT,
            body TEXT,
            image_url TEXT,
            scheduled_date TEXT,
            status TEXT DEFAULT 'draft',
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "socialflow-secret-key-change-in-production")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt"""
    salt = "socialflow_salt_2024"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

# Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class BrandProfile(BaseModel):
    business_name: str
    description: str
    industry: str
    tone: str
    target_audience: str
    brand_colors: List[str]

class ContentGenerate(BaseModel):
    platform: str
    content_type: str
    tone: str
    topic: str

class ImageGenerate(BaseModel):
    prompt: str
    style: str

class PaymentRequest(BaseModel):
    phone: str
    amount: int
    plan: str

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Security - Bearer token
security = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Content templates for AI generation
CONTENT_TEMPLATES = {
    "instagram": {
        "post": [
            "✨ {topic}\n\nWhat's your take on this? Drop a comment below! 👇",
            "🎉 {topic}\n\nTag someone who needs to see this!",
            "💫 {topic}\n\nSave this for later! 📌",
        ],
        "caption": [
            "Feeling {tone} about {topic} ✨",
            "{topic} - because you deserve it! 💪",
        ],
        "story": [
            "{topic} ☀️",
            "Quick tip: {topic} 💡",
        ],
    },
    "twitter": {
        "post": [
            "{topic}\n\n🧵 Thread below 👇",
            "Hot take: {topic} 🔥",
        ],
        "caption": [
            "{topic} (a thread) 🧵",
        ],
        "thread": [
            "{topic}\n\n1/ Let's talk about this...",
        ],
    },
    "linkedin": {
        "post": [
            "I'm excited to share my thoughts on {topic}.\n\nAs professionals, we should always strive to...\n\n#Business #Growth #Leadership",
            "Here's what I learned about {topic}:\n\n1. First insight\n2. Second insight\n3. Third insight\n\nWhat's your experience?",
        ],
        "caption": [
            "{topic} - An important topic for our industry.",
        ],
    },
    "facebook": {
        "post": [
            "We wanted to share some exciting news about {topic}!\n\nLet us know what you think in the comments!",
            "Question for our community: {topic}\n\nWe'd love to hear your thoughts!",
        ],
    },
}

# Image placeholders
IMAGE_STYLES = {
    "modern": "https://via.placeholder.com/800x800/6366F1/FFFFFF?text=Modern",
    "vintage": "https://via.placeholder.com/800x800/F59E0B/FFFFFF?text=Vintage",
    "minimal": "https://via.placeholder.com/800x800/94A3B8/FFFFFF?text=Minimal",
    "bold": "https://via.placeholder.com/800x800/EF4444/FFFFFF?text=Bold",
    "nature": "https://via.placeholder.com/800x800/10B981/FFFFFF?text=Nature",
    "tech": "https://via.placeholder.com/800x800/06B6D4/FFFFFF?text=Tech",
}

# Auth endpoints
@app.post("/api/auth/register", response_model=Token)
async def register(user: UserCreate):
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user.password)
    
    # Create user
    created_at = datetime.utcnow().isoformat()
    cursor.execute(
        """INSERT INTO users (name, email, phone, password, subscription, created_at) 
           VALUES (?, ?, ?, ?, 'free', ?)""",
        (user.name, user.email, user.phone, hashed_password, created_at)
    )
    conn.commit()
    conn.close()
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    
    # Find user
    cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "subscription": current_user["subscription"],
    }

# Brand endpoints
@app.post("/api/brand")
async def create_brand(brand: BrandProfile, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    brand_data = brand.dict()
    brand_data["user_id"] = current_user["id"]
    now = datetime.utcnow().isoformat()
    brand_data["created_at"] = now
    brand_data["updated_at"] = now
    brand_data["brand_colors"] = ",".join(brand.brand_colors)
    
    # Check if brand exists
    cursor.execute("SELECT id FROM brands WHERE user_id = ?", (current_user["id"],))
    existing = cursor.fetchone()
    
    if existing:
        cursor.execute("""
            UPDATE brands SET 
                business_name=?, description=?, industry=?, tone=?,
                target_audience=?, brand_colors=?, updated_at=?
            WHERE user_id=?
        """, (
            brand.business_name, brand.description, brand.industry, brand.tone,
            brand.target_audience, brand.brand_colors, now, current_user["id"]
        ))
    else:
        cursor.execute("""
            INSERT INTO brands (user_id, business_name, description, industry, tone, 
                               target_audience, brand_colors, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            current_user["id"], brand.business_name, brand.description, brand.industry,
            brand.tone, brand.target_audience, brand.brand_colors, now, now
        ))
    
    conn.commit()
    conn.close()
    
    return {"success": True, "message": "Brand profile saved"}

@app.get("/api/brand")
async def get_brand(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM brands WHERE user_id = ?", (current_user["id"],))
    brand = cursor.fetchone()
    conn.close()
    
    if brand:
        return dict(brand)
    return None

# Content endpoints
@app.post("/api/content/generate")
async def generate_content(content: ContentGenerate, current_user: dict = Depends(get_current_user)):
    # Get templates
    platform_templates = CONTENT_TEMPLATES.get(content.platform, CONTENT_TEMPLATES["instagram"])
    type_templates = platform_templates.get(content.content_type, platform_templates["post"])
    
    # Generate variations
    variations = []
    for template in type_templates:
        variation = template.format(topic=content.topic, tone=content.tone.lower())
        variations.append(variation)
    
    # Add a few more variations with different templates
    if len(variations) < 3:
        variations.append(f"🚀 {content.topic}\n\nCheck out more on our profile! #trending")
    
    return {"content": variations[:5]}

@app.get("/api/content")
async def get_contents(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM contents WHERE user_id = ? ORDER BY created_at DESC", (current_user["id"],))
    contents = cursor.fetchall()
    conn.close()
    
    return [dict(c) for c in contents]

@app.post("/api/content")
async def create_content(content: dict, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    content["user_id"] = current_user["id"]
    content["created_at"] = datetime.utcnow().isoformat()
    
    cursor.execute("""
        INSERT INTO contents (user_id, platform, content_type, body, image_url, 
                           scheduled_date, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        content["user_id"], content.get("platform"), content.get("content_type"),
        content.get("body"), content.get("image_url"), content.get("scheduled_date"),
        content.get("status", "draft"), content["created_at"]
    ))
    
    content_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {"id": content_id, "success": True}

# Image endpoints
@app.post("/api/images/generate")
async def generate_images(image_req: ImageGenerate, current_user: dict = Depends(get_current_user)):
    # Generate placeholder images based on style
    images = []
    for i in range(3):
        style_url = IMAGE_STYLES.get(image_req.style, IMAGE_STYLES["modern"])
        images.append(f"{style_url}&text={image_req.prompt[:20]}")
    
    return {"images": images}

# Payment endpoints (Mock M-Pesa)
@app.post("/api/payments/stk-push")
async def initiate_stk_push(payment: PaymentRequest, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    # Update user's M-Pesa phone
    cursor.execute(
        "UPDATE users SET mpesa_phone = ? WHERE id = ?",
        (payment.phone, current_user["id"])
    )
    conn.commit()
    conn.close()
    
    # Simulate STK push response
    return {
        "success": True,
        "message": "STK push initiated. Please check your phone.",
        "checkout_request_id": f"MPS-{random.randint(100000, 999999)}"
    }

@app.post("/api/payments/callback")
async def payment_callback(data: dict):
    # Handle M-Pesa payment callback
    result_code = data.get("ResultCode", 0)
    
    if result_code == 0:
        return {"success": True}
    
    return {"success": False, "message": "Payment failed"}

@app.get("/api/subscription")
async def get_subscription(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT subscription, subscription_expiry FROM users WHERE id = ?", (current_user["id"],))
    user = cursor.fetchone()
    conn.close()
    
    return {
        "plan": user["subscription"] if user else "free",
        "expiry": user["subscription_expiry"] if user else None,
    }

@app.post("/api/subscription/activate")
async def activate_subscription(plan: str, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    expiry = (datetime.utcnow() + timedelta(days=30)).isoformat()
    
    cursor.execute(
        "UPDATE users SET subscription = ?, subscription_expiry = ? WHERE id = ?",
        (plan, expiry, current_user["id"])
    )
    conn.commit()
    conn.close()
    
    return {"success": True, "plan": plan, "expiry": expiry}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
