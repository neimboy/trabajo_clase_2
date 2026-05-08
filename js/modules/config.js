/**
 * Configuración global de la aplicación
 */

export const CONFIG = {
  storageKey: 'taskflow_tasks',
  priorityLevels: {
    alta: { color: '#ef4444', emoji: '🔴', valor: 3 },
    media: { color: '#f97316', emoji: '🟠', valor: 2 },
    baja: { color: '#22c55e', emoji: '🟢', valor: 1 }
  },
  themes: {
    light: 'light-mode',
    dark: 'dark-mode'
  }
};
