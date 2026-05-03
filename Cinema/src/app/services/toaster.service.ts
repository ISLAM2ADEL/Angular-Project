import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastType } from '../types/toast.type';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastsSubject = new BehaviorSubject<Toast<any>[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private nextId = 0;

  show<T = void>(message: string, type: ToastType = 'info', duration: number = 3000, data?: T) {
    const toast: Toast<T> = { id: this.nextId++, message, type, duration, data };
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  success<T = void>(message: string, duration?: number, data?: T) {
    this.show(message, 'success', duration, data);
  }

  error<T = void>(message: string, duration?: number, data?: T) {
    this.show(message, 'error', duration, data);
  }

  info<T = void>(message: string, duration?: number, data?: T) {
    this.show(message, 'info', duration, data);
  }

  warning<T = void>(message: string, duration?: number, data?: T) {
    this.show(message, 'warning', duration, data);
  }

  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }
}
