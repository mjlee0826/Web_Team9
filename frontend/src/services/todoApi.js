// frontend/src/services/todoApi.js

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/todo`;

/**
 * 取得使用者的所有任務
 */
export const fetchTodos = async (token) => {
    const res = await fetch(`${API_BASE_URL}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
};

/**
 * 建立新任務
 */
export const createTodo = async (token, todoData) => {
    const res = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
};

/**
 * 更新任務 (如：標記完成狀態)
 */
export const updateTodo = async (token, todoId, todoData) => {
    const res = await fetch(`${API_BASE_URL}/${todoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
};

/**
 * 刪除任務
 */
export const deleteTodo = async (token, todoId) => {
    const res = await fetch(`${API_BASE_URL}/${todoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete todo');
};