from pymongo import MongoClient
from typing import Optional
from config import settings


class Database:
    client: Optional[MongoClient] = None
    database = None

    def connect(self):
        """Kết nối tới MongoDB"""
        if self.client is None:
            self.client = MongoClient(settings.MONGODB_URL)
            self.database = self.client[settings.DATABASE_NAME]
            print(f"Đã kết nối tới MongoDB: {settings.DATABASE_NAME}")

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