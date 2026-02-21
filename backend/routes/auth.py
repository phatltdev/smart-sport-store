from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from models import UserCreate, UserLogin, TokenResponse, UserResponse, UserUpdate
from database import get_db
from services import UserService
from pymongo.collection import Collection


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def get_user_service(db = Depends(get_db)) -> UserService:
    """Dependency để lấy UserService"""
    user_collection = db["user"]
    return UserService(user_collection)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    """
    API đăng ký tài khoản mới
    
    Thông tin cần cung cấp:
    - full_name: Họ tên (2-100 ký tự)
    - email: Email hợp lệ
    - date_of_birth: Ngày sinh (format: YYYY-MM-DD)
    - gender: Giới tính (male/female/other)
    - password: Mật khẩu (tối thiểu 6 ký tự)
    """
    try:
        user = await user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi tạo tài khoản: {str(e)}"
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    user_data: UserLogin,
    user_service: UserService = Depends(get_user_service)
):
    """
    API đăng nhập
    
    Thông tin cần cung cấp:
    - email: Email đã đăng ký
    - password: Mật khẩu
    
    Trả về:
    - access_token: JWT token để xác thực các request sau này
    - token_type: Loại token (bearer)
    - user: Thông tin user đã đăng nhập
    """
    try:
        result = await user_service.login(user_data.email, user_data.password)
        return TokenResponse(**result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi đăng nhập: {str(e)}"
        )


@router.patch("/update-profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    user_service: UserService = Depends(get_user_service)
):
    """
    API cập nhật thông tin bổ sung (giới tính, ngày sinh)
    
    Thông tin có thể cập nhật:
    - date_of_birth: Ngày sinh (format: YYYY-MM-DD)
    - gender: Giới tính (1: nam, 0: nữ, 2: khác)
    """
    try:
        user = await user_service.update_user_info(update_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi cập nhật thông tin: {str(e)}"
        )
