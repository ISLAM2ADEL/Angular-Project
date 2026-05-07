export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast<T = any> {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
  data?: T;
}
