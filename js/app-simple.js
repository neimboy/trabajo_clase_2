/**
 * TaskFlow - Versión Simple (sin módulos)
 * Para probar si funciona el modo oscuro
 */

const CONFIG = {
  storageKey: 'taskflow_tasks',
  priorityLevels: {
    alta: { color: '#ef4444', emoji: '🔴', valor: 3 },
    media: { color: '#f97316', emoji: '🟠', valor: 2 },
    baja: { color: '#22c55e', emoji: '🟢', valor: 1 }
  }
};

let tasks = [];
let currentFilter = 'all';
let searchTerm = '';
let isDarkMode = localStorage.getItem('taskflow_theme') === 'dark';

// Elementos DOM
const elements = {
  taskNameInput: document.getElementById('taskName'),
  prioritySelect: document.getElementById('taskPriority'),
  addTaskBtn: document.getElementById('addTaskBtn'),
  tasksContainer: document.getElementById('tasksContainer'),
  themeToggle: document.getElementById('themeToggle'),
  totalTasksDisplay: document.getElementById('totalTasks'),
  progressDisplay: document.getElementById('progressPercent'),
  progressFill: document.getElementById('progressFill'),
  highPriorityDisplay: document.getElementById('highPriorityCount'),
  searchInput: document.getElementById('searchInput'),
  filterButtons: document.querySelectorAll('[data-filter]')
};

// Utilidades
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isValidTaskName(name) {
  return name && name.trim().length > 0 && name.trim().length <= 100;
}

function getCurrentDate() {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

// Gestión de estado
function loadTasks() {
  try {
    const stored = localStorage.getItem(CONFIG.storageKey);
    tasks = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error al guardar tareas:', error);
  }
}

function addTask(name, priority) {
  if (!isValidTaskName(name)) {
    return false;
  }

  const newTask = {
    id: generateId(),
    name: name.trim(),
    priority: priority,
    completed: false,
    createdAt: getCurrentDate()
  };

  tasks.unshift(newTask);
  saveTasks();
  return true;
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
}

function toggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
  }
}

function getFilteredTasks() {
  let filtered = tasks;

  if (currentFilter === 'pending') {
    filtered = filtered.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filtered = filtered.filter(task => task.completed);
  }

  if (searchTerm) {
    filtered = filtered.filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return filtered;
}

function getStatistics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const highPriority = tasks.filter(t => t.priority === 'alta' && !t.completed).length;

  return {
    total,
    completed,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    highPriority
  };
}

// Renderer
function createTaskElement(task) {
  const priority = CONFIG.priorityLevels[task.priority];
  const taskEl = document.createElement('div');
  taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
  taskEl.dataset.taskId = task.id;

  taskEl.innerHTML = `
    <div class="task-content">
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-info">
        <div class="task-name">${escapeHtml(task.name)}</div>
        <div class="task-meta">
          <span class="task-priority" style="color: ${priority.color}">
            ${priority.emoji} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span class="task-date">${task.createdAt}</span>
        </div>
      </div>
    </div>
    <button class="task-delete" aria-label="Eliminar tarea">🗑️</button>
  `;

  return taskEl;
}

function renderTasks() {
  const filtered = getFilteredTasks();
  elements.tasksContainer.innerHTML = '';

  if (filtered.length === 0) {
    elements.tasksContainer.innerHTML = `
      <div class="empty-state">
        <p>📭 No hay tareas para mostrar</p>
      </div>
    `;
    return;
  }

  filtered.forEach(task => {
    const taskEl = createTaskElement(task);
    elements.tasksContainer.appendChild(taskEl);
  });

  updateStatistics();
}

function updateStatistics() {
  const stats = getStatistics();

  elements.totalTasksDisplay.textContent = stats.total;
  elements.progressDisplay.textContent = `${stats.progress}%`;
  elements.progressFill.style.width = `${stats.progress}%`;
  elements.highPriorityDisplay.textContent = stats.highPriority;
}

function updateTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

// Event handlers
function handleAddTask() {
  const name = elements.taskNameInput.value;
  const priority = elements.prioritySelect.value;

  if (addTask(name, priority)) {
    elements.taskNameInput.value = '';
    renderTasks();
    showNotification('¡Tarea agregada!', 'success');
  } else {
    showNotification('Por favor, ingresa un nombre válido', 'warning');
  }
}

function handleTaskToggle(taskEl) {
  const taskId = taskEl.dataset.taskId;
  toggleTask(taskId);
  renderTasks();
}

function handleTaskDelete(taskEl) {
  const taskId = taskEl.dataset.taskId;
  if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    deleteTask(taskId);
    renderTasks();
    showNotification('Tarea eliminada', 'info');
  }
}

function handleThemeToggle() {
  console.log('Manejando cambio de tema...');

  const isDark = !isDarkMode;
  console.log('Nuevo estado isDark:', isDark);

  isDarkMode = isDark;
  localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
  updateTheme(isDark);
  elements.themeToggle.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';

  console.log('Tema cambiado a:', isDark ? 'dark' : 'light');
}

function handleFilterChange(button) {
  elements.filterButtons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  currentFilter = button.dataset.filter;
  renderTasks();
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

// Inicialización
function init() {
  console.log('Inicializando TaskFlow (versión simple)...');
  console.log('Navegador:', navigator.userAgent);

  loadTasks();

  updateTheme(isDarkMode);
  elements.themeToggle.textContent = isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro';

  renderTasks();

  // Event listeners
  elements.addTaskBtn.addEventListener('click', handleAddTask);
  elements.taskNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTask();
  });

  elements.themeToggle.addEventListener('click', handleThemeToggle);

  elements.tasksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
      handleTaskToggle(e.target.closest('.task-item'));
    }
    if (e.target.classList.contains('task-delete')) {
      handleTaskDelete(e.target.closest('.task-item'));
    }
  });

  elements.filterButtons.forEach(btn => {
    btn.addEventListener('click', () => handleFilterChange(btn));
  });

  elements.searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTasks();
  });

  console.log('TaskFlow inicializado correctamente');
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', init);