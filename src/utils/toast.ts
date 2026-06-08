export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastEventDetail {
  message: string;
  type: ToastType;
}

export function showToast(message: string, type: ToastType = 'success') {
  const event = new CustomEvent('arogya_toast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
}
