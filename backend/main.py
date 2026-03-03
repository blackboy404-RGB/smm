"""
SocialFlow AI - Backend API
FastAPI application for AI Social Media Manager
Using PostgreSQL database
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import random
import os
import hashlib
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

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

# Database setup - PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/socialflow")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=False)
    password = Column(String, nullable=False)
    subscription = Column(String, default="free")
    subscription_expiry = Column(String, nullable=True)
    mpesa_phone = Column(String, nullable=True)
    created_at = Column(String, nullable=False)

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    industry = Column(String, nullable=True)
    tone = Column(String, nullable=True)
    target_audience = Column(Text, nullable=True)
    brand_colors = Column(String, nullable=True)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

class Content(Base):
    __tablename__ = "contents"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    body = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    scheduled_date = Column(String, nullable=True)
    status = Column(String, default="draft")
    created_at = Column(String, nullable=False)

def init_db():
    """Initialize PostgreSQL database with tables"""
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
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
    
    user = db.query(User).filter(User.email == email).first()
    
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
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_password(user.password)
    
    # Create user
    created_at = datetime.utcnow().isoformat()
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password,
        subscription="free",
        created_at=created_at
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find user
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "subscription": current_user.subscription,
    }

# Brand endpoints
@app.post("/api/brand")
async def create_brand(brand: BrandProfile, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    now = datetime.utcnow().isoformat()
    brand_colors = ",".join(brand.brand_colors)
    
    # Check if brand exists
    existing_brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    
    if existing_brand:
        existing_brand.business_name = brand.business_name
        existing_brand.description = brand.description
        existing_brand.industry = brand.industry
        existing_brand.tone = brand.tone
        existing_brand.target_audience = brand.target_audience
        existing_brand.brand_colors = brand_colors
        existing_brand.updated_at = now
    else:
        new_brand = Brand(
            user_id=current_user.id,
            business_name=brand.business_name,
            description=brand.description,
            industry=brand.industry,
            tone=brand.tone,
            target_audience=brand.target_audience,
            brand_colors=brand_colors,
            created_at=now,
            updated_at=now
        )
        db.add(new_brand)
    
    db.commit()
    
    return {"success": True, "message": "Brand profile saved"}

@app.get("/api/brand")
async def get_brand(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.user_id == current_user.id).first()
    
    if brand:
        return {
            "id": brand.id,
            "user_id": brand.user_id,
            "business_name": brand.business_name,
            "description": brand.description,
            "industry": brand.industry,
            "tone": brand.tone,
            "target_audience": brand.target_audience,
            "brand_colors": brand.brand_colors,
            "created_at": brand.created_at,
            "updated_at": brand.updated_at,
        }
    return None

# Content endpoints
@app.post("/api/content/generate")
async def generate_content(content: ContentGenerate, current_user: User = Depends(get_current_user)):
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
async def get_contents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    contents = db.query(Content).filter(Content.user_id == current_user.id).order_by(Content.created_at.desc()).all()
    
    return [
        {
            "id": c.id,
            "user_id": c.user_id,
            "platform": c.platform,
            "content_type": c.content_type,
            "body": c.body,
            "image_url": c.image_url,
            "scheduled_date": c.scheduled_date,
            "status": c.status,
            "created_at": c.created_at,
        }
        for c in contents
    ]

@app.post("/api/content")
async def create_content(content: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    created_at = datetime.utcnow().isoformat()
    
    new_content = Content(
        user_id=current_user.id,
        platform=content.get("platform"),
        content_type=content.get("content_type"),
        body=content.get("body"),
        image_url=content.get("image_url"),
        scheduled_date=content.get("scheduled_date"),
        status=content.get("status", "draft"),
        created_at=created_at
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    
    return {"id": new_content.id, "success": True}

# Image endpoints
@app.post("/api/images/generate")
async def generate_images(image_req: ImageGenerate, current_user: User = Depends(get_current_user)):
    # Generate placeholder images based on style
    images = []
    for i in range(3):
        style_url = IMAGE_STYLES.get(image_req.style, IMAGE_STYLES["modern"])
        images.append(f"{style_url}&text={image_req.prompt[:20]}")
    
    return {"images": images}

# Payment endpoints (Mock M-Pesa)
@app.post("/api/payments/stk-push")
async def initiate_stk_push(payment: PaymentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Update user's M-Pesa phone
    current_user.mpesa_phone = payment.phone
    db.commit()
    
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
async def get_subscription(current_user: User = Depends(get_current_user)):
    return {
        "plan": current_user.subscription,
        "expiry": current_user.subscription_expiry,
    }

@app.post("/api/subscription/activate")
async def activate_subscription(plan: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expiry = (datetime.utcnow() + timedelta(days=30)).isoformat()
    
    current_user.subscription = plan
    current_user.subscription_expiry = expiry
    db.commit()
    
    return {"success": True, "plan": plan, "expiry": expiry}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
