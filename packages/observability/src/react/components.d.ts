import React, { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
export interface TrackedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    trackingName?: string;
    trackingMetadata?: Record<string, any>;
}
export declare const TrackedButton: React.FC<TrackedButtonProps>;
export interface TrackedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    trackingName?: string;
    trackingMetadata?: Record<string, any>;
    debounceMs?: number;
}
export declare const TrackedInput: React.FC<TrackedInputProps>;
export interface TrackedSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Array<{
        value: string;
        label: string;
    }>;
    trackingName?: string;
    trackingMetadata?: Record<string, any>;
}
export declare const TrackedSelect: React.FC<TrackedSelectProps>;
export interface TrackedCardProps {
    title?: string;
    children: React.ReactNode;
    onClick?: () => void;
    trackingName?: string;
    trackingMetadata?: Record<string, any>;
    variant?: 'default' | 'elevated' | 'outlined';
}
export declare const TrackedCard: React.FC<TrackedCardProps>;
export interface TrackedModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    trackingName?: string;
    trackingMetadata?: Record<string, any>;
}
export declare const TrackedModal: React.FC<TrackedModalProps>;
export interface TrackedTabsProps {
    tabs: Array<{
        id: string;
        label: string;
        content: React.ReactNode;
    }>;
    defaultTab?: string;
    trackingName?: string;
    trackingMetadata?: Record<string, any>;
}
export declare const TrackedTabs: React.FC<TrackedTabsProps>;
//# sourceMappingURL=components.d.ts.map