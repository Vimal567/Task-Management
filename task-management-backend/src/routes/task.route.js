const express = require('express');
const { createTask, getTasks, deleteTasks, updateTask } = require('../controllers/task.controller');
const router = express.Router();

router.route('/create').post(createTask);
router.route('/getTasks').get(getTasks);
router.route('/updateTask/:id').patch(updateTask);
router.route('/deleteTasks').delete(deleteTasks);

module.exports = router;