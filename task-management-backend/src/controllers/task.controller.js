const Task = require('../models/task.model');
const XLSX = require('xlsx');
const { processExcel, processCSV, formatDate } = require('../utils/helper');

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

const exportTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ account_id: id });

    if (tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Create tasks at least one before exporting.'
      });
    }

    // Convert the json array with keys as headers of the excel and values as rows data
    const data = tasks.map((task, index) => ({
      "S.No.": index + 1,
      "Task Name": task.title,
      "Description": task.description,
      "Days": task.days,
      "Due Date": formatDate(task.due) // DD/MM/YYYY
    }));

    // Create a new workbook and add the data as a sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');

    // Generate the Excel file
    const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set response headers to prompt download in the frontend
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the file
    res.send(fileBuffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to export tasks.',
    });
  }
};

const importTasks = async (req, res) => {

  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    const fileType = req.file.mimetype;

    let tasksData = [];

    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Process Excel file
      tasksData = await processExcel(req.file.buffer);
    } else if (fileType === 'text/csv') {
      // Process CSV file
      tasksData = await processCSV(req.file.buffer);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload a valid Excel or CSV file.',
      });
    }

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-');
      console.log(dateStr)
      return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    };

    // Process the data
    const tasksToSave = tasksData.map(task => ({
      title: task['Task Name'],
      description: task['Description'],
      days: task['Days'],
      due: parseDate(task['Due Date']),
      account_id: id,
    }));

    // Insert tasks into the database
    const createdTasks = await Task.insertMany(tasksToSave);

    res.status(201).json({
      success: true,
      message: `${createdTasks.length} tasks imported successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while importing tasks. Please try again.',
    });
  }
};

module.exports = { createTask, getTasks, deleteTasks, updateTask, exportTasks, importTasks };