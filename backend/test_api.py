"""
Test script cho Smart Sport Store API
Chạy script này để test các API endpoints
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"


def print_response(response, title):
    """In kết quả response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_root_endpoint():
    """Test root endpoint"""
    print("\n🔍 Testing ROOT endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print_response(response, "Root Endpoint")


def test_health_check():
    """Test health check endpoint"""
    print("\n🔍 Testing HEALTH CHECK endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print_response(response, "Health Check")


def test_register():
    """Test register endpoint"""
    print("\n🔍 Testing REGISTER endpoint...")
    
    test_user = {
        "full_name": "Nguyễn Văn Test",
        "email": f"testuser{datetime.now().timestamp()}@example.com",
        "date_of_birth": "2000-01-01T00:00:00",
        "gender": "male",
        "password": "password123"
    }
    
    print(f"\n📤 Request Data: {json.dumps(test_user, indent=2, ensure_ascii=False)}")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json=test_user
    )
    print_response(response, "Register User")
    
    if response.status_code == 201:
        return response.json()
    return None


def test_login(email, password):
    """Test login endpoint"""
    print("\n🔍 Testing LOGIN endpoint...")
    
    login_data = {
        "email": email,
        "password": password
    }
    
    print(f"\n📤 Request Data: {json.dumps(login_data, indent=2, ensure_ascii=False)}")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=login_data
    )
    print_response(response, "Login User")
    
    if response.status_code == 200:
        return response.json()
    return None


def test_duplicate_register(email):
    """Test register với email đã tồn tại"""
    print("\n🔍 Testing DUPLICATE REGISTER (should fail)...")
    
    duplicate_user = {
        "full_name": "User Trùng",
        "email": email,
        "date_of_birth": "2000-01-01T00:00:00",
        "gender": "female",
        "password": "password456"
    }
    
    print(f"\n📤 Request Data: {json.dumps(duplicate_user, indent=2, ensure_ascii=False)}")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json=duplicate_user
    )
    print_response(response, "Register with Duplicate Email (Expected to fail)")


def test_wrong_login():
    """Test login với sai mật khẩu"""
    print("\n🔍 Testing LOGIN with WRONG PASSWORD (should fail)...")
    
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    
    print(f"\n📤 Request Data: {json.dumps(login_data, indent=2, ensure_ascii=False)}")
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=login_data
    )
    print_response(response, "Login with Wrong Credentials (Expected to fail)")


def main():
    """Main function để chạy tất cả tests"""
    print("\n" + "="*60)
    print("🚀 SMART SPORT STORE API TEST SUITE")
    print("="*60)
    print(f"📡 Base URL: {BASE_URL}")
    print(f"📅 Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Test basic endpoints
        test_root_endpoint()
        test_health_check()
        
        # Test register
        user_data = test_register()
        
        if user_data:
            # Test login với user vừa tạo
            email = user_data.get('email')
            password = "password123"  # password đã dùng khi register
            
            login_data = test_login(email, password)
            
            if login_data:
                # Test register lại với cùng email (phải fail)
                test_duplicate_register(email)
        
        # Test login sai thông tin (phải fail)
        test_wrong_login()
        
        print("\n" + "="*60)
        print("✅ ALL TESTS COMPLETED!")
        print("="*60)
        print("\n📚 API Documentation:")
        print(f"   Swagger UI: {BASE_URL}/docs")
        print(f"   ReDoc: {BASE_URL}/redoc")
        print("\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Không thể kết nối đến server!")
        print(f"   Hãy chắc chắn server đang chạy tại {BASE_URL}")
        print(f"   Chạy: cd backend && python main.py")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")


if __name__ == "__main__":
    main()