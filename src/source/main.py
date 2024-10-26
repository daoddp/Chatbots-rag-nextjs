from typing import Dict, List
from fastapi import FastAPI
from pydantic import BaseModel

# Import hàm process từ file hiện tại
from Chatbot import process  # Thay thế your_module bằng tên file Python của bạn

# Khởi tạo ứng dụng FastAPI
app = FastAPI()

# Định nghĩa dữ liệu đầu vào cho API
class Message(BaseModel):
    role: str
    content: str

class RequestData(BaseModel):
    messages: List[Message]
    id: str = "abc123"  # Giá trị mặc định cho id

# API endpoint xử lý các tin nhắn và trả về kết quả từ hàm process
@app.post("/process")
async def process_messages(request_data: RequestData):
    # Chuyển đổi dữ liệu đầu vào về định dạng mong muốn cho hàm process
    messages = [{"role": msg.role, "content": msg.content} for msg in request_data.messages]
    result = process(messages, request_data.id)  # Gọi hàm process với dữ liệu đầu vào
    return {"answer": result}

# Nếu bạn chạy trực tiếp file main.py thì ứng dụng FastAPI sẽ chạy trên máy chủ uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
