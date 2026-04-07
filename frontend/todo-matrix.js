/* ── Tag colour palette ── */
const PALETTES = [
  { bg: '#FFF0EE', color: '#6B1E1D' },
  { bg: '#FFFBF0', color: '#6B3E05' },
  { bg: '#EEF4FF', color: '#103270' },
  { bg: '#F0FBF4', color: '#1A4D2E' },
  { bg: '#F5F0FF', color: '#3D1F7A' },
  { bg: '#FFF0F8', color: '#6B0E40' },
  { bg: '#F0FFFE', color: '#0A4040' },
];
function tagPalette(name) {
  const idx = allTags.indexOf(name);
  return PALETTES[(idx < 0 ? allTags.length : idx) % PALETTES.length];
}

/* ── State ── */
let tasks = [];
const API_URL = 'http://localhost:3000/api/tasks';

// 初始化改為從 API 讀取
async function loadTasks() {
  const res = await fetch(API_URL);
  tasks = await res.json();
  // 修正後端產生的 _id 與前端對接
  tasks = tasks.map(t => ({ ...t, id: t._id })); 
  render();
}

// 頁面載入時執行
loadTasks();
let allTags     = ['工程', '管理', '策略', '雜事', '設計', '行銷'];
let selectedQ   = 'q1';
let selectedTags = [];
let activeFilter = 'all';
let nextId = 20;

/* ── Date label helper ── */
function dateLabel(d) {
  if (!d) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd    = new Date(d + 'T00:00:00'); dd.setHours(0, 0, 0, 0);
  const diff  = Math.round((dd - today) / 86400000);
  if (diff < 0)  return { text: '⚠ 逾期 ' + Math.abs(diff) + '天', cls: 'overdue' };
  if (diff === 0) return { text: '● 今天到期',                        cls: 'soon' };
  if (diff <= 3)  return { text: diff + '天後到期',                   cls: 'soon' };
  return { text: d, cls: '' };
}

/* ── Render ── */
function render() {
  renderStats();
  renderFilterPills();
  ['q1', 'q2', 'q3', 'q4'].forEach(renderQ);
}

function renderStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => !t.done && t.date && dateLabel(t.date)?.cls === 'overdue').length;
  document.getElementById('statsBar').innerHTML = `
    <div class="stat"><span class="stat-dot" style="background:#888"></span>總計<span class="stat-num">${total}</span></div>
    <div class="stat"><span class="stat-dot" style="background:#2E8B57"></span>完成<span class="stat-num">${done}</span></div>
    <div class="stat"><span class="stat-dot" style="background:#E24B4A"></span>逾期<span class="stat-num">${overdue}</span></div>
  `;
}

function renderFilterPills() {
  const c = document.getElementById('filterPills');
  c.innerHTML = '';
  ['all', ...allTags].forEach(tag => {
    const sp = document.createElement('span');
    sp.className  = 'pill' + (activeFilter === tag ? ' active' : '');
    sp.textContent = tag === 'all' ? '全部' : tag;
    sp.onclick = () => { activeFilter = tag; render(); };
    c.appendChild(sp);
  });
}

function renderQ(qKey) {
  const el = document.getElementById(qKey);
  [...el.querySelectorAll('.task-card, .empty-msg')].forEach(n => n.remove());
  const filtered = tasks.filter(t =>
    t.q === qKey && (activeFilter === 'all' || t.tags.includes(activeFilter))
  );
  document.getElementById('cnt-' + qKey).textContent = filtered.length;
  if (filtered.length === 0) {
    const em = document.createElement('div');
    em.className   = 'empty-msg';
    em.textContent = '目前沒有任務';
    el.appendChild(em);
  } else {
    filtered.forEach(t => el.appendChild(makeCard(t)));
  }
}

