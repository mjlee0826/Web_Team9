/**
 * In-memory habit store.
 * Structure:
 * {
 *   [userId]: [
 *     { id: string, title, type, goal, unit, todayValue, streak, completedToday, goalPeriod }
 *   ]
 * }
 */
const habitStore = {};

const getHabitsByUser = async (userId) => {
  if (!habitStore[userId]) {
    habitStore[userId] = [];
  }
  // 回傳複製陣列，避免外部直接修改
  return habitStore[userId].slice();
};

const addHabit = async (userId, habitData) => {
  if (!habitStore[userId]) {
    habitStore[userId] = [];
  }
  const newHabit = {
    id: Date.now().toString(),
    ...habitData,
    streak: 0,
    todayValue: habitData.type === "number" ? 0 : false,
    completedToday: false,
  };
  habitStore[userId].push(newHabit);
  return newHabit;
};

const updateHabit = async (userId, habitId, updates) => {
  if (!habitStore[userId]) return null;
  const idx = habitStore[userId].findIndex(h => h.id === habitId);
  if (idx === -1) return null;
  habitStore[userId][idx] = { ...habitStore[userId][idx], ...updates };
  return habitStore[userId][idx];
};

const deleteHabit = async (userId, habitId) => {
  if (!habitStore[userId]) return false;
  const idx = habitStore[userId].findIndex(h => h.id === habitId);
  if (idx === -1) return false;
  habitStore[userId].splice(idx, 1);
  return true;
};

export { getHabitsByUser, addHabit, updateHabit, deleteHabit };