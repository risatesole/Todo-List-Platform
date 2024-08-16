import React, { useEffect, useState } from 'react';
import './TodoList.css';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface ApiResponse {
  tasks: [number, string, string][];
}

// Define the TaskList component
const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  if (!tasks.length) return <div>No tasks available.</div>;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <strong>{task.title}</strong>: {task.description}
        </li>
      ))}
    </ul>
  );
};

// Define the AddTaskSection component
const AddTaskSection: React.FC<{ fetchTasks: () => void }> = ({ fetchTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') return;

    try {
      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newTaskTitle,
          description: newTaskDescription,
        }),
      });

      if (response.ok) {
        console.log('Task added successfully.');
        fetchTasks();  // Refresh the task list
      } else {
        console.error('Failed to add task.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error:', message);
    }

    // Clear the input fields
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  return (
    <div>
      {/* Task title input */}
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Task title"
      />
      {/* Task description/details input */}
      <input
        type="text"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder="Task details"
      />
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

// Define the TodoList component
const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tasks/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ApiResponse = await response.json();
      const formattedTasks = data.tasks.map(([id, title, description]) => ({
        id,
        title,
        description
      }));
      setTasks(formattedTasks);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(message);
      console.error('Fetch error:', message);
    }
  };

  useEffect(() => {
    fetchTasks();  // Fetch tasks when component mounts
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <AddTaskSection fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default TodoList;
