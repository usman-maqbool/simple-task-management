# models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import get_base

Base = get_base()



class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    bio = Column(String)
    password = Column(String)
    # image = Column(String, nullable=True)
    todos = relationship("ToDo", back_populates="user")

class ToDo(Base):
    __tablename__ = 'todos'
    id = Column(Integer, primary_key=True)
    task = Column(String(256))
    owner_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="todos")
    is_completed = Column(Boolean, default=False)

