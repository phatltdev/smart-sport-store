from datetime import datetime
from typing import Optional, Dict, Any
from bson import ObjectId
from pymongo.collection import Collection
from models import UserCreate, UserResponse, UserInDB
from utils import get_password_hash, verify_password, create_access_token


class UserService:
    """Service xử lý các logic liên quan đến User"""
    
    def __init__(self, user_collection: Collection):
        self.user_collection = user_collection
    
    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """
        Tạo user mới trong database
        
        Args:
            user_data: Dữ liệu user để tạo
            
        Returns:
            UserResponse: User đã được tạo
            
        Raises:
            ValueError: Nếu email đã tồn tại
        """
        # Kiểm tra email đã tồn tại chưa
        existing_user = self.user_collection.find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("Email đã được sử dụng")
        
        # Hash mật khẩu
        hashed_password = get_password_hash(user_data.password)
        
        # Chuẩn bị dữ liệu để lưu
        user_dict = {
            "full_name": user_data.full_name,
            "email": user_data.email,
            "date_of_birth": user_data.date_of_birth,
            "gender": user_data.gender.value,
            "hashed_password": hashed_password,
            "is_admin": False,
            "created_at": datetime.utcnow()
        }
        
        # Insert vào database
        result = self.user_collection.insert_one(user_dict)
        
        # Lấy user vừa tạo
        created_user = self.user_collection.find_one({"_id": result.inserted_id})
        
        # Convert ObjectId sang string
        created_user["_id"] = str(created_user["_id"])
        
        return UserResponse(**created_user)
    
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """
        Xác thực user bằng email và password
        
        Args:
            email: Email của user
            password: Mật khẩu (plain text)
            
        Returns:
            UserInDB: User đã xác thực hoặc None nếu thất bại
        """
        user = self.user_collection.find_one({"email": email})
        
        if not user:
            return None
        
        if not verify_password(password, user["hashed_password"]):
            return None
        
        # Convert ObjectId sang string
        user["_id"] = str(user["_id"])
        
        return UserInDB(**user)
    
    async def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        """
        Lấy thông tin user theo ID
        
        Args:
            user_id: ID của user
            
        Returns:
            UserResponse: Thông tin user hoặc None nếu không tìm thấy
        """
        try:
            user = self.user_collection.find_one({"_id": ObjectId(user_id)})
        except:
            return None
        
        if not user:
            return None
        
        # Convert ObjectId sang string và loại bỏ hashed_password
        user["_id"] = str(user["_id"])
        user.pop("hashed_password", None)
        
        return UserResponse(**user)
    
    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """
        Lấy thông tin user theo email
        
        Args:
            email: Email của user
            
        Returns:
            UserResponse: Thông tin user hoặc None nếu không tìm thấy
        """
        user = self.user_collection.find_one({"email": email})
        
        if not user:
            return None
        
        # Convert ObjectId sang string và loại bỏ hashed_password
        user["_id"] = str(user["_id"])
        user.pop("hashed_password", None)
        
        return UserResponse(**user)
    
    async def login(self, email: str, password: str) -> Dict[str, Any]:
        """
        Đăng nhập user và tạo access token
        
        Args:
            email: Email của user
            password: Mật khẩu
            
        Returns:
            Dict: Chứa access_token, token_type và user info
            
        Raises:
            ValueError: Nếu email hoặc password sai
        """
        # Xác thực user
        user = await self.authenticate_user(email, password)
        
        if not user:
            raise ValueError("Email hoặc mật khẩu không chính xác")
        
        # Tạo access token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        # Chuẩn bị user response (loại bỏ hashed_password)
        user_dict = user.model_dump(exclude={"hashed_password"})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_dict
        }