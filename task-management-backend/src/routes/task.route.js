const express = require('express');
const { createTask, getTasks, deleteTasks, updateTask, exportTasks, importTasks } = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../utils/helper');
const router = express.Router();

router.route('/create').post(authMiddleware, createTask);
router.route('/getTasks/:id').get(authMiddleware, getTasks);
router.route('/updateTask/:id').patch(authMiddleware, updateTask);
router.route('/deleteTasks').post(authMiddleware, deleteTasks);
router.route('/exportTasks/:id').get(authMiddleware, exportTasks);
router.route('/importTasks/:id').post(authMiddleware, upload, importTasks);

module.exports = router;