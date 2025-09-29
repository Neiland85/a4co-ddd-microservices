#!/usr/bin/env node

/**
 * Simple Monitoring Dashboard Server
 * Servidor web simple para visualizar dashboards de monitoreo
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

class SimpleMonitoringServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3003;
    this.projectRoot = '/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices';

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  setupRoutes() {
    // Dashboard principal
    this.app.get('/', (req, res) => {
      const html = this.generateDashboardHTML();
      res.send(html);
    });

    // API endpoints para datos
    this.app.get('/api/metrics', (req, res) => {
      const metrics = this.loadMetricsData();
      res.json(metrics);
    });

    this.app.get('/api/phase1', (req, res) => {
      const phase1Data = this.loadPhase1Data();
      res.json(phase1Data);
    });

    this.app.get('/api/phase2', (req, res) => {
      const phase2Data = this.loadPhase2Data();
      res.json(phase2Data);
    });

    // Página de métricas
    this.app.get('/metrics', (req, res) => {
      const html = this.generateMetricsHTML();
      res.send(html);
    });

    // Página de Phase 1
    this.app.get('/phase1', (req, res) => {
      const html = this.generatePhase1HTML();
      res.send(html);
    });

    // Página de Phase 2
    this.app.get('/phase2', (req, res) => {
      const html = this.generatePhase2HTML();
      res.send(html);
    });
  }

  generateDashboardHTML() {
    const data = this.loadDashboardData();

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A4CO Monitoring Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-gray-900">📊 A4CO Monitoring Dashboard</h1>
                    <span class="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        ${data.currentPhase}
                    </span>
                </div>
                <div class="text-sm text-gray-500">
                    Última actualización: ${data.lastUpdate}
                </div>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- System Status -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Estado del Sistema</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                ${data.systemStatus.services.map(service => `
                <div class="bg-white rounded-lg shadow p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-gray-900">${service.name}</h3>
                            <p class="text-xs text-gray-500">${service.uptime} uptime</p>
                        </div>
                        <span class="status-healthy px-2 py-1 rounded-full text-xs font-medium">
                            ${service.status}
                        </span>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Métricas Clave</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-gray-500">Adopción de Features</h3>
                            <p class="text-2xl font-bold text-gray-900">${data.keyMetrics.adoption.value}</p>
                            <p class="text-sm text-green-600">↗️ ${data.keyMetrics.adoption.change}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-gray-500">Tasa de Error</h3>
                            <p class="text-2xl font-bold text-gray-900">${data.keyMetrics.errorRate.value}</p>
                            <p class="text-sm text-red-600">↘️ ${data.keyMetrics.errorRate.change}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-gray-500">Satisfacción Usuario</h3>
                            <p class="text-2xl font-bold text-gray-900">${data.keyMetrics.satisfaction.value}</p>
                            <p class="text-sm text-green-600">↗️ ${data.keyMetrics.satisfaction.change}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-gray-500">Performance</h3>
                            <p class="text-2xl font-bold text-gray-900">${data.keyMetrics.performance.value}</p>
                            <p class="text-sm text-gray-600">→ ${data.keyMetrics.performance.change}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Navegación</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/metrics" class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 text-center transition-colors">
                    <div class="text-2xl mb-2">📈</div>
                    <h3 class="font-semibold">Métricas Detalladas</h3>
                    <p class="text-sm opacity-90">Análisis completo de métricas</p>
                </a>

                <a href="/phase1" class="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-center transition-colors">
                    <div class="text-2xl mb-2">🎯</div>
                    <h3 class="font-semibold">Phase 1 - Internal Beta</h3>
                    <p class="text-sm opacity-90">Resultados del rollout interno</p>
                </a>

                <a href="/phase2" class="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 text-center transition-colors">
                    <div class="text-2xl mb-2">🚀</div>
                    <h3 class="font-semibold">Phase 2 - External Beta</h3>
                    <p class="text-sm opacity-90">Estado del rollout externo</p>
                </a>
            </div>
        </div>

        <!-- Active Alerts -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Alertas Activas</h2>
            <div class="space-y-3">
                ${data.alerts.map(alert => `
                <div class="bg-white rounded-lg shadow p-4 border-l-4 ${alert.level === 'warning' ? 'border-yellow-400' : 'border-blue-400'}">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-900">${alert.message}</p>
                            <p class="text-xs text-gray-500">${alert.time}</p>
                        </div>
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${alert.level === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}">
                            ${alert.level}
                        </span>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="divide-y divide-gray-200">
                    ${data.recentActivity.map(activity => `
                    <div class="px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="${activity.status === 'success' ? 'text-green-500' : 'text-gray-400'} mr-3">
                                    ${activity.status === 'success' ? '✅' : '⏳'}
                                </span>
                                <p class="text-sm font-medium text-gray-900">${activity.action}</p>
                            </div>
                            <p class="text-sm text-gray-500">${activity.time}</p>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>

    <style>
        .status-healthy { @apply bg-green-100 text-green-800; }
    </style>

    <script>
        // Auto-refresh every 30 seconds
        setInterval(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>`;
  }

  generateMetricsHTML() {
    const data = this.loadMetricsData();

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Métricas Detalladas - A4CO Monitoring</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <a href="/" class="text-blue-600 hover:text-blue-800 mr-4">← Dashboard</a>
                    <h1 class="text-2xl font-bold text-gray-900">📈 Métricas Detalladas</h1>
                </div>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Datos de Métricas</h2>
            <pre class="bg-gray-50 p-4 rounded text-sm overflow-x-auto"><code>${JSON.stringify(data, null, 2)}</code></pre>
        </div>
    </div>
</body>
</html>`;
  }

  generatePhase1HTML() {
    const data = this.loadPhase1Data();

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phase 1 - A4CO Monitoring</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <a href="/" class="text-blue-600 hover:text-blue-800 mr-4">← Dashboard</a>
                    <h1 class="text-2xl font-bold text-gray-900">🎯 Phase 1 - Internal Beta</h1>
                </div>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Datos de Phase 1</h2>
            <pre class="bg-gray-50 p-4 rounded text-sm overflow-x-auto"><code>${JSON.stringify(data, null, 2)}</code></pre>
        </div>
    </div>
</body>
</html>`;
  }

  generatePhase2HTML() {
    const data = this.loadPhase2Data();

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phase 2 - A4CO Monitoring</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center">
                    <a href="/" class="text-blue-600 hover:text-blue-800 mr-4">← Dashboard</a>
                    <h1 class="text-2xl font-bold text-gray-900">🚀 Phase 2 - External Beta</h1>
                </div>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Datos de Phase 2</h2>
            <pre class="bg-gray-50 p-4 rounded text-sm overflow-x-auto"><code>${JSON.stringify(data, null, 2)}</code></pre>
        </div>
    </div>
</body>
</html>`;
  }

  loadDashboardData() {
    return {
      currentPhase: 'Phase 2 - 25% External Beta',
      lastUpdate: new Date().toLocaleString('es-ES'),
      systemStatus: {
        overall: 'HEALTHY',
        services: [
          { name: 'Feature Flags', status: 'operational', uptime: '99.9%' },
          { name: 'Rollout Service', status: 'operational', uptime: '99.8%' },
          { name: 'Monitoring', status: 'operational', uptime: '100%' },
          { name: 'External APIs', status: 'operational', uptime: '99.5%' }
        ]
      },
      keyMetrics: {
        adoption: { value: '78.5%', trend: 'up', change: '+12.3%' },
        errorRate: { value: '0.8%', trend: 'down', change: '-45.2%' },
        satisfaction: { value: '4.6/5.0', trend: 'up', change: '+8.1%' },
        performance: { value: '1420ms', trend: 'stable', change: '-2.1%' }
      },
      alerts: [
        {
          level: 'info',
          message: 'Phase 2 rollout progressing smoothly',
          time: '2 minutes ago'
        },
        {
          level: 'warning',
          message: 'Support tickets slightly above baseline',
          time: '15 minutes ago'
        }
      ],
      recentActivity: [
        { action: '25% External Beta activated', time: '1 hour ago', status: 'success' },
        { action: 'Monitoring infrastructure scaled', time: '2 hours ago', status: 'success' },
        { action: 'Communications sent to beta users', time: '3 hours ago', status: 'success' },
        { action: 'Phase 2 features planned', time: '4 hours ago', status: 'success' }
      ]
    };
  }

  loadMetricsData() {
    try {
      const day1Report = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'phase1-day1-report.json'), 'utf8'));
      return {
        phase1: { day1: day1Report },
        trends: {
          errorRate: { current: 0.8, previous: 1.4, trend: 'improving' },
          adoption: { current: 78.5, previous: 69.2, trend: 'improving' },
          satisfaction: { current: 4.6, previous: 4.2, trend: 'improving' },
          performance: { current: 1420, previous: 1450, trend: 'stable' }
        }
      };
    } catch (error) {
      return { error: 'No se pudieron cargar las métricas' };
    }
  }

  loadPhase1Data() {
    try {
      const rolloutConfig = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'phase1-rollout-config.json'), 'utf8'));
      const finalReport = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'phase1-final-report.json'), 'utf8'));

      return {
        rolloutConfig,
        finalReport
      };
    } catch (error) {
      return { error: 'No se pudieron cargar los datos de Phase 1' };
    }
  }

  loadPhase2Data() {
    try {
      const deploymentReport = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'phase2-deployment-report.json'), 'utf8'));
      const featuresPlan = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'phase2-features-plan.json'), 'utf8'));

      return {
        deploymentReport,
        featuresPlan
      };
    } catch (error) {
      return { error: 'No se pudieron cargar los datos de Phase 2' };
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log('🚀 Simple Monitoring Dashboard Server started!');
      console.log(`📊 Dashboard available at: http://localhost:${this.port}`);
      console.log(`📈 Metrics page: http://localhost:${this.port}/metrics`);
      console.log(`🎯 Phase 1 page: http://localhost:${this.port}/phase1`);
      console.log(`🚀 Phase 2 page: http://localhost:${this.port}/phase2`);
      console.log('\n💡 Press Ctrl+C to stop the server');
    });
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const server = new SimpleMonitoringServer();
  server.start();
}

module.exports = SimpleMonitoringServer;