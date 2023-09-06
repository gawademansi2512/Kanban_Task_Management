const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection setup
mongoose.connect('mongodb://127.0.0.1:27017/Task_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String, // Assuming you want to store task priority
  priorityRank: Number,
});

const Task = mongoose.model('Task', taskSchema);
const completedTaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  // You can include other fields as needed
});

const CompletedTask = mongoose.model('CompletedTask', completedTaskSchema);
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Assuming you have a 'completed_tasks' collection
    const completedTask = new CompletedTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      // Copy other fields as needed
    });

    // Save the completed task to the 'completed_tasks' collection
    await completedTask.save();

    // Delete the task from the 'tasks' collection
    await Task.findByIdAndDelete(taskId);

    res.status(204).send(); // Success, no content response
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
//to fetch the complted_task
app.get('/api/completed-tasks', async (req, res) => {
  try {
    const completedTasks = await CompletedTask.find();
    res.json(completedTasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Routes
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Assign a rank based on the priority value (you can customize this ranking logic)
    let priorityRank;
    if (priority === 'High') {
      priorityRank = 1;
    } else if (priority === 'Medium') {
      priorityRank = 2;
    } else {
      priorityRank = 3; // Assuming 'Low' priority
    }

    const task = new Task({ title, description, priority, priorityRank });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    // Fetch tasks sorted by priorityRank in ascending order (change 1 to -1 for descending)
    const tasks = await Task.find().sort('priorityRank');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Add a PUT route to mark a task as completed
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Update the task's completed field to true
    const updatedTask = await Task.findByIdAndUpdate(taskId, { completed: true }, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send(); // 204 No Content response
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Add a new GET route to fetch completed tasks
app.get('/api/completed-tasks', async (req, res) => {
  try {
    const completedTasks = await Task.find({ completed: true }).sort('priorityRank');
    res.json(completedTasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
