import type * as React from 'react';
type ToasterToast = {
    id: string;
    title: string;
    description?: string;
    action?: React.ReactElement;
    variant?: 'default' | 'destructive';
    open: boolean;
};
declare const actionTypes: {
    readonly ADD_TOAST: "ADD_TOAST";
    readonly UPDATE_TOAST: "UPDATE_TOAST";
    readonly DISMISS_TOAST: "DISMISS_TOAST";
    readonly REMOVE_TOAST: "REMOVE_TOAST";
};
type ActionType = typeof actionTypes;
type Action = {
    type: ActionType['ADD_TOAST'];
    toast: ToasterToast;
} | {
    type: ActionType['UPDATE_TOAST'];
    toast: Partial<ToasterToast>;
} | {
    type: ActionType['DISMISS_TOAST'];
    toastId?: ToasterToast['id'];
} | {
    type: ActionType['REMOVE_TOAST'];
    toastId?: ToasterToast['id'];
};
interface State {
    toasts: ToasterToast[];
}
export declare const reducer: (state: State, action: Action) => State;
interface Toast {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
}
export declare function useToast(): {
    toast: (toast: Toast) => void;
    toasts: ToasterToast[];
};
export {};
//# sourceMappingURL=use-toast.d.ts.map