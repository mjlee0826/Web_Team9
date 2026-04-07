// frontend/src/services/habitApi.js

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/habit`;

// 取得所有習慣
const fetchHabits = async (token) => {
  const res = await fetch(`${API_BASE_URL}/entries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch habits');
  return res.json();
};

// 新增習慣
const createHabit = async (token, habitData) => {
  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(habitData),
  });
  if (!res.ok) throw new Error('Failed to create habit');
  return res.json();
};

// 更新習慣
const updateHabit = async (token, id, updates) => {
  const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update habit');
  return res.json();
};

// 刪除習慣
const deleteHabit = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete habit');
  return true;
};

export { fetchHabits, createHabit, updateHabit, deleteHabit };