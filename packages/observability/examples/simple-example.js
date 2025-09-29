'use strict';
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const src_1 = require('../src');
// Inicializar observabilidad
const { logger, httpLogger, getTracer, shutdown } = (0, src_1.initializeObservability)({
    serviceName: 'example-service',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    logging: {
        level: 'debug',
        prettyPrint: true,
    },
    tracing: {
        enabled: true,
        jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    },
    metrics: {
        enabled: true,
        port: 9464,
    },
});
// Crear aplicación Express
const app = (0, express_1.default)();
// Aplicar middleware de logging HTTP
app.use(httpLogger);
app.use(express_1.default.json());
// Ruta de ejemplo con tracing manual
app.get('/hello/:name', async(req, res) => {
    const tracer = getTracer('hello-endpoint');
    const span = tracer.startSpan('process-hello-request');
    try {
        // Log con contexto
        logger.info('Processing hello request', {
            name: req.params.name,
            userAgent: req.headers['user-agent'],
        });
        // Simular algún procesamiento
        span.addEvent('processing-start');
        await new Promise(resolve => setTimeout(resolve, 100));
        // Agregar atributos al span
        span.setAttributes({
            'user.name': req.params.name,
            'response.type': 'greeting',
        });
        const message = `Hello, ${req.params.name}!`;
        span.addEvent('processing-complete');
        span.setStatus({ code: 0 }); // OK
        res.json({
            message,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger.error('Error processing request', error);
        span.recordException(error);
        span.setStatus({ code: 2, message: error.message }); // ERROR
        res.status(500).json({
            error: 'Internal server error',
        });
    }
    finally {
        span.end();
    }
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'example-service',
        uptime: process.uptime(),
    });
});
// Métricas endpoint (automáticamente creado por Prometheus)
// Disponible en http://localhost:9464/metrics
// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info('Example service started', {
        port: PORT,
        pid: process.pid,
        node_version: process.version,
    });
});
// Graceful shutdown
process.on('SIGTERM', async() => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('HTTP server closed');
    });
    await shutdown();
    process.exit(0);
});
process.on('SIGINT', async() => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('HTTP server closed');
    });
    await shutdown();
    process.exit(0);
});
//# sourceMappingURL=simple-example.js.map
