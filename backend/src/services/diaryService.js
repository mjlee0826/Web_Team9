/**
 * In-memory diary store.
 * Structure:
 * {
 *   [userId]: [
 *     { id: string, date: 'YYYY-MM-DD', title: string, content: string, createdAt: string }
 *   ]
 * }
 */
const diaryStore = {};

const getDiariesByUser = async (userId) => {
	if (!diaryStore[userId]) {
		diaryStore[userId] = [];
	}

	return diaryStore[userId]
		.slice()
		.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};

const addDiary = async (userId, diaryData) => {
	if (!diaryStore[userId]) {
		diaryStore[userId] = [];
	}

	const newDiary = {
		id: Date.now().toString(),
		...diaryData,
		createdAt: new Date().toISOString(),
	};

	diaryStore[userId].push(newDiary);
	return newDiary;
};

export { getDiariesByUser, addDiary };