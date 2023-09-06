import React, { useState, useEffect } from 'react';
import './Css/Task.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Function to fetch tasks from the server
  // Function to fetch tasks from the server and update state
const fetchTasks = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/tasks');
    if (response.status === 200) {
      const data = await response.json();
      setTasks(data);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

  // Function to fetch completed tasks from the server
  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/completed-tasks');
      if (response.status === 200) {
        const data = await response.json();
        setCompletedTasks(data);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  };

  // Function to handle task completion
  const handleCompletion = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      if (response.status === 204) {
        // Task is moved to 'completed_tasks' collection in the backend,
        // Update state to reflect this change without refreshing the page
        const updatedTasks = tasks.filter((task) => task._id !== taskId);
        const completedTask = tasks.find((task) => task._id === taskId);
        setTasks(updatedTasks);
        setCompletedTasks([...completedTasks, completedTask]);
      } else {
        alert('Failed to complete task.');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Fetch tasks and completed tasks when the component mounts
  useEffect(() => {
    fetchTasks();
    fetchCompletedTasks();
  }, []); // Empty dependency array to fetch tasks once on mount

  // Function to render the task list
  const renderTaskList = (taskList) => {
    if (taskList.length === 0) {
      return <p>No tasks found.</p>;
    }

    return (
      <ul className="task-list">
        {taskList.map((task) => (
          <li key={task._id} className="task-card">
            <div className="task-title">{task.title}</div>
            <div className="task-description">{task.description}</div>
            {!task.completed && (
              <button
                className="completion-button"
                onClick={() => handleCompletion(task._id)}
              >
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="task-list-container">
      <div className="task-column">
        <h3>All Tasks</h3>
        {renderTaskList([...tasks])}
      </div>
      <div className="completed-task-column">
        <h3>Completed Tasks</h3>
        {renderTaskList(completedTasks)}
      </div>
    </div>
  );
}

export default TaskList;
