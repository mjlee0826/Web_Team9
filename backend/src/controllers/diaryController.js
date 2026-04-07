import * as diaryService from '../services/diaryService.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const getDiaries = async (req, res) => {
	try {
		const userId = req.user.id;
		const diaries = await diaryService.getDiariesByUser(userId);
		res.status(200).json(diaries);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createDiary = async (req, res) => {
	try {
		const userId = req.user.id;
		const { date, title, content } = req.body;

		if (!date || !title || !content) {
			return res.status(400).json({ error: 'Date, title and content are required' });
		}

		if (!DATE_REGEX.test(date)) {
			return res.status(400).json({ error: 'Date format must be YYYY-MM-DD' });
		}

		const newDiary = await diaryService.addDiary(userId, {
			date,
			title: title.trim(),
			content: content.trim(),
		});

		return res.status(201).json(newDiary);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export { getDiaries, createDiary };