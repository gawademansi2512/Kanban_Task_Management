import './Css/Columns.css';
import React from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
function Columns() {
  return (
    
    <div className="columns-container">
      <div className="column"> 
      <TaskForm />
      </div>
      <div className="column">
      <TaskList />
      </div>
    </div>
  );
}

export default Columns;
