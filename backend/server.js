import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
console.log("🔥 ENV:", process.env.LOGTO_ENDPOINT);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. 連接資料庫 (這裡以 MongoDB 為例)
mongoose.connect('mongodb://localhost:27017/taskmatrix');

// 2. 定義任務模型 (Schema)
const TaskSchema = new mongoose.Schema({
  title: String,
  q: String,
  date: String,
  tags: [String],
  done: Boolean
});
const Task = mongoose.model('Task', TaskSchema);

// 3. API 路由
// 取得所有任務
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// 新增任務
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// 更新任務狀態 (勾選完成)
app.patch('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// 刪除任務
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));