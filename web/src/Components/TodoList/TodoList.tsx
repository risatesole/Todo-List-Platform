import React, { useEffect, useState } from 'react';
import './TodoList.css'

interface Task {
  id: number;
  title: string;
  description: string;
}

interface ApiResponse {
  tasks: [number, string, string][];
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/tasks/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        const formattedTasks = data.tasks.map(([id, title, description]) => ({
          id,
          title,
          description
        }));
        setTasks(formattedTasks);
      })
      .catch(err => {
        setError(err.message);
        console.error('Fetch error:', err);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

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

export default TodoList;
