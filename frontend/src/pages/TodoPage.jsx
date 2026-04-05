import React, { useState, useEffect } from 'react';

export default function TaskMatrixPage() {
  // --- 狀態管理 ---
  const [tasks, setTasks] = useState([
    { id: 1, title: '修復登入頁面 bug', q: 'q1', date: '2026-03-18', tags: ['工程'], done: false },
    { id: 2, title: '準備季度報告', q: 'q2', date: '2026-03-25', tags: ['管理'], done: false },
    { id: 3, title: '回覆重要 Slack 訊息', q: 'q3', date: '', tags: [], done: false },
    { id: 4, title: '整理桌面資料夾', q: 'q4', date: '', tags: ['雜事'], done: false },
  ]);
  const [allTags, setAllTags] = useState(['工程', '管理', '策略', '雜事', '設計', '行銷']);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 新增任務的暫存狀態 ---
  const [newTask, setNewTask] = useState({
    title: '',
    q: 'q1',
    date: '',
    tags: []
  });
  const [customTag, setCustomTag] = useState('');

  // --- 輔助函式：日期標籤 ---
  const getDateLabel = (d) => {
    if (!d) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dd = new Date(d + 'T00:00:00'); dd.setHours(0, 0, 0, 0);
    const diff = Math.round((dd - today) / 86400000);
    if (diff < 0) return { text: `⚠ 逾期 ${Math.abs(diff)}天`, cls: 'text-red-500' };
    if (diff === 0) return { text: '● 今天到期', cls: 'text-orange-500' };
    if (diff <= 3) return { text: `${diff}天後到期`, cls: 'text-orange-500' };
    return { text: d, cls: 'text-gray-400' };
  };

  // --- 邏輯處理 ---
  const toggleDone = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveTask = () => {
    if (!newTask.title.trim()) return;
    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      done: false
    };
    setTasks(prev => [...prev, taskToAdd]);
    setIsModalOpen(false);
    setNewTask({ title: '', q: 'q1', date: '', tags: [] });
  };

  const toggleTagInNewTask = (tag) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  // --- 渲染子組件 ---
  const Quadrant = ({ qKey, label, colorClass, bgColor, borderColor, dotColor }) => {
    const filteredTasks = tasks.filter(t => 
      t.q === qKey && (activeFilter === 'all' || t.tags.includes(activeFilter))
    );

    return (
      <div className={`rounded-2xl p-4 flex flex-col gap-2 min-h-[220px] border transition-shadow hover:shadow-md ${bgColor} ${borderColor}`}>
        <div className="flex items-center justify-between mb-1">
          <div className={`flex items-center gap-2 text-xs font-bold ${colorClass}`}>
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            {label}
          </div>
          <span className="text-[10px] font-mono bg-black/5 px-2 py-0.5 rounded-full text-gray-500">
            {filteredTasks.length}
          </span>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-xs text-gray-400 text-center py-4 italic">目前沒有任務</div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`bg-white rounded-xl p-3 border border-black/5 shadow-sm transition-all hover:-translate-y-0.5 flex flex-col gap-1.5 ${task.done ? 'opacity-40' : ''}`}>
              <div className="flex items-start gap-2">
                <button 
                  onClick={() => toggleDone(task.id)}
                  className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${task.done ? 'bg-gray-800 border-gray-800' : 'border-gray-300'}`}
                >
                  {task.done && <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5"></div>}
                </button>
                <span className={`flex-1 text-[13px] leading-snug break-words ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </span>
                <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 text-lg leading-none px-1">×</button>
              </div>
              {(task.tags.length > 0 || task.date) && (
                <div className="flex flex-wrap gap-1.5 pl-7">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">{tag}</span>
                  ))}
                  {task.date && (
                    <span className={`text-[10px] font-mono ${getDateLabel(task.date)?.cls}`}>
                      {getDateLabel(task.date)?.text}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#1A1916] font-sans pb-10">
      {/* Header */}
      <header className="bg-white border-b border-black/5 h-[60px] px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#1A1916] rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white/50 rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white/50 rounded-sm"></div>
              <div className="w-1.5 h-1.5 bg-white/20 rounded-sm"></div>
            </div>
          </div>
          <span className="font-semibold text-sm tracking-tight">Task Matrix</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">篩選:</span>
            <div className="flex gap-1.5">
              {['all', ...allTags].map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`text-[11px] px-3 py-1 rounded-full border transition-all ${activeFilter === tag ? 'bg-gray-800 text-white border-gray-800' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400'}`}
                >
                  {tag === 'all' ? '全部' : tag}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E24B4A] hover:bg-[#c93d3c] text-white px-4 py-2 rounded-xl text-[13px] font-medium transition-all hover:-translate-y-0.5 shadow-sm flex items-center gap-2"
          >
            <span>+</span> 新增任務
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="flex gap-5 mb-4 text-[12px] font-medium text-gray-500">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400"></span> 總計 {tasks.length}</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> 已完成 {tasks.filter(t=>t.done).length}</div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-[30px_1fr_1fr] grid-rows-[30px_1fr_1fr] gap-3">
          {/* Top Axis */}
          <div className="col-start-2 flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A]"></span> 急迫
          </div>
          <div className="col-start-3 flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4820A]"></span> 不急迫
          </div>

          {/* Side Axis 1 */}
          <div className="row-start-2 flex items-center justify-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">重要</span>
          </div>
          <Quadrant qKey="q1" label="立即處理" colorClass="text-[#6B1E1D]" bgColor="bg-[#FFF0EE]" borderColor="border-[#F5B8B7]" dotColor="bg-[#E24B4A]" />
          <Quadrant qKey="q2" label="排程規劃" colorClass="text-[#6B3E05]" bgColor="bg-[#FFFBF0]" borderColor="border-[#F5D99A]" dotColor="bg-[#D4820A]" />

          {/* Side Axis 2 */}
          <div className="row-start-3 flex items-center justify-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">不重要</span>
          </div>
          <Quadrant qKey="q3" label="委派他人" colorClass="text-[#103270]" bgColor="bg-[#EEF4FF]" borderColor="border-[#B3CEF5]" dotColor="bg-[#2970DD]" />
          <Quadrant qKey="q4" label="考慮刪除" colorClass="text-[#1A4D2E]" bgColor="bg-[#F0FBF4]" borderColor="border-[#A8DDB8]" dotColor="bg-[#2E8B57]" />
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-2xl border border-black/5 animate-in fade-in zoom-in duration-200">
            <h2 className="text-base font-bold mb-5">新增任務</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">任務名稱</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-black/5 transition-all"
                  placeholder="輸入任務描述..."
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">象限</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {id:'q1', n:'急迫 + 重要'}, {id:'q2', n:'不急迫 + 重要'},
                    {id:'q3', n:'急迫 + 不重要'}, {id:'q4', n:'不急迫 + 不重要'}
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setNewTask({...newTask, q: opt.id})}
                      className={`text-[11px] p-2.5 rounded-xl border-2 transition-all font-medium ${newTask.q === opt.id ? 'border-gray-800 bg-gray-50' : 'border-transparent bg-gray-100 text-gray-400'}`}
                    >
                      {opt.n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">分類標籤</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTagInNewTask(tag)}
                      className={`text-[11px] px-3 py-1 rounded-full border transition-all ${newTask.tags.includes(tag) ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-100 text-gray-500 border-transparent hover:border-gray-300'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] text-gray-400 font-medium hover:text-gray-600">取消</button>
              <button onClick={handleSaveTask} className="bg-gray-800 text-white px-5 py-2 rounded-xl text-[13px] font-medium hover:bg-black transition-all shadow-md">儲存任務</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
