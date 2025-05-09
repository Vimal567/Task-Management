const Task = require('../models/task.model');

const createTask = async (req, res) => {
  try {
    const { title, description, days, due, account_id } = req.body;

    const newTask = new Task({
      title,
      description,
      days,
      due,
      account_id
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: savedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating task'
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ account_id: id });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate if the provided data is valid
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the fields you want to update'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
    });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const { task_id } = req.body;

    // Ensure task id is present
    if (!Array.isArray(task_id) || task_id.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task id is required'
      });
    }

    await Task.deleteMany({ _id: { $in: task_id } });

    res.status(200).json({
      success: true,
      message: 'Tasks deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tasks'
    });
  }
};

module.exports = { createTask, getTasks, deleteTasks, updateTask };