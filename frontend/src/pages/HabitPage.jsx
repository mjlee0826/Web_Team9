import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLogto } from '@logto/react'
import * as habitApi from "../services/habitApi";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

// 初始為空，資料由 API 載入
const initialHabits = [];

function HabitCard({ habit, onEdit, onMarkComplete, onQuickAdd, onUpdate }) {
    return (
        <div
            className={classNames(
                "bg-white rounded p-4 border border-gray-200 shadow flex flex-col gap-2 mb-3 transition",
                habit.completedToday ? "opacity-50 bg-[#EFEDE8]" : "hover:shadow-lg hover:-translate-y-0.5"
            )}
        >
            {/* Title Row */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 flex-1">
                    {/* Checkmark visual - now toggleable, TodoPage style */}
                    <button
                        type="button"
                        className={classNames(
                            "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors mr-2",
                            habit.completedToday ? "bg-gray-800 border-gray-800" : "border-gray-300 bg-transparent hover:border-blue-400 hover:ring-2 hover:ring-blue-200 cursor-pointer"
                        )}
                        aria-label={habit.completedToday ? "Mark as in-progress" : "Mark habit as complete"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkComplete();
                        }}
                    >
                        {habit.completedToday && (
                            <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5"></div>
                        )}
                    </button>
                    <div className={classNames("text-base font-medium", habit.completedToday ? "line-through text-gray-400" : "")}>{habit.title}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs text-red-500 font-mono flex items-center gap-1">🔥 Streak: <span>{habit.streak || 0}</span></div>
                    <button
                        className="text-lg ml-2 text-gray-400 hover:text-blue-600 opacity-70 hover:opacity-100 transition"
                        title="Edit Habit"
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    >
                        ✏️
                    </button>
                </div>
            </div>
            {/* Goal */}
            <div className="text-xs text-gray-500 mb-1">
                Goal: {habit.goal || ""} {habit.unit || ""} <span className="text-[11px] text-gray-400 ml-1">{habit.goalPeriod === "week" ? "per week" : "per day"}</span>
            </div>
            {/* Input */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
                {habit.type === "checkbox" ? (
                    <button
                        className={classNames(
                            "bg-blue-100 text-blue-700 border border-blue-200 rounded px-3 py-1 text-xs font-medium transition",
                            habit.completedToday ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 hover:text-white"
                        )}
                        disabled={habit.completedToday}
                        onClick={(e) => { e.stopPropagation(); onMarkComplete(); }}
                    >
                        {habit.completedToday ? "Completed" : "Complete"}
                    </button>
                ) : (
                    <>
                        <button
                            className="bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1 text-xs font-medium transition hover:bg-blue-700 hover:text-white"
                            onClick={(e) => { e.stopPropagation(); onQuickAdd(habit.id, -1); }}
                            disabled={habit.completedToday || (habit.todayValue || 0) <= 0}
                        >
                            -
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={habit.goal || 10}
                            value={habit.todayValue || 0}
                            step={1}
                            className="w-[120px] accent-blue-700 mx-2"
                            onChange={(e) => onUpdate(habit.id, e.target.value)}
                            disabled={habit.completedToday}
                        />
                        <button
                            className="bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1 text-xs font-medium transition hover:bg-blue-700 hover:text-white"
                            onClick={(e) => { e.stopPropagation(); onQuickAdd(habit.id, 1); }}
                            disabled={habit.completedToday || (habit.todayValue || 0) >= (habit.goal || 10)}
                        >
                            +
                        </button>
                        <input
                            type="number"
                            value={habit.todayValue || ""}
                            placeholder="0"
                            className="w-[70px] px-2 py-1 border border-gray-300 rounded text-sm ml-2"
                            onChange={(e) => onUpdate(habit.id, e.target.value)}
                            disabled={habit.completedToday}
                        />
                        {habit.unit && <span className="text-xs text-gray-400">{habit.unit}</span>}
                    </>
                )}
            </div>
            {/* Status */}
            <div className="text-xs text-gray-400 mt-1">
                {habit.type === "checkbox"
                    ? habit.completedToday
                        ? "✅ Done"
                        : "❌ Not done"
                    : null}
            </div>
        </div>
    );
}


function HabitTracker() {
    const { getAccessToken } = useLogto();
    const { isAuthenticated, isLoading, getIdTokenClaims } = useAuth();
    const [habits, setHabits] = useState(initialHabits);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editHabitId, setEditHabitId] = useState(null);
    const [selectedType, setSelectedType] = useState("checkbox");
    const [form, setForm] = useState({
        title: "",
        type: "checkbox",
        unit: "",
        goal: "",
        goalPeriod: "day",
    });
    const habitTitleRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // 載入習慣資料
    useEffect(() => {
        if (!isAuthenticated) return;
        setLoading(true);
        (async () => {
            try {
                const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
                const data = await habitApi.fetchHabits(token);
                setHabits(data);
            } catch (e) {
                console.error('Failed to save habit:', e);
                alert('保存失敗: ' + (e.message || e));
            } finally {
                setLoading(false);
            }
        })();
    }, [isAuthenticated, getIdTokenClaims]);

    // Modal 開關
    const openModal = (edit = false, habit = null) => {
        setModalOpen(true);
        setEditMode(edit);
        setEditHabitId(habit ? habit.id : null);
        if (edit && habit) {
            setForm({
                title: habit.title,
                type: habit.type,
                unit: habit.unit || "",
                goal: habit.goal || "",
                goalPeriod: habit.goalPeriod || "day",
            });
            setSelectedType(habit.type);
        } else {
            setForm({ title: "", type: "checkbox", unit: "", goal: "", goalPeriod: "day" });
            setSelectedType("checkbox");
        }
        setTimeout(() => habitTitleRef.current && habitTitleRef.current.focus(), 50);
    };
    const closeModal = () => {
        setModalOpen(false);
        setEditMode(false);
        setEditHabitId(null);
    };

    // 新增/編輯習慣
    const saveHabit = async () => {
        const title = form.title.trim();
        if (!title) return;
        const unit = selectedType === "number" ? form.unit.trim() : "";
        const goal = Number(form.goal) || 0;
        const goalPeriod = form.goalPeriod;
        const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
        try {
            if (editMode && editHabitId !== null) {
                const updated = await habitApi.updateHabit(token, editHabitId, {
                    title, type: selectedType, unit, goal, goalPeriod
                });
                setHabits((prev) => prev.map(h => h.id === editHabitId ? updated : h));
            } else {
                const created = await habitApi.createHabit(token, {
                    title, type: selectedType, unit, goal, goalPeriod
                });
                setHabits((prev) => [...prev, created]);
            }
            closeModal();
        } catch (e) {
            console.error('Failed to save habit:', e);
            alert('保存失敗: ' + (e.message || e));
        }
    };

    // 完成/取消完成
    const markHabitComplete = async (id) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;
        const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
        try {
            const updated = await habitApi.updateHabit(token, id, {
                completedToday: !habit.completedToday,
                todayValue: habit.type === "checkbox" ? !habit.completedToday : habit.todayValue,
                streak: !habit.completedToday ? (habit.streak || 0) + 1 : 0,
            });
            setHabits((prev) => prev.map(h => h.id === id ? updated : h));
        } catch (e) {
            console.error('Failed to save habit:', e);
            alert('保存失敗: ' + (e.message || e));
        }
    };

    // 數值型習慣調整
    const updateHabitValue = async (id, value) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;
        const todayValue = Number(value);
        const completedToday = todayValue >= (habit.goal || 0);
        const streak = completedToday ? (habit.streak || 0) + 1 : 0;
        const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
        try {
            const updated = await habitApi.updateHabit(token, id, {
                todayValue, completedToday, streak
            });
            setHabits((prev) => prev.map(h => h.id === id ? updated : h));
        } catch (e) {
            console.error('Failed to save habit:', e);
            alert('保存失敗: ' + (e.message || e));
        }
    };

    // 快速加減
    const quickAdd = async (id, amount) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;
        const todayValue = Number(habit.todayValue || 0) + amount;
        const completedToday = todayValue >= (habit.goal || 0);
        const streak = completedToday ? (habit.streak || 0) + 1 : 0;
        const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
        try {
            const updated = await habitApi.updateHabit(token, id, {
                todayValue, completedToday, streak
            });
            setHabits((prev) => prev.map(h => h.id === id ? updated : h));
        } catch (e) {
            console.error('Failed to save habit:', e);
            alert('保存失敗: ' + (e.message || e));
        }
    };

    // 刪除習慣
    const deleteHabit = async (id) => {
        const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
        try {
            await habitApi.deleteHabit(token, id);
            setHabits((prev) => prev.filter(h => h.id !== id));
        } catch (e) {
            console.error('Failed to save habit:', e);
            alert('保存失敗: ' + (e.message || e));
        }
    };

    // Modal type select
    const selectType = (type) => {
        setSelectedType(type);
        setForm((f) => ({ ...f, type }));
    };

    // Modal keyboard shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (!modalOpen) return;
            if (e.key === "Escape") closeModal();
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveHabit();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [modalOpen, saveHabit]);

    // --- Dashboard placeholder ---
    const dashboardBadges = (
        <span className="bg-yellow-300 text-yellow-900 font-semibold px-3 py-1 rounded-full text-xs shadow">🏅 Streak Master</span>
    );
    const dashboardMotivation = (
        <span className="text-green-700 font-medium text-base">Keep going! You are building great habits!</span>
    );
    const dashboardSummary = (
        <span className="text-xs text-gray-500">Weekly/Monthly summaries coming soon!</span>
    );

    // --- Calendar Placeholder ---
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();
    const completedDays = new Set([2, 4, 7, 10, 13, 17, 22, 28]);

    function CalendarPlaceholder() {
        const [viewYear, setViewYear] = useState(today.getFullYear());
        const [viewMonth, setViewMonth] = useState(today.getMonth());

        function getCompletedDays(year, month) {
            const base = (year * 12 + month) % 31;
            const arr = [];
            for (let i = 0; i < 8; i++) arr.push(((base + i * 3) % 28) + 1);
            return new Set(arr);
        }
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startWeekday = firstDay.getDay();
        const completedDays = getCompletedDays(viewYear, viewMonth);

        const weeks = [];
        let day = 1 - startWeekday;
        for (let w = 0; w < 6; w++) {
            const week = [];
            for (let d = 0; d < 7; d++, day++) {
                if (day < 1 || day > daysInMonth) {
                    week.push(<td key={d} className="w-8 h-8 text-center text-gray-300"> </td>);
                } else {
                    const isCompleted = completedDays.has(day);
                    week.push(
                        <td key={d} className="w-8 h-8 text-center">
                            <span className={classNames(
                                "inline-block w-7 h-7 leading-7 rounded-full text-sm font-medium",
                                isCompleted
                                    ? "bg-green-400 text-white shadow"
                                    : "bg-gray-100 text-gray-500"
                            )}>
                                {day}
                            </span>
                        </td>
                    );
                }
            }
            weeks.push(<tr key={w}>{week}</tr>);
        }
        const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });
        return (
            <div className="flex flex-col items-center">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <button
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-500"
                        onClick={() => setViewYear(y => y - 1)}
                        aria-label="Previous Year"
                    >«</button>
                    <button
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-500"
                        onClick={() => setViewMonth(m => m === 0 ? (setViewYear(y => y - 1), 11) : m - 1)}
                        aria-label="Previous Month"
                    >‹</button>
                    <span>{monthName} {viewYear}</span>
                    <button
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-500"
                        onClick={() => setViewMonth(m => m === 11 ? (setViewYear(y => y + 1), 0) : m + 1)}
                        aria-label="Next Month"
                    >›</button>
                    <button
                        className="px-2 py-1 rounded hover:bg-gray-200 text-gray-500"
                        onClick={() => setViewYear(y => y + 1)}
                        aria-label="Next Year"
                    >»</button>
                </div>
                <table className="border-separate border-spacing-1">
                    <thead>
                        <tr className="text-xs text-gray-400">
                            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>{weeks}</tbody>
                </table>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-400"></span> All habits completed
                    <span className="inline-block w-3 h-3 rounded-full bg-gray-100 border border-gray-300"></span> Not completed
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F3EE] text-[#1A1916] font-sans pb-10">
            {/* Header */}
            <header className="bg-white border-b border-black/5 h-[60px] px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#1A1916] rounded-lg flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-white/20 rounded-sm"></div>
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-sm"></div>
                        </div>
                    </div>
                    <span className="font-semibold text-sm tracking-tight">Daily Habits</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => openModal(false, null)}
                        className="bg-[#E24B4A] hover:bg-[#c93d3c] text-white px-4 py-2 rounded-xl text-[13px] font-medium transition-all hover:-translate-y-0.5 shadow-sm flex items-center gap-2"
                    >
                        <span>+</span> 新增習慣
                    </button>
                </div>
            </header>

            {/* Main */}
            <main className="px-8 py-6">
                {/* Dashboard */}
                <section className="bg-[#ddd7cb] rounded-xl px-8 py-6 mb-8 shadow w-full max-w-8xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Progress Dashboard</span>
                        <div className="flex gap-2">{dashboardBadges}</div>
                    </div>
                    <div className="mb-4 grid grid-cols-[auto_1fr] gap-4">
                        <div className="bg-[#f3f1ec] border border-dashed border-gray-300 rounded p-4 flex items-center justify-center">
                            <CalendarPlaceholder />
                        </div>

                        <div className="bg-[#f3f1ec] border border-dashed border-gray-300 rounded p-4 flex items-center justify-center">
                            Streak history coming soon!
                        </div>
                    </div>
                    <div className="mb-2">{dashboardMotivation}</div>
                    <div>{dashboardSummary}</div>
                </section>

                {/* Habits Section */}
                <section className="flex gap-8 flex-wrap">
                    {/* In-Progress */}
                    <div className="bg-white rounded-2xl p-6 min-w-[220px] shadow flex-1">
                        <div className="text-base font-semibold text-gray-500 mb-2">In-Progress</div>
                        {habits.filter((h) => !h.completedToday).length === 0 && (
                            <div className="text-gray-400 text-sm">Great job! You are all done for today!</div>
                        )}
                        {habits.filter((h) => !h.completedToday).map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onEdit={() => openModal(true, habit)}
                                onMarkComplete={() => markHabitComplete(habit.id)}
                                onQuickAdd={quickAdd}
                                onUpdate={updateHabitValue}
                            />
                        ))}
                    </div>
                    {/* Done */}
                    <div className="bg-[#EFEDE8] rounded-2xl p-6 min-w-[220px] shadow flex-1 opacity-80">
                        <div className="text-base font-semibold text-gray-500 mb-2">Done</div>
                        {habits.filter((h) => h.completedToday).length === 0 && (
                            <div className="text-gray-400 text-sm">No completed habits</div>
                        )}
                        {habits.filter((h) => h.completedToday).map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onEdit={() => openModal(true, habit)}
                                onMarkComplete={() => markHabitComplete(habit.id)}
                                onQuickAdd={quickAdd}
                                onUpdate={updateHabitValue}
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="bg-white rounded-2xl p-8 w-[380px] max-w-[95vw] shadow-xl border border-gray-200 animate-[modalIn_0.2s_ease]">
                        <div className="text-lg font-semibold mb-6">{editMode ? "Edit Habit" : "Add New Habit"}</div>
                        <div className="mb-4">
                            <label className="block text-xs font-mono font-semibold uppercase text-gray-500 mb-1">Habit Name</label>
                            <input
                                ref={habitTitleRef}
                                className="w-full font-sans text-sm text-black bg-[#F5F3EE] border border-gray-300 rounded px-3 py-2 outline-none focus:border-gray-500 focus:shadow"
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                placeholder="e.g., Drink water"
                                onKeyDown={(e) => { if (e.key === "Enter") saveHabit(); }}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-mono font-semibold uppercase text-gray-500 mb-1">Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <div
                                    className={classNames(
                                        "py-2 px-2 rounded text-sm font-medium text-center cursor-pointer border",
                                        selectedType === "checkbox"
                                            ? "bg-blue-100 text-blue-900 border-blue-500 shadow"
                                            : "bg-[#EFEDE8] text-gray-400 border-gray-300 hover:border-gray-400"
                                    )}
                                    onClick={() => selectType("checkbox")}
                                >
                                    Yes/No
                                </div>
                                <div
                                    className={classNames(
                                        "py-2 px-2 rounded text-sm font-medium text-center cursor-pointer border",
                                        selectedType === "number"
                                            ? "bg-blue-100 text-blue-900 border-blue-500 shadow"
                                            : "bg-[#EFEDE8] text-gray-400 border-gray-300 hover:border-gray-400"
                                    )}
                                    onClick={() => selectType("number")}
                                >
                                    Quantity
                                </div>
                            </div>
                        </div>
                        {selectedType === "number" && (
                            <div className="mb-4">
                                <label className="block text-xs font-mono font-semibold uppercase text-gray-500 mb-1">Unit</label>
                                <input
                                    className="w-full font-sans text-sm text-black bg-[#F5F3EE] border border-gray-300 rounded px-3 py-2 outline-none focus:border-gray-500 focus:shadow"
                                    type="text"
                                    value={form.unit}
                                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                                    placeholder="e.g., glasses, minutes"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-xs font-mono font-semibold uppercase text-gray-500 mb-1">Goal</label>
                            <div className="flex items-center gap-2">
                                <input
                                    className="w-[60px] font-sans text-sm text-black bg-[#F5F3EE] border border-gray-300 rounded px-2 py-2 outline-none focus:border-gray-500 focus:shadow"
                                    type="number"
                                    value={form.goal}
                                    onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
                                    placeholder="e.g., 8"
                                />
                                <span className="text-xs text-gray-400">{selectedType === "number" ? (form.unit.trim() || "unit") : ""}</span>
                                <select
                                    className="font-sans text-xs border border-gray-300 rounded px-2 py-2 bg-[#F5F3EE]"
                                    value={form.goalPeriod}
                                    onChange={(e) => setForm((f) => ({ ...f, goalPeriod: e.target.value }))}
                                >
                                    <option value="day">per day</option>
                                    <option value="week">per week</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                            {/* LEFT: Delete button (only in edit mode) */}
                            {editMode && (
                                <button
                                    className="px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50 transition"
                                    onClick={async () => {
                                        const confirmDelete = window.confirm("Are you sure you want to delete this habit?");
                                        if (!confirmDelete) return;

                                        await deleteHabit(editHabitId);
                                        closeModal();
                                    }}
                                >
                                    Delete
                                </button>
                            )}

                            {/* RIGHT: Cancel + Save */}
                            <div className="flex gap-2 ml-auto">
                                <button
                                    className="px-4 py-2 rounded border border-gray-300 bg-transparent text-gray-500 font-medium hover:bg-[#EFEDE8] hover:text-black transition"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2 rounded bg-black text-white font-medium hover:bg-gray-800 transition"
                                    onClick={saveHabit}
                                >
                                    Save Habit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HabitPage() {
    return (
        <div className="min-h-screen bg-[#F5F3EE] text-[#1A1916] font-sans pb-10">
            <HabitTracker />
        </div>
    );
}