/**
 * Toast Notification Composable
 * Simple toast notifications for user feedback
 */

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export const useToast = () => {
  const show = (message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) => {
    const id = ++toastId;
    const toast: Toast = { id, message, type, duration };

    toasts.value.push(toast);

    // Auto remove after duration
    setTimeout(() => {
      remove(id);
    }, duration);

    return id;
  };

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration = 3000) => show(message, 'success', duration);
  const error = (message: string, duration = 4000) => show(message, 'error', duration);
  const info = (message: string, duration = 3000) => show(message, 'info', duration);

  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    info,
    remove,
  };
};
