// todoService.js
console.log("🔥 NEW VERSION SERVICE");
let todos = [];

export const getTodosByUser = (userId) => {
  return todos.filter((t) => t.userId === userId);
};

export const createTodo = (userId, text) => {
  const newTodo = {
    id: Date.now(),
    userId,
    text,
    completed: false,
  };

  todos.push(newTodo);
  return newTodo;
};

export const toggleTodo = (id, userId) => {
  const todo = todos.find((t) => t.id === id && t.userId === userId);
  if (!todo) return null;

  todo.completed = !todo.completed;
  return todo;
};

export const deleteTodo = (id, userId) => {
  const index = todos.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) return false;

  todos.splice(index, 1);
  return true;
};