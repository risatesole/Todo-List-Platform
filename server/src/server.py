from fastapi import FastAPI
from pydantic import BaseModel
from module_todo import mySqlite, todolist

app = FastAPI()

# Initialize the database
mySqlite()

# Define a Pydantic model for the request body
class Task(BaseModel):
    nombre: str
    description: str = None

@app.post("/tasks/")
def create_task(task: Task):
    new_task = todolist(nombre=task.nombre, description=task.description)
    new_task.setTodo()
    return {"message": "Task created successfully"}

@app.get("/tasks/")
def read_tasks():
    task_list = todolist().getTodo()
    return {"tasks": task_list}
