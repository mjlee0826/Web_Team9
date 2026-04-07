const express = require('express');
const router = express.Router();
const todoController = require('./todo.controller');

// 當收到 POST /api/tasks 時，交給 controller 的 createTask 函式
router.post('/tasks', todoController.createTask);

module.exports = router;