// backend/src/services/calendarService.js
import prisma from '../utils/prismaClient.js';

// 取得特定月份/日期的事件
const getEventsByUser = async (userId) => {
    // 從 Postgres 撈出該使用者的所有事件
    const events = await prisma.event.findMany({
        where: { userId: userId },
        orderBy: { time: 'asc' } // 依照時間排序
    });

    // 為了配合前端原本的結構 { "2026-04-10": [...] }，我們在後端做資料轉換
    const groupedEvents = {};
    events.forEach(event => {
        if (!groupedEvents[event.dateStr]) {
            groupedEvents[event.dateStr] = [];
        }
        groupedEvents[event.dateStr].push(event);
    });

    return groupedEvents;
};

// 新增事件
const addEvent = async (userId, dateStr, eventData) => {
    const newEvent = await prisma.event.create({
        data: {
            userId: userId,
            dateStr: dateStr,
            title: eventData.title,
            time: eventData.time || null,
            type: eventData.type || 'task'
        }
    });
    return newEvent;
};

// 刪除事件
const deleteEvent = async (userId, dateStr, eventId) => {
    try {
        // 使用 deleteMany 可以確保即使找不到也不會報錯，且能限制只能刪除自己的任務
        const result = await prisma.event.deleteMany({
            where: {
                id: eventId,
                userId: userId, // 安全機制：只能刪除自己的
                dateStr: dateStr
            }
        });
        
        return result.count > 0; // 如果 count > 0 代表成功刪除
    } catch (error) {
        console.error("Delete event error:", error);
        return false;
    }
};

export { getEventsByUser, addEvent, deleteEvent }