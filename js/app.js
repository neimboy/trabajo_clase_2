/**
 * TaskFlow - Gestor de Tareas Profesional
 * Aplicación de gestión de tareas con almacenamiento persistente
 * @version 2.0.0 - Versión Modular
 */

import stateManager from './modules/stateManager.js';
import renderer from './modules/renderer.js';
import eventHandler from './modules/eventHandler.js';

/**
 * TaskManager - API pública de la aplicación
 */
const TaskManager = (() => {
  /**
   * Inicializa la aplicación
   */
  function init() {
    console.log('🚀 Inicializando TaskFlow...');

    // Aplicar tema guardado
    const state = stateManager.getState();
    console.log('📊 Estado del tema:', state.isDarkMode);

    renderer.updateTheme(state.isDarkMode);
    document.getElementById('themeToggle').textContent = state.isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro';

    console.log('🎨 Tema aplicado al DOM');

    // Renderizar inicial
    renderer.render();

    // Inicializar eventos
    eventHandler.init();

    console.log('TaskFlow v2.0 inicializado correctamente');
  }

  // API Pública
  return {
    init,
    addTask: (name, priority) => stateManager.addTask(name, priority),
    deleteTask: (id) => stateManager.deleteTask(id),
    getTasks: () => stateManager.getState().tasks,
    getStatistics: () => stateManager.getStatistics()
  };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => TaskManager.init());

export default TaskManager;