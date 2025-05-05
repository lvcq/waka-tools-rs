import { ToastIntent, ToastTitleProps } from "@fluentui/react-components";
import { Subject } from "rxjs";

export interface ToastOptions {
    message?: string;
    intent?: ToastIntent;
    title?: string;
    titleAction?: ToastTitleProps['action'];
    subtitle?: string;
    actions?: React.ReactNode;
}

class ToastHelperImpl {
    private static instance: ToastHelperImpl;

    private toastShowObservable = new Subject<ToastOptions>();
    private toastHideObservable = new Subject<void>();

    get toastShow$() {
        return this.toastShowObservable.asObservable();
    }
    get toastHide$() {
        return this.toastHideObservable.asObservable();
    }

    static getInstance() {
        if (!ToastHelperImpl.instance) {
            ToastHelperImpl.instance = new ToastHelperImpl();
        }
        return ToastHelperImpl.instance;
    }
    private constructor() {
    }
    async showToast(options: ToastOptions) {
        this.toastShowObservable.next(options);
    }

    async hideToast() {
        this.toastHideObservable.next();
    }

    async success(message: string) {
        this.showToast({ title: message, intent: 'success' });
    }

    async error(message: string) {
        this.showToast({ title: message, intent: 'error' });
    }

    async warning(message: string) {
        this.showToast({ title: message, intent: 'warning' });
    }

    async info(message: string) {
        this.showToast({ title: message, intent: 'info' });
    }
}

export const ToastHelper = ToastHelperImpl.getInstance();