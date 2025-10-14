declare class ApiClient {
    private baseUrl;
    constructor(baseUrl?: string);
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, data: any): Promise<T>;
    getMetrics(): Promise<unknown>;
    getEvents(): Promise<unknown>;
    getNotifications(): Promise<unknown>;
    createEvent(event: any): Promise<unknown>;
}
export declare const apiClient: ApiClient;
export {};
//# sourceMappingURL=api-client.d.ts.map