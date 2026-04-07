// todoRoutes.js

import express from "express";
import {
  getTodos,
  addTodo,
  toggle,
  remove,
} from "../controllers/todoController.js";

// ⚠️ 這裡先「暫時不要用 auth middleware」（不然你現在會炸）
const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.patch("/:id", toggle);
router.delete("/:id", remove);

export default router;