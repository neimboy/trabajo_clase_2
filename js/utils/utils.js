/**
 * Utilidades comunes de la aplicación
 */

/**
 * Genera un ID único basado en timestamp y número aleatorio
 * @returns {string} ID único
 */
export function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Valida que el nombre de la tarea no esté vacío
 * @param {string} name - Nombre de la tarea
 * @returns {boolean}
 */
export function isValidTaskName(name) {
  return name && name.trim().length > 0 && name.trim().length <= 100;
}

/**
 * Obtiene la fecha formateada
 * @returns {string}
 */
export function getCurrentDate() {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Escapa caracteres especiales para evitar XSS
 * @param {string} text - Texto a escapar
 * @returns {string}
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}
