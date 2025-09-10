type ClassValue = string | number | boolean | undefined | null | {
    [key: string]: any;
} | ClassValue[];
export declare function cn(...inputs: ClassValue[]): string;
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const formatDate: (date: Date | string) => string;
export declare const truncateText: (text: string, maxLength: number) => string;
export declare const generateId: () => string;
export {};
//# sourceMappingURL=utils.d.ts.map