const express = require('express');
const { createTask, getTasks, deleteTasks, updateTask } = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.route('/create').post(authMiddleware, createTask);
router.route('/getTasks').get(authMiddleware, getTasks);
router.route('/updateTask/:id').patch(authMiddleware, updateTask);
router.route('/deleteTasks').delete(authMiddleware, deleteTasks);

module.exports = router;