from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from config import settings
import bcrypt


def hash_password(password: str) -> bytes:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify mật khẩu thường với mật khẩu đã hash
    
    Args:
        plain_password: Mật khẩu thường
        hashed_password: Mật khẩu đã được hash
        
    Returns:
        True nếu mật khẩu đúng, False nếu sai
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """
    Hash mật khẩu
    
    Args:
        password: Mật khẩu thường
        
    Returns:
        Mật khẩu đã được hash (string)
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Tạo JWT access token
    
    Args:
        data: Dữ liệu muốn mã hóa trong token (thường là user_id, email)
        expires_delta: Thời gian hết hạn của token
        
    Returns:
        JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode và verify JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Dữ liệu đã decode hoặc None nếu token không hợp lệ
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None