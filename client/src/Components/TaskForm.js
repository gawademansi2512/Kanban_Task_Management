import React, { useState } from 'react';
import { fetchTasks } from './api'; // Import the fetchTasks function
import './Css/TaskForm.css';

function TaskForm() {
  const [task, setTask] = useState({ title: '', description: '', priority: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
  
      if (response.status === 201) {
        alert('Task added successfully!');
        setTask({ title: '', description: '', priority: '' });
  
        // After adding a new task, fetch the updated task list and update the state
        fetchTasks();
      } else {
        alert('Failed to add task.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="task-form-container">
    <h2 className="task-form-heading">Add Task</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label className="task-form-label">Title:</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          className="task-form-input"
        />
      </div>
      <div>
        <label className="task-form-label">Description:</label>
        <input
          type="text"
          name="description"
          value={task.description}
          onChange={handleChange}
          className="task-form-input"
        />
      </div>
      <div>
        <label className="task-form-label">Priority:</label>
        <input
          type="text"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="task-form-input"
        />
      </div>
      <button type="submit" className="task-form-button">Add Task</button>
    </form>
  </div>
  );
}

export default TaskForm;
