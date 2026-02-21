import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import db
from routes import auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management cho FastAPI app"""
    # Startup
    print("🚀 Đang khởi động Smart Sport Store API...")
    db.connect()
    
    yield
    
    # Shutdown
    print("👋 Đang tắt Smart Sport Store API...")
    db.close()


# Tạo FastAPI app
app = FastAPI(
    title="Smart Sport Store API",
    description="API cho hệ thống thương mại điện tử bán đồ thể thao với tích hợp AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production, hãy thay thế bằng domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký routers
app.include_router(auth_router)


@app.get("/")
async def root():
    """Root endpoint - Kiểm tra API đang hoạt động"""
    return {
        "message": "Chào mừng đến với Smart Sport Store API!",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False
    )
