/**
 * Renderizador de UI
 * Maneja la actualización visual de la aplicación
 */

import { CONFIG } from './config.js';
import { escapeHtml } from '../utils/utils.js';
import stateManager from './stateManager.js';

class Renderer {
  constructor() {
    this.elements = {
      tasksContainer: document.getElementById('tasksContainer'),
      totalTasksDisplay: document.getElementById('totalTasks'),
      progressDisplay: document.getElementById('progressPercent'),
      progressFill: document.getElementById('progressFill'),
      highPriorityDisplay: document.getElementById('highPriorityCount')
    };
  }

  /**
   * Renderiza una tarea individual
   * @param {object} task - Objeto de tarea
   * @returns {HTMLElement}
   */
  createTaskElement(task) {
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

  /**
   * Renderiza todas las tareas filtradas
   */
  renderTasks() {
    const filtered = stateManager.getFilteredTasks();
    this.elements.tasksContainer.innerHTML = '';

    if (filtered.length === 0) {
      this.elements.tasksContainer.innerHTML = `
        <div class="empty-state">
          <p>📭 No hay tareas para mostrar</p>
        </div>
      `;
      return;
    }

    filtered.forEach(task => {
      const taskEl = this.createTaskElement(task);
      this.elements.tasksContainer.appendChild(taskEl);
    });
  }

  /**
   * Actualiza las estadísticas mostradas
   */
  updateStatistics() {
    const stats = stateManager.getStatistics();

    this.elements.totalTasksDisplay.textContent = stats.total;
    this.elements.progressDisplay.textContent = `${stats.progress}%`;
    this.elements.progressFill.style.width = `${stats.progress}%`;
    this.elements.highPriorityDisplay.textContent = stats.highPriority;
  }

  /**
   * Actualiza el tema visual
   * @param {boolean} isDark - Si es modo oscuro
   */
  updateTheme(isDark) {
    console.log('🎨 updateTheme llamado con:', isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
      console.log('🌙 Clase dark-theme agregada');
    } else {
      document.body.classList.remove('dark-theme');
      console.log('☀️ Clase dark-theme removida');
    }
    console.log('📱 Clase actual del body:', document.body.className);
  }

  /**
   * Renderiza completo: tareas + estadísticas
   */
  render() {
    this.renderTasks();
    this.updateStatistics();
  }
}

export default new Renderer();
