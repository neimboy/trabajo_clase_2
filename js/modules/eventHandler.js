/**
 * Manejador de Eventos
 * Gestiona todas las interacciones del usuario
 */

import stateManager from './stateManager.js';
import renderer from './renderer.js';
import { showNotification } from './notifications.js';

class EventHandler {
  constructor() {
    this.elements = {
      taskNameInput: document.getElementById('taskName'),
      prioritySelect: document.getElementById('taskPriority'),
      addTaskBtn: document.getElementById('addTaskBtn'),
      themeToggle: document.getElementById('themeToggle'),
      tasksContainer: document.getElementById('tasksContainer'),
      searchInput: document.getElementById('searchInput'),
      filterButtons: document.querySelectorAll('[data-filter]')
    };
  }

  /**
   * Inicializa todos los event listeners
   */
  init() {
    this.setupTaskForm();
    this.setupThemeToggle();
    this.setupFilters();
    this.setupSearch();
    this.setupTaskContainer();
  }

  /**
   * Configura eventos del formulario de tareas
   */
  setupTaskForm() {
    this.elements.addTaskBtn.addEventListener('click', () => this.handleAddTask());
    this.elements.taskNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleAddTask();
    });
  }

  /**
   * Configura el toggle de tema
   */
  setupThemeToggle() {
    console.log('🔧 Configurando toggle de tema...');
    console.log('🎯 Botón encontrado:', this.elements.themeToggle);

    this.elements.themeToggle.addEventListener('click', () => {
      console.log('🖱️ Click en botón de tema detectado');
      this.handleThemeToggle();
    });

    console.log('✅ Event listener de tema configurado');
  }

  /**
   * Configura los filtros
   */
  setupFilters() {
    this.elements.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handleFilterChange(e.target));
    });
  }

  /**
   * Configura la búsqueda
   */
  setupSearch() {
    this.elements.searchInput.addEventListener('input', (e) => {
      stateManager.setState('searchTerm', e.target.value);
      renderer.render();
    });
  }

  /**
   * Configura eventos del contenedor de tareas (delegación)
   */
  setupTaskContainer() {
    this.elements.tasksContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('task-checkbox')) {
        this.handleTaskToggle(e.target.closest('.task-item'));
      }
      if (e.target.classList.contains('task-delete')) {
        this.handleTaskDelete(e.target.closest('.task-item'));
      }
    });
  }

  /**
   * Maneja la adición de una nueva tarea
   */
  handleAddTask() {
    const name = this.elements.taskNameInput.value;
    const priority = this.elements.prioritySelect.value;

    if (stateManager.addTask(name, priority)) {
      this.elements.taskNameInput.value = '';
      renderer.render();
      showNotification('¡Tarea agregada!', 'success');
    } else {
      showNotification('Por favor, ingresa un nombre válido', 'warning');
    }
  }

  /**
   * Maneja el toggle de completado de una tarea
   * @param {HTMLElement} taskEl - Elemento de la tarea
   */
  handleTaskToggle(taskEl) {
    const taskId = taskEl.dataset.taskId;
    stateManager.toggleTask(taskId);
    renderer.render();
  }

  /**
   * Maneja la eliminación de una tarea
   * @param {HTMLElement} taskEl - Elemento de la tarea
   */
  handleTaskDelete(taskEl) {
    const taskId = taskEl.dataset.taskId;
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      stateManager.deleteTask(taskId);
      renderer.render();
      showNotification('Tarea eliminada', 'info');
    }
  }

  /**
   * Maneja el cambio de tema
   */
  handleThemeToggle() {
    console.log('🎨 Manejando cambio de tema...');

    const state = stateManager.getState();
    console.log('📊 Estado actual:', state);

    const isDark = !state.isDarkMode;
    console.log('🔄 Nuevo estado isDark:', isDark);

    stateManager.setState('isDarkMode', isDark);
    localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
    console.log('💾 Estado guardado en localStorage');

    renderer.updateTheme(isDark);
    this.elements.themeToggle.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';

    console.log('✅ Tema cambiado a:', isDark ? 'dark' : 'light');
  }

  /**
   * Maneja el cambio de filtro
   * @param {HTMLElement} button - Botón de filtro clickeado
   */
  handleFilterChange(button) {
    this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    stateManager.setState('currentFilter', button.dataset.filter);
    renderer.render();
  }
}

export default new EventHandler();
