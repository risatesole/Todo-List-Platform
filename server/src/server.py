"""
Start Server:
uvicorn your_module_name:app --host 0.0.0.0 --port 8000
"""
from fastapi import FastAPI,HTTPException
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

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    task = todolist().getTodo()
    if not any(t[0] == task_id for t in task):
        raise HTTPException(status_code=404, detail="Task not found")
    
    todolist().deleteTodo(task_id=task_id)
    return {"message": "Task deleted successfully"}
