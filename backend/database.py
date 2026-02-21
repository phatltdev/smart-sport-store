from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from typing import Optional
from config import settings


class Database:
    client: Optional[MongoClient] = None
    database = None

    def connect(self):
        """Kết nối tới MongoDB với timeout"""
        if self.client is None:
            try:
                self.client = MongoClient(
                    settings.MONGODB_URL,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=5000,
                    socketTimeoutMS=5000,
                    retryWrites=True,
                    w='majority'
                )
                # Test kết nối
                self.client.admin.command('ping')
                self.database = self.client[settings.DATABASE_NAME]
                print(f"✅ Đã kết nối tới MongoDB: {settings.DATABASE_NAME}")
            except ConnectionFailure as e:
                print(f"❌ Lỗi kết nối MongoDB: {e}")
                raise

    def close(self):
        """Đóng kết nối MongoDB"""
        if self.client:
            self.client.close()
            self.client = None
            print("Đã đóng kết nối MongoDB")

    def get_database(self):
        """Lấy database instance"""
        if self.database is None:
            self.connect()
        return self.database


# Singleton instance
db = Database()


def get_db():
    """Dependency để lấy database trong FastAPI"""
    return db.get_database()