function makeCard(t) {
  const card = document.createElement('div');
  card.className = 'task-card' + (t.done ? ' done' : '');

  const row = document.createElement('div');
  row.className = 'task-row';

  const chk = document.createElement('div');
  chk.className = 'check-btn' + (t.done ? ' checked' : '');
  // 修改 makeCard 內的勾選邏輯
  chk.onclick = async () => {
    const newStatus = !t.done;
    await fetch(`${API_URL}/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: newStatus })
    });
    t.done = newStatus;
    render();
  };

// 修改 makeCard 內的刪除邏輯
del.onclick = async () => {
  await fetch(`${API_URL}/${t.id}`, { method: 'DELETE' });
  tasks = tasks.filter(x => x.id !== t.id);
  render();
};

  const titleWrap = document.createElement('div');
  titleWrap.className = 'task-title-wrap';
  const titleEl = document.createElement('span');
  titleEl.className  = 'task-title' + (t.done ? ' done-text' : '');
  titleEl.textContent = t.title;
  titleWrap.appendChild(titleEl);

  const del = document.createElement('button');
  del.className  = 'task-del';
  del.textContent = '×';
  del.onclick = () => { tasks = tasks.filter(x => x.id !== t.id); render(); };

  row.append(chk, titleWrap, del);
  card.appendChild(row);

  if (t.tags.length || t.date) {
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    t.tags.forEach(tag => {
      const p = tagPalette(tag);
      const b = document.createElement('span');
      b.className        = 'tag-badge';
      b.style.background = p.bg;
      b.style.color      = p.color;
      b.textContent      = tag;
      meta.appendChild(b);
    });
    if (t.date) {
      const dl = dateLabel(t.date);
      if (dl) {
        const d = document.createElement('span');
        d.className   = 'date-badge ' + dl.cls;
        d.textContent = dl.text;
        meta.appendChild(d);
      }
    }
    card.appendChild(meta);
  }
  return card;
}

/* ── Modal ── */
function openModal() {
  selectedQ    = 'q1';
  selectedTags = [];
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDate').value  = '';
  renderQPicks();
  renderTagCloud();
  document.getElementById('modalOverlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('taskTitle').focus(), 50);
}
function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function selectQ(q) { selectedQ = q; renderQPicks(); }
function renderQPicks() {
  const m = { q1: 'opt-q1', q2: 'opt-q2', q3: 'opt-q3', q4: 'opt-q4' };
  ['q1', 'q2', 'q3', 'q4'].forEach(q => {
    document.querySelector(`.q-pick[data-q="${q}"]`).className =
      'q-pick ' + (q === selectedQ ? m[q] : 'unsel');
  });
}

function renderTagCloud() {
  const c = document.getElementById('tagCloud');
  c.innerHTML = '';
  allTags.forEach(tag => {
    const sp = document.createElement('span');
    sp.className  = 'tag-opt' + (selectedTags.includes(tag) ? ' selected' : '');
    sp.textContent = tag;
    sp.onclick = () => {
      if (selectedTags.includes(tag)) selectedTags = selectedTags.filter(t => t !== tag);
      else selectedTags.push(tag);
      renderTagCloud();
    };
    c.appendChild(sp);
  });
}

function addCustomTag() {
  const inp = document.getElementById('newTagInput');
  const val = inp.value.trim();
  if (!val) return;
  if (!allTags.includes(val)) allTags.push(val);
  if (!selectedTags.includes(val)) selectedTags.push(val);
  inp.value = '';
  renderTagCloud();
}

async function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  if (!title) return;

  const newTask = {
    title,
    q: selectedQ,
    date: document.getElementById('taskDate').value,
    tags: [...selectedTags],
    done: false,
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });
  
  const savedTask = await res.json();
  tasks.push({ ...savedTask, id: savedTask._id });
  closeModal();
  render();
}

/* ── Keyboard & overlay dismiss ── */
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' &&
      !document.getElementById('modalOverlay').classList.contains('hidden')) saveTask();
});
document.getElementById('taskTitle').addEventListener('keydown',  e => { if (e.key === 'Enter') saveTask(); });
document.getElementById('newTagInput').addEventListener('keydown', e => { if (e.key === 'Enter') addCustomTag(); });

/* ── Init ── */
render();
