from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum


class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class UserBase(BaseModel):
    """Base model cho User"""
    full_name: str = Field(..., min_length=2, max_length=100, description="Họ tên người dùng")
    email: EmailStr = Field(..., description="Email người dùng")
    date_of_birth: datetime = Field(..., description="Ngày sinh")
    gender: GenderEnum = Field(..., description="Giới tính")


class UserCreate(UserBase):
    """Model để tạo user mới"""
    password: str = Field(..., min_length=6, max_length=100, description="Mật khẩu")
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Họ tên phải có ít nhất 2 ký tự')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('Mật khẩu phải có ít nhất 6 ký tự')
        return v


class UserLogin(BaseModel):
    """Model để đăng nhập"""
    email: EmailStr = Field(..., description="Email người dùng")
    password: str = Field(..., min_length=1, description="Mật khẩu")


class UserResponse(UserBase):
    """Model để trả về thông tin user (không bao gồm password)"""
    id: str = Field(..., alias="_id", description="ID người dùng")
    is_admin: bool = Field(default=False, description="Là admin hay không")
    created_at: datetime = Field(default_factory=datetime.now, description="Ngày tạo tài khoản")
    
    class Config:
        populate_by_name = True


class TokenResponse(BaseModel):
    """Model để trả về token sau khi đăng nhập"""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Loại token")
    user: UserResponse = Field(..., description="Thông tin user")


class UserInDB(UserBase):
    """Model cho user trong database (bao gồm hashed password)"""
    id: str = Field(..., alias="_id")
    hashed_password: str = Field(..., description="Mật khẩu đã được mã hóa")
    is_admin: bool = Field(default=False, description="Là admin hay không")
    created_at: datetime = Field(default_factory=datetime.now, description="Ngày tạo tài khoản")
    
    class Config:
        populate_by_name = True