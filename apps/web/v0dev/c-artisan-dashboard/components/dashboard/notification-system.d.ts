interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
}
interface NotificationSystemProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}
export declare function NotificationSystem({ notifications, onRemove }: NotificationSystemProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=notification-system.d.ts.map