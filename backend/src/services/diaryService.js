import prisma from '../utils/prismaClient.js';

// 取得該使用者的所有日記（依日期與建立時間，新到舊）
const getDiariesByUser = async (userId) => {
	const entries = await prisma.diaryEntry.findMany({
		where: { userId },
		orderBy: [{ dateStr: 'desc' }, { createdAt: 'desc' }],
	});

	// 將 DB 欄位 dateStr 對應回前端期待的 date
	return entries.map((e) => ({
		id: e.id,
		date: e.dateStr,
		title: e.title,
		content: e.content,
		createdAt: e.createdAt,
	}));
};

// 新增一筆日記
const addDiary = async (userId, diaryData) => {
	const entry = await prisma.diaryEntry.create({
		data: {
			userId,
			dateStr: diaryData.date,
			title: diaryData.title,
			content: diaryData.content,
		},
	});

	return {
		id: entry.id,
		date: entry.dateStr,
		title: entry.title,
		content: entry.content,
		createdAt: entry.createdAt,
	};
};

export { getDiariesByUser, addDiary };