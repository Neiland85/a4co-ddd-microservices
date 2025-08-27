import React from 'react';
interface ChartStylesProps {
    id: string;
    colorConfig: Array<{
        theme: string;
        colors: Record<string, string>;
    }>;
}
export declare const SafeChartStyles: React.FC<ChartStylesProps>;
export declare function useChartStyles(id: string, colorConfig: Array<{
    theme: string;
    colors: Record<string, string>;
}>): {
    selector: string;
    styles: {};
}[] | null;
export declare function createChartStyleSheet(id: string, colorConfig: Array<{
    theme: string;
    colors: Record<string, string>;
}>): string;
export {};
//# sourceMappingURL=SafeChartStyles.d.ts.map