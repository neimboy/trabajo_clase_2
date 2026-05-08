// js/app.js

// ==================== MODELO DE DATOS ====================
let tasks = [];
let currentFilter = 'all';     // 'all', 'pending', 'completed'
let searchTerm = '';

// ==================== REFERENCIAS DOM ====================
const tasksContainer = document.getElementById('tasksContainer');
const taskNameInput = document.getElementById('taskName');
const taskPrioritySelect = document.getElementById('taskPriority');
const addTaskBtn = document.getElementById('addTaskBtn');
const totalTasksSpan = document.getElementById('totalTasks');
const progressPercentSpan = document.getElementById('progressPercent');
const progressFillDiv = document.getElementById('progressFill');
const highPriorityCountSpan = document.getElementById('highPriorityCount');
const themeToggleBtn = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

// ==================== PERSISTENCIA (localStorage) ====================
const saveToLocalStorage = () => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
};

const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('taskflow_tasks');
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        // Datos de ejemplo para mostrar que funciona
        tasks = [
            { id: Date.now() + 1, name: '✅ Revisar documentación', priority: 'alta', completed: true },
            { id: Date.now() + 2, name: '📌 Implementar localStorage', priority: 'alta', completed: false },
            { id: Date.now() + 3, name: '🎨 Mejorar estilos CSS', priority: 'media', completed: false },
            { id: Date.now() + 4, name: '📱 Hacer responsive', priority: 'baja', completed: false }
        ];
        saveToLocalStorage();
    }
};

// ==================== FUNCIONES DE TAREAS ====================
const generateId = () => Date.now() + Math.random() * 10000;

const addTask = () => {
    const name = taskNameInput.value.trim();
    if (!name) {
        alert('Por favor, escribe el nombre de la tarea');
        return;
    }
    
    const priority = taskPrioritySelect.value;
    const newTask = {
        id: generateId(),
        name: name,
        priority: priority,
        completed: false
    };
    
    tasks.unshift(newTask);  // Agregar al inicio
    taskNameInput.value = '';
    saveToLocalStorage();
    renderTasks();
};

const deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
};

const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveToLocalStorage();
        renderTasks();
    }
};

// ==================== FILTROS Y BÚSQUEDA ====================
const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Filtro por estado (pendiente/completada)
    if (currentFilter === 'pending') {
        filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
    }
    
    // Filtro por búsqueda
    if (searchTerm.trim() !== '') {
        filtered = filtered.filter(task => 
            task.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    return filtered;
};

// ==================== RENDERIZADO DE TAREAS ====================
const getPriorityBadge = (priority) => {
    const badges = {
        alta: '<span class="badge alta">🔴 Alta</span>',
        media: '<span class="badge media">🟠 Media</span>',
        baja: '<span class="badge baja">🟢 Baja</span>'
    };
    return badges[priority] || badges.media;
};

const renderTasks = () => {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <span>📭</span>
                <p>No hay tareas que coincidan con los filtros</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    let tasksHTML = '';
    filteredTasks.forEach(task => {
        const completedClass = task.completed ? 'task-completed' : '';
        tasksHTML += `
            <div class="task-card ${completedClass}" data-id="${task.id}">
                <div class="task-info">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-name">${escapeHtml(task.name)}</span>
                    ${getPriorityBadge(task.priority)}
                </div>
                <button class="delete-btn" data-id="${task.id}">🗑️</button>
            </div>
        `;
    });
    
    tasksContainer.innerHTML = tasksHTML;
    
    // Agregar event listeners a los checkboxes y botones eliminar
    document.querySelectorAll('.task-checkbox').forEach((checkbox, index) => {
        const taskCard = checkbox.closest('.task-card');
        const taskId = parseFloat(taskCard.dataset.id);
        checkbox.addEventListener('change', () => toggleComplete(taskId));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        const taskId = parseFloat(btn.dataset.id);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(taskId);
        });
    });
    
    updateStats();
};

// ==================== ESTADÍSTICAS Y DASHBOARD ====================
const updateStats = () => {
    // Total de tareas
    const total = tasks.length;
    totalTasksSpan.textContent = total;
    
    // Tareas completadas
    const completedCount = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
    progressPercentSpan.textContent = `${percent}%`;
    progressFillDiv.style.width = `${percent}%`;
    
    // Tareas urgentes (prioridad alta y NO completadas)
    const urgentCount = tasks.filter(t => t.priority === 'alta' && !t.completed).length;
    highPriorityCountSpan.textContent = urgentCount;
};

// ==================== TEMA OSCURO / CLARO (persistente) ====================
const loadTheme = () => {
    const savedTheme = localStorage.getItem('taskflow_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleBtn.textContent = '☀️ Modo Claro';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggleBtn.textContent = '🌙 Modo Oscuro';
    }
};

const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
};

// ==================== FILTROS Y BÚSQUEDA (eventos) ====================
const setActiveFilter = (filter) => {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderTasks();
};

const handleSearch = () => {
    searchTerm = searchInput.value;
    renderTasks();
};

// ==================== ESCAPE HTML (seguridad) ====================
const escapeHtml = (str) => {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
};

// ==================== INICIALIZACIÓN ====================
const init = () => {
    loadFromLocalStorage();   // Cargar tareas guardadas
    loadTheme();              // Cargar tema guardado
    renderTasks();
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    themeToggleBtn.addEventListener('click', toggleTheme);
    searchInput.addEventListener('input', handleSearch);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveFilter(btn.dataset.filter);
        });
    });
};

// Iniciar aplicación
init();