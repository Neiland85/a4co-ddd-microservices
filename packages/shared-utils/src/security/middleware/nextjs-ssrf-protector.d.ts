import { URLValidator } from '../validators/url.validator';
import { IPRangeBlocker } from '../utils/ip-range-blocker';
export { URLValidator, IPRangeBlocker };
export declare function validateRedirectURL(url: string | null): {
    isValid: boolean;
    violations: string[];
};
export declare function validateHost(host: string | null): {
    isValid: boolean;
    violations: string[];
};
export declare function validateQueryParams(params: Record<string, string>): {
    isValid: boolean;
    violations: string[];
};
export declare function generateSafeMiddlewareCode(): string;
//# sourceMappingURL=nextjs-ssrf-protector.d.ts.map