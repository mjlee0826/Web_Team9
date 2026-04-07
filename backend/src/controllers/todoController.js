const todoService = require('./todo.service');

exports.createTask = async (req, res) => {
  try {
    // 1. 從請求中拿取資料
    const taskData = req.body; 
    
    // 2. 呼叫 Service 處理邏輯
    const newTask = await todoService.createTodo(taskData);
    
    // 3. 回傳成功的結果
    res.status(201).json(newTask);
  } catch (error) {
    // 4. 錯誤處理
    res.status(400).json({ message: error.message });
  }
};