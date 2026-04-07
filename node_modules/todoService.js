const Task = require('./todo.model'); // 假設你有定義 Mongoose Model

exports.createTodo = async (data) => {
  // 可以在這裡寫邏輯，例如：如果標題重複就拋出錯誤
  if (!data.title) throw new Error('標題是必填的');
  
  const todo = new Task(data);
  return await todo.save(); // 與資料庫互動
};