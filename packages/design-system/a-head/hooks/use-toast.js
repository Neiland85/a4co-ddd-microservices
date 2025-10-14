'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = void 0;
exports.useToast = useToast;
const react_1 = require("react");
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 3000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
            };
        case 'DISMISS_TOAST': {
            const { toastId } = action;
            if (toastId) {
                addToRemoveQueue(toastId);
            }
            else {
                state.toasts.forEach(toast => {
                    addToRemoveQueue(toast.id);
                });
            }
            return {
                ...state,
                toasts: state.toasts.map(t => t.id === toastId || toastId === undefined
                    ? {
                        ...t,
                        open: false,
                    }
                    : t),
            };
        }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter(t => t.id !== action.toastId),
            };
    }
};
exports.reducer = reducer;
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
    memoryState = (0, exports.reducer)(memoryState, action);
    listeners.forEach(listener => {
        listener(memoryState);
    });
}
function useToast() {
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const toast = (0, react_1.useCallback)((toast) => {
        const id = genId();
        setToasts(prev => [...prev, { ...toast, id, open: true }]);
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, TOAST_REMOVE_DELAY);
        // Mock toast - in a real app you'd show an actual toast notification
        console.log(`🍞 Toast: ${toast.title} - ${toast.description}`);
    }, []);
    return { toast, toasts };
}
//# sourceMappingURL=use-toast.js.map