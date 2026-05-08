/**
 * Gestor de Estado
 * Maneja el almacenamiento y manipulación de datos de tareas
 */

import { CONFIG } from './config.js';
import { isValidTaskName, generateId, getCurrentDate } from '../utils/utils.js';

class StateManager {
  constructor() {
    this.state = {
      tasks: [],
      currentFilter: 'all',
      searchTerm: '',
      isDarkMode: localStorage.getItem('taskflow_theme') === 'dark'
    };
    this.loadTasks();
  }

  /**
   * Carga las tareas desde localStorage
   */
  loadTasks() {
    try {
      const stored = localStorage.getItem(CONFIG.storageKey);
      this.state.tasks = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      this.state.tasks = [];
    }
  }

  /**
   * Guarda las tareas en localStorage
   */
  saveTasks() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.state.tasks));
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  }

  /**
   * Agrega una nueva tarea
   * @param {string} name - Nombre de la tarea
   * @param {string} priority - Prioridad de la tarea
   * @returns {boolean}
   */
  addTask(name, priority) {
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

    this.state.tasks.unshift(newTask);
    this.saveTasks();
    return true;
  }

  /**
   * Elimina una tarea por ID
   * @param {string} taskId - ID de la tarea
   */
  deleteTask(taskId) {
    this.state.tasks = this.state.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  /**
   * Alterna el estado completado de una tarea
   * @param {string} taskId - ID de la tarea
   */
  toggleTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  /**
   * Obtiene tareas filtradas según los criterios
   * @returns {array} Tareas filtradas
   */
  getFilteredTasks() {
    let filtered = this.state.tasks;

    // Filtro por estado
    if (this.state.currentFilter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (this.state.currentFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Filtro por búsqueda
    if (this.state.searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  /**
   * Calcula estadísticas de las tareas
   * @returns {object} Objeto con estadísticas
   */
  getStatistics() {
    const total = this.state.tasks.length;
    const completed = this.state.tasks.filter(t => t.completed).length;
    const highPriority = this.state.tasks.filter(
      t => t.priority === 'alta' && !t.completed
    ).length;

    return {
      total,
      completed,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      highPriority
    };
  }

  /**
   * Obtiene el estado actual
   * @returns {object}
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Actualiza un valor del estado
   * @param {string} key - Clave del estado
   * @param {*} value - Valor a establecer
   */
  setState(key, value) {
    this.state[key] = value;
  }
}

export default new StateManager();
