'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRealTimeData = useRealTimeData;
const react_1 = require("react");
const api_client_1 = require("@/lib/api-client");
function useRealTimeData(endpoint, interval = 5000) {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            try {
                const result = await api_client_1.apiClient.get(endpoint);
                setData(result);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            }
            finally {
                setLoading(false);
            }
        };
        // Fetch inicial
        fetchData();
        // Configurar polling para datos en tiempo real
        const intervalId = setInterval(fetchData, interval);
        return () => clearInterval(intervalId);
    }, [endpoint, interval]);
    return { data, loading, error };
}
//# sourceMappingURL=use-real-time-data.js.map