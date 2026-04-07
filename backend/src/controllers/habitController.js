import { getHabitsByUser, addHabit, updateHabit, deleteHabit } from '../services/habitService.js';

// 取得所有習慣
const getHabits = async (req, res) => {
	try {
		const userId = req.user.id;
		const habits = await getHabitsByUser(userId);
		res.status(200).json(habits);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// 新增習慣
const createHabit = async (req, res) => {
	try {
		const userId = req.user.id;
		const { title, type, unit, goal, goalPeriod } = req.body;
		if (!title || !type) {
			return res.status(400).json({ error: 'Title and type are required' });
		}
		const newHabit = await addHabit(userId, { title: title.trim(), type, unit, goal, goalPeriod });
		res.status(201).json(newHabit);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// 更新習慣
const updateHabitController = async (req, res) => {
	try {
		const userId = req.user.id;
		const habitId = req.params.id;
		const updates = req.body;
		const updated = await updateHabit(userId, habitId, updates);
		if (!updated) {
			return res.status(404).json({ error: 'Habit not found' });
		}
		res.status(200).json(updated);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// 刪除習慣
const removeHabitController = async (req, res) => {
	try {
		const userId = req.user.id;
		const habitId = req.params.id;
		const deleted = await deleteHabit(userId, habitId);
		if (!deleted) {
			return res.status(404).json({ error: 'Habit not found' });
		}
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export { getHabits, createHabit, updateHabitController, removeHabitController };