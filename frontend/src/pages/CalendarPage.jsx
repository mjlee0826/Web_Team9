import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Loader2, X, Trash2 } from 'lucide-react';
import { useLogto } from '@logto/react';
import * as calendarApi from '../services/calendarApi'; 

/**
 * CalendarPage Component
 * A futuristic dashboard for managing tasks and events.
 * Handles month-based navigation, day selection, and CRUD operations for events.
 */
export default function CalendarPage() {
    const { getAccessToken } = useLogto();
    
    // ==========================================
    // State Management
    // ==========================================
    
    // currentDate determines which year/month is currently being displayed
    const [currentDate, setCurrentDate] = useState(new Date());
    // selectedDate marks the specific day clicked by the user
    const [selectedDate, setSelectedDate] = useState(new Date());
    // events is a dictionary: { "YYYY-MM-DD": [EventObject, ...] }
    const [events, setEvents] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Modal and Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', time: '', type: 'task' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ==========================================
    // Calendar Logic (Grid Calculation)
    // ==========================================
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); 
    
    // Find the starting weekday of the month (0 = Sunday, 1 = Monday...)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Get total days in the current month by setting day to 0 of the next month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate an array for the grid: leading blanks + day numbers
    const blanks = Array.from({ length: firstDayOfMonth }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarGrid = [...blanks, ...days];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    /**
     * Formats a Date object into a standardized string.
     * @param {Date} d 
     * @returns {string} Format: YYYY-MM-DD
     */
    const getFormattedDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const selectedDateStr = getFormattedDate(selectedDate);
    const todayStr = getFormattedDate(new Date());
    // Filter events for the currently highlighted day
    const selectedEvents = events[selectedDateStr] || [];

    // ==========================================
    // API Interactions & Side Effects
    // ==========================================
    
    /**
     * Fetches all events from the backend.
     * Note: Currently fetches all and processes on frontend; 
     * consider adding year/month filters to the API later.
     */
    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE); 
            const data = await calendarApi.fetchEvents(token);
            setEvents(data);
        } catch (error) {
            console.error("Failed to load events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Trigger re-fetch whenever the displayed year or month changes
    useEffect(() => {
        loadEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month]);

    /**
     * Handles the submission of a new task.
     * Uses 'isSubmitting' as a guard to prevent duplicate network requests.
     */
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
            const dateStr = getFormattedDate(selectedDate);
            
            await calendarApi.createEvent(token, dateStr, newTask);
            
            // Sync UI with backend data
            await loadEvents();
            setIsModalOpen(false);
            setNewTask({ title: '', time: '', type: 'task' });
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles the deletion of an existing task.
     * Requires user confirmation to prevent accidental loss of data.
     */
    const handleDeleteTask = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const token = await getAccessToken(import.meta.env.VITE_LOGTO_API_RESOURCE);
            const dateStr = getFormattedDate(selectedDate);
            
            await calendarApi.deleteEvent(token, dateStr, eventId);
            
            // Refresh the event map after successful deletion
            await loadEvents();
        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Delete failed, please try again.");
        }
    };

    // ==========================================
    // UI Interaction Handlers
    // ==========================================
    
    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleDayClick = (day) => {
        if (day) setSelectedDate(new Date(year, month, day));
    };

    // ==========================================
    // Component Rendering
    // ==========================================
    return (
        <div className="min-h-screen w-full bg-[#09090b] text-neutral-300 font-sans p-4 lg:p-8 flex flex-col lg:flex-row gap-8 selection:bg-cyan-500/30">
            
            {/* ⬅️ Left Column: Main Calendar Grid Section */}
            <div className="flex-[2] flex flex-col">
                {/* Header Controls */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                            <CalendarIcon size={24} className="text-cyan-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-wider text-white">
                            {year} <span className="text-cyan-500 font-light">/ {String(month + 1).padStart(2, '0')}</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {isLoading && <Loader2 size={18} className="text-cyan-500 animate-spin mr-4" />}
                        <button onClick={handlePrevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                            <ChevronLeft size={20} className="text-neutral-400" />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                            <ChevronRight size={20} className="text-neutral-400" />
                        </button>
                    </div>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-4 mb-4 text-center font-mono text-xs text-neutral-500 uppercase tracking-widest">
                    {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-3 lg:gap-4 flex-1">
                    {calendarGrid.map((day, index) => {
                        if (!day) return <div key={`blank-${index}`} className="min-h-[80px] lg:min-h-[100px] rounded-xl bg-white/[0.01]"></div>;

                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = dateStr === todayStr;
                        const isSelected = dateStr === selectedDateStr;
                        const dayEvents = events[dateStr] || [];

                        return (
                            <div 
                                key={dateStr}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    relative flex flex-col p-3 min-h-[80px] lg:min-h-[100px] rounded-xl cursor-pointer transition-all duration-200
                                    ${isSelected ? 'bg-cyan-500/10 border border-cyan-500/50' : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10'}
                                    ${isToday && !isSelected ? 'ring-1 ring-cyan-500/30' : ''}
                                `}
                            >
                                <span className={`text-sm font-semibold mb-2 ${isToday ? 'text-cyan-400' : 'text-neutral-400'}`}>
                                    {day}
                                </span>
                                
                                {/* Tiny event badges within the cell */}
                                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                    {dayEvents.map(ev => (
                                        <div key={ev.id} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/5">
                                            {ev.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ➡️ Right Column: Event Details Sidebar */}
            <div className="flex-1 max-w-sm flex flex-col bg-[#040405] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                
                <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <p className="text-sm font-mono text-cyan-500 mb-8">System Sync: ONLINE</p>

                {/* List of events for the selected day */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-neutral-600 font-mono text-sm border border-dashed border-white/10 rounded-xl p-8">
                            No active tasks detected.
                        </div>
                    ) : (
                        selectedEvents.map(ev => (
                            <div key={ev.id} className="group relative p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors">
                                <h3 className="text-white font-medium mb-1 truncate pr-8">{ev.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                                    <Clock size={12} className="text-cyan-600" />
                                    <span>{ev.time || '--:--'}</span>
                                    <span className="ml-auto uppercase px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded text-[10px]">
                                        {ev.type || 'TASK'}
                                    </span>
                                </div>

                                {/* Trash icon button visible only on hover */}
                                <button 
                                    onClick={() => handleDeleteTask(ev.id)}
                                    className="absolute top-4 right-4 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 w-full flex items-center justify-center gap-2 p-3 bg-white text-black rounded-xl font-bold text-sm transition-all hover:bg-neutral-200 active:scale-[0.98]">
                    <Plus size={16} />
                    <span>Append Task</span>
                </button>
            </div>

            {/* 🌟 Task Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <form 
                        onSubmit={handleCreateTask}
                        className="bg-[#09090b] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Append Task</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-cyan-500 mb-1">TASK TITLE</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    placeholder="Enter task name..."
                                />
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-mono text-cyan-500 mb-1">TIME</label>
                                    <input 
                                        type="time" 
                                        value={newTask.time}
                                        onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-mono text-cyan-500 mb-1">TYPE</label>
                                    <select 
                                        value={newTask.type}
                                        onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="task" className="bg-[#09090b]">Task</option>
                                        <option value="meeting" className="bg-[#09090b]">Meeting</option>
                                        <option value="work" className="bg-[#09090b]">Work</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 p-3 rounded-xl font-bold text-sm text-neutral-400 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting || !newTask.title}
                                className="flex-1 p-3 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-colors disabled:opacity-50 flex justify-center items-center"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}