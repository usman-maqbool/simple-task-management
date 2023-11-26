from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str
    bio: Optional[str] = None
    
class LoginUser(BaseModel):
    password: str
    username: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserUpdate(UserBase):
    pass

class UserList(BaseModel):
    users: List[User]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class UserWithToken(BaseModel):
    user: User
    access_token: str
    token_type: str

class ToDoCreate(BaseModel):
    task: str
    user_id: int
    is_completed: Optional[bool] = False  # Include is_completed in the request body

class ToDo(BaseModel):
    id: int
    task: str
    user: User
    is_completed: Optional[bool] = False  # Include is_completed in the response

    class Config:
        orm_mode = True

class UpdateTodoInRequest(BaseModel):
    task: str
