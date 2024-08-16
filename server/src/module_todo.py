import sqlite3

def mySqlite():
    # Connect to SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect('todolist.db')
    cursor = conn.cursor()
    
    # Create a table for tasks if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            description TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

class todolist:
    def __init__(self, id=None, nombre=None, description=None):
        self.id = id
        self.nombre = nombre
        self.description = description

    def setTodo(self):
        # Add a new task to the database
        conn = sqlite3.connect('todolist.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO tasks (nombre, description) 
            VALUES (?, ?)
        ''', (self.nombre, self.description))
        conn.commit()
        conn.close()

    def getTodo(self):
        # Retrieve tasks from the database
        conn = sqlite3.connect('todolist.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM tasks')
        tasks = cursor.fetchall()
        conn.close()
        return tasks

    def deleteTodo(self, task_id):
        # Delete a task from the database by id
        conn = sqlite3.connect('todolist.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
        conn.close()
    


if __name__ == "__main__":
    # Initialize the database
    mySqlite()

    # Create a new task and add it to the database
    task1 = todolist(nombre="Buy groceries", description="Milk, Eggs, Bread")
    task1.setTodo()

    # Create another task and add it to the database
    task2 = todolist(nombre="Study Python", description="Complete the SQLite tutorial")
    task2.setTodo()

    # Retrieve and print all tasks from the database
    task_list = todolist().getTodo()

    for task in task_list:
        print(f"ID: {task[0]}, Name: {task[1]}, Description: {task[2]}")
    
    task1.deleteTodo(task_id=1)  # Deleting the first task
