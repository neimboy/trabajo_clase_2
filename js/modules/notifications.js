/**
 * Sistema de Notificaciones
 * Muestra mensajes al usuario
 */

/**
 * Muestra una notificación en pantalla
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, warning, info, error)
 */
export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}
