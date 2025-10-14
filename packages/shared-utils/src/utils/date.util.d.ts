export declare class DateUtil {
    static now(): Date;
    static toISOString(date: Date): string;
    static fromISOString(dateString: string): Date;
    static addDays(date: Date, days: number): Date;
    static addHours(date: Date, hours: number): Date;
    static isExpired(date: Date): boolean;
    static formatToDDMMYYYY(date: Date): string;
}
//# sourceMappingURL=date.util.d.ts.map