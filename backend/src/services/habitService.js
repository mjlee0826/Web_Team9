import prisma from '../utils/prismaClient.js';

const getHabitsByUser = async (userId) => {
  const todayStr = getTodayStr();

  const habits = await prisma.habit.findMany({
    where: { userId: userId },
    include: {
      logs: {
        where: { dateStr: todayStr },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // map logs → todayValue / completedToday
  return habits.map(({ logs, ...h }) => {
    const log = logs[0];

    return {
      ...h,
      todayValue: log ? log.value : 0,
      completedToday: log ? log.completed : false
    };
  });
};

const addHabit = async (userId, habitData) => {
  const habit = await prisma.habit.create({
    data: {
      userId,
      title: habitData.title,
      type: habitData.type,
      unit: habitData.unit || null,
      goal: habitData.goal ?? 0,
      goalPeriod: habitData.goalPeriod || 'day',
      streak: 0
    }
  });

  return habit;
};

const deleteHabit = async (userId, habitId) => {
  try {
    const result = await prisma.habit.deleteMany({
      where: {
        id: habitId,
        userId
      }
    });

    return result.count > 0;
  } catch (error) {
    console.error("Delete habit error:", error);
    return false;
  }
};

const updateHabit = async (userId, habitId, updates) => {
  const todayStr = getTodayStr();

  try {
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId }
    });
    if (!habit) return null;

    await prisma.habitLog.upsert({
      where: {
        habitId_dateStr: {
          habitId,
          dateStr: todayStr
        }
      },
      update: {
        value: updates.todayValue ?? 0,
        completed: updates.completedToday ?? false
      },
      create: {
        habitId,
        dateStr: todayStr,
        value: updates.todayValue ?? 0,
        completed: updates.completedToday ?? false
      }
    });

    const logs = await prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { dateStr: 'desc' },
      take: 30
    });

    const streak = calculateStreak(logs, habit.goalPeriod);

    const updated = await prisma.habit.update({
      where: {
        id: habitId,
        userId
      },
      data: {
        streak
      }
    });

    return updated;

  } catch (error) {
    console.error("Update habit error:", error);
    return null;
  }
};

const getTodayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const calculateStreak = (logs, goalPeriod = "day") => {
  if (!logs.length) return 0;

  // sort DESC (latest first)
  const sorted = logs.sort((a, b) => b.dateStr.localeCompare(a.dateStr));

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const logDate = new Date(sorted[i].dateStr);

    // normalize to midnight
    currentDate.setHours(0,0,0,0);
    logDate.setHours(0,0,0,0);

    const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 && sorted[i].completed) {
      // today
      streak++;
    } else if (diffDays === streak && sorted[i].completed) {
      // consecutive day
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export { getHabitsByUser, addHabit, updateHabit, deleteHabit };