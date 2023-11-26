from typing import List
from fastapi import FastAPI, status, HTTPException, Depends
from database import Base, engine, SessionLocal
from sqlalchemy.orm import Session, class_mapper
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import models
import schemas
from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
Base.metadata.create_all(engine)

# Initialize FastAPI app
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Dependency to get the database session
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Password hashing
password_hashing = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get the current user
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# API to get all users
@app.get("/users/", response_model=List[schemas.User])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/signup/", response_model=schemas.UserWithToken)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = password_hashing.hash(user.password)
    db_user = models.User(username=user.username, bio=user.bio, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Token generation
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"user": db_user, "access_token": access_token, "token_type": "bearer"}


# Function to authenticate a user and generate an access token
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user and password_hashing.verify(password, user.password):
        return user

# Route for user login
@app.post("/login", response_model=schemas.UserWithToken)
def login_user(credentials: schemas.LoginUser, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.username, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Token generation
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"user": user, "access_token": access_token, "token_type": "bearer"}



# API to get user details
@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.todos = db.query(models.ToDo).filter(models.ToDo.owner_id == user_id).all()
    return db_user

# API to update user details
@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = user.username
    db_user.email = user.email
    db.commit()
    db.refresh(db_user)
    return db_user

# API to delete a user
@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return None

# Root endpoint
@app.get("/")
def root():
    return "todos"


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception

    return token_data

def model_to_dict(obj):
    data = {column.key: getattr(obj, column.key) for column in class_mapper(obj.__class__).mapped_table.c}
    return data

@app.post("/create-task/", response_model=schemas.ToDo)
def create_todo(
    todo: schemas.ToDoCreate,
    current_user: schemas.TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get the authenticated user by username
    user = db.query(models.User).filter(models.User.username == current_user.username).first()

    # Check if the user exists
    if user is None:
        raise HTTPException(status_code=400, detail="User not found")

    # Create the ToDo with the specified owner_id and is_completed
    db_todo = models.ToDo(task=todo.task, owner_id=todo.user_id, is_completed=todo.is_completed)
    
    # Add and commit to the database
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    
    # Convert the SQLAlchemy model instance to a dictionary
    todo_dict = model_to_dict(db_todo)
    
    # Include user data in the response
    response_todo = schemas.ToDo(
        id=db_todo.id,
        task=db_todo.task,
        user=schemas.User(id=user.id, username=user.username, bio=user.bio, password=user.password),
        is_completed=db_todo.is_completed
    )
    
    return response_todo

@app.patch("/update-task/{id}", response_model=schemas.ToDo)
def update_todo(
    id: int,
    update_data: schemas.UpdateTodoInRequest,
    current_user: schemas.TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check if the todo item exists
    todo = session.query(models.ToDo).get(id)
    if not todo:
        raise HTTPException(status_code=404, detail=f"Todo item with id {id} not found")

    # Update the todo item
    todo.task = update_data.task
    session.commit()

    return todo





# API to delete a todo item by ID
@app.delete("/delete-task/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    id: int,
    current_user: schemas.TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Check if the todo item exists
    todo = session.query(models.ToDo).get(id)
    if not todo:
        raise HTTPException(status_code=404, detail=f"Todo item with id {id} not found")
    
    # Delete the todo item
    session.delete(todo)
    session.commit()
    return None

@app.get("/tasks", response_model=List[schemas.ToDo])
def read_todo_list(
    current_user: schemas.TokenData = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get all todo items
    todo_list = session.query(models.ToDo).all()
    return todo_list

