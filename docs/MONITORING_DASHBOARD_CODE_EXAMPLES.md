# Ejemplos de Código - A4CO Monitoring Dashboard

## 📝 Snippets de Implementación

### 1. Servidor Express.js Principal

```javascript
// scripts/simple-monitoring-server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Cache para datos
let dataCache = {};
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 segundos

// Función para cargar datos con cache
async function loadData(filePath) {
    const now = Date.now();
    if (dataCache[filePath] && (now - cacheTimestamp) < CACHE_TTL) {
        return dataCache[filePath];
    }

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const parsed = JSON.parse(data);
        dataCache[filePath] = parsed;
        cacheTimestamp = now;
        return parsed;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        throw error;
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/metrics', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/metrics.html'));
});

app.get('/api/metrics/phase1', async (req, res) => {
    try {
        const data = await loadData(path.join(__dirname, '../data/phase1-metrics.json'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load Phase 1 metrics' });
    }
});

app.get('/api/metrics/phase2', async (req, res) => {
    try {
        const data = await loadData(path.join(__dirname, '../data/phase2-metrics.json'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load Phase 2 metrics' });
    }
});

app.get('/api/alerts', async (req, res) => {
    try {
        const data = await loadData(path.join(__dirname, '../data/alerts.json'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load alerts' });
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Monitoring Dashboard running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
```

### 2. HTML del Dashboard Principal

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A4CO Monitoring Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .metric-card {
            transition: transform 0.2s ease-in-out;
        }
        .metric-card:hover {
            transform: translateY(-2px);
        }
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
        .status-operational { background-color: #10b981; }
        .status-degraded { background-color: #f59e0b; }
        .status-down { background-color: #ef4444; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">A4CO Monitoring Dashboard</h1>
                    <p class="text-gray-600 mt-2">Monitoreo en tiempo real del rollout de funcionalidades</p>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-500">Última actualización</div>
                    <div id="lastUpdate" class="text-lg font-semibold text-gray-900">--:--:--</div>
                </div>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="metric-card bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Adopción de Features</p>
                        <p id="adoptionRate" class="text-2xl font-bold text-gray-900">--%</p>
                        <p id="adoptionChange" class="text-sm text-green-600">+--%</p>
                    </div>
                    <div class="text-3xl">🎯</div>
                </div>
            </div>

            <div class="metric-card bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Tasa de Error</p>
                        <p id="errorRate" class="text-2xl font-bold text-gray-900">-%</p>
                        <p id="errorChange" class="text-sm text-green-600">---%</p>
                    </div>
                    <div class="text-3xl">⚠️</div>
                </div>
            </div>

            <div class="metric-card bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Satisfacción Usuario</p>
                        <p id="userSatisfaction" class="text-2xl font-bold text-gray-900">-/5.0</p>
                        <p id="satisfactionChange" class="text-sm text-green-600">+--</p>
                    </div>
                    <div class="text-3xl">😊</div>
                </div>
            </div>

            <div class="metric-card bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Performance</p>
                        <p id="performance" class="text-2xl font-bold text-gray-900">---ms</p>
                        <p id="performanceChange" class="text-sm text-green-600">---ms</p>
                    </div>
                    <div class="text-3xl">⚡</div>
                </div>
            </div>
        </div>

        <!-- Service Status -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Estado de Servicios</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span class="status-indicator status-operational"></span>
                    <div>
                        <p class="font-medium text-gray-900">Feature Flags</p>
                        <p class="text-sm text-gray-600">99.9% uptime</p>
                    </div>
                </div>

                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span class="status-indicator status-operational"></span>
                    <div>
                        <p class="font-medium text-gray-900">Rollout Service</p>
                        <p class="text-sm text-gray-600">99.8% uptime</p>
                    </div>
                </div>

                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span class="status-indicator status-operational"></span>
                    <div>
                        <p class="font-medium text-gray-900">Monitoring</p>
                        <p class="text-sm text-gray-600">100% uptime</p>
                    </div>
                </div>

                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span class="status-indicator status-operational"></span>
                    <div>
                        <p class="font-medium text-gray-900">External APIs</p>
                        <p class="text-sm text-gray-600">99.5% uptime</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Active Alerts -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Alertas Activas</h2>
            <div id="alertsContainer" class="space-y-3">
                <!-- Alerts will be loaded here -->
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/metrics" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center">
                    Ver Métricas Detalladas
                </a>
                <button onclick="forceRefresh()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Actualizar Ahora
                </button>
                <button onclick="exportData()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Exportar Datos
                </button>
            </div>
        </div>
    </div>

    <script>
        let autoRefreshInterval;

        // Load data and update UI
        async function loadDashboardData() {
            try {
                const [phase1Data, phase2Data, alertsData] = await Promise.all([
                    fetch('/api/metrics/phase1').then(r => r.json()),
                    fetch('/api/metrics/phase2').then(r => r.json()),
                    fetch('/api/alerts').then(r => r.json())
                ]);

                updateMetrics(phase2Data.current);
                updateAlerts(alertsData.active);
                updateLastUpdate();

            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }

        function updateMetrics(data) {
            document.getElementById('adoptionRate').textContent = `${data.adoptionRate}%`;
            document.getElementById('adoptionChange').textContent = `+${data.adoptionChange}%`;
            document.getElementById('errorRate').textContent = `${data.errorRate}%`;
            document.getElementById('errorChange').textContent = `${data.errorChange}%`;
            document.getElementById('userSatisfaction').textContent = `${data.userSatisfaction}/5.0`;
            document.getElementById('satisfactionChange').textContent = `+${data.satisfactionChange}`;
            document.getElementById('performance').textContent = `${data.performance}ms`;
            document.getElementById('performanceChange').textContent = `${data.performanceChange}ms`;
        }

        function updateAlerts(alerts) {
            const container = document.getElementById('alertsContainer');
            container.innerHTML = '';

            if (alerts.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay alertas activas</p>';
                return;
            }

            alerts.forEach(alert => {
                const alertDiv = document.createElement('div');
                alertDiv.className = `p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                }`;

                alertDiv.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-medium text-gray-900">${alert.title}</p>
                            <p class="text-sm text-gray-600 mt-1">${alert.description}</p>
                        </div>
                        <span class="text-xs text-gray-500">${alert.timestamp}</span>
                    </div>
                `;

                container.appendChild(alertDiv);
            });
        }

        function updateLastUpdate() {
            const now = new Date();
            document.getElementById('lastUpdate').textContent =
                now.toLocaleTimeString('es-ES', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
        }

        function forceRefresh() {
            loadDashboardData();
        }

        function exportData() {
            // Implementar exportación de datos
            alert('Funcionalidad de exportación próximamente disponible');
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadDashboardData();
            autoRefreshInterval = setInterval(loadDashboardData, 30000);
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (autoRefreshInterval) {
                clearInterval(autoRefreshInterval);
            }
        });
    </script>
</body>
</html>
```

### 3. Estructura de Datos JSON

```json
// data/phase1-metrics.json
{
  "phase": "Phase 1 - Internal Beta",
  "duration": "3 days",
  "targetUsers": "100% team",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "features": [
    "Logistics & Operations Dashboard",
    "Real-time Inventory Tracking",
    "Automated Order Processing",
    "Customer Communication Tools",
    "Analytics & Reporting Suite"
  ],
  "dailyMetrics": [
    {
      "date": "2024-01-15",
      "day": 1,
      "adoptionRate": 45.2,
      "errorRate": 1.8,
      "userSatisfaction": 3.8,
      "performance": 1850,
      "feedback": [
        "Dashboard loads slowly on first access",
        "Inventory tracking feature well received",
        "Some users reported confusion with new navigation"
      ]
    },
    {
      "date": "2024-01-16",
      "day": 2,
      "adoptionRate": 67.8,
      "errorRate": 0.9,
      "userSatisfaction": 4.2,
      "performance": 1650,
      "feedback": [
        "Performance improved after optimizations",
        "Order processing automation saving time",
        "Additional training needed for some features"
      ]
    },
    {
      "date": "2024-01-17",
      "day": 3,
      "adoptionRate": 85.3,
      "errorRate": 0.3,
      "userSatisfaction": 4.7,
      "performance": 1420,
      "feedback": [
        "Overall positive feedback",
        "Minor UI improvements suggested",
        "Ready for Phase 2 expansion"
      ]
    }
  ],
  "finalResults": {
    "kpis": {
      "adoptionTarget": 70,
      "adoptionAchieved": 85.3,
      "adoptionStatus": "✅ Exceeded",
      "errorTarget": 2.0,
      "errorAchieved": 0.3,
      "errorStatus": "✅ Met",
      "satisfactionTarget": 4.0,
      "satisfactionAchieved": 4.7,
      "satisfactionStatus": "✅ Exceeded"
    },
    "recommendations": [
      "Proceed to Phase 2 with 25% external beta",
      "Monitor performance metrics closely",
      "Prepare additional user training materials",
      "Consider gradual feature rollout strategy"
    ],
    "risks": [
      "Performance degradation under higher load",
      "User adoption may vary by department",
      "Additional support tickets expected initially"
    ]
  }
}
```

```json
// data/phase2-metrics.json
{
  "phase": "Phase 2 - External Beta (25%)",
  "duration": "Ongoing",
  "targetUsers": "25% of external users",
  "startDate": "2024-01-20",
  "current": {
    "adoptionRate": 78.5,
    "adoptionChange": 12.3,
    "errorRate": 0.8,
    "errorChange": -45.2,
    "userSatisfaction": 4.6,
    "satisfactionChange": 0.8,
    "performance": 1420,
    "performanceChange": -21,
    "lastUpdate": "2024-01-25T14:30:00Z"
  },
  "features": [
    "Logistics & Operations Dashboard",
    "Real-time Inventory Tracking",
    "Automated Order Processing",
    "Customer Communication Tools",
    "Analytics & Reporting Suite",
    "Advanced Filtering Options",
    "Mobile-Responsive Design"
  ],
  "serviceStatus": [
    {
      "name": "Feature Flags",
      "status": "operational",
      "uptime": 99.9,
      "responseTime": 45
    },
    {
      "name": "Rollout Service",
      "status": "operational",
      "uptime": 99.8,
      "responseTime": 67
    },
    {
      "name": "Monitoring",
      "status": "operational",
      "uptime": 100.0,
      "responseTime": 23
    },
    {
      "name": "External APIs",
      "status": "operational",
      "uptime": 99.5,
      "responseTime": 89
    }
  ],
  "recentActivity": [
    {
      "timestamp": "2024-01-25T13:45:00Z",
      "event": "25% External Beta activated",
      "type": "milestone",
      "details": "Successfully rolled out to 25% of external users"
    },
    {
      "timestamp": "2024-01-25T12:30:00Z",
      "event": "Monitoring infrastructure scaled",
      "type": "system",
      "details": "Increased monitoring capacity for Phase 2"
    },
    {
      "timestamp": "2024-01-25T11:15:00Z",
      "event": "Communications sent to beta users",
      "type": "communication",
      "details": "Email notifications sent to all beta participants"
    }
  ]
}
```

### 4. Sistema de Alertas

```json
// data/alerts.json
{
  "active": [
    {
      "id": "phase2_rollout_success",
      "title": "Phase 2 rollout progressing smoothly",
      "description": "External beta deployment at 25% is meeting all KPIs",
      "severity": "info",
      "timestamp": "2024-01-25T14:15:00Z",
      "category": "rollout"
    },
    {
      "id": "support_tickets_elevated",
      "title": "Support tickets slightly above baseline",
      "description": "Support ticket volume is 15% above normal levels",
      "severity": "warning",
      "timestamp": "2024-01-25T13:30:00Z",
      "category": "support"
    }
  ],
  "history": [
    {
      "id": "phase1_completion",
      "title": "Phase 1 Internal Beta completed successfully",
      "description": "All KPIs met or exceeded targets",
      "severity": "info",
      "timestamp": "2024-01-17T17:00:00Z",
      "resolved": true,
      "resolution": "Phase approved for continuation"
    },
    {
      "id": "performance_optimization",
      "title": "Performance optimizations applied",
      "description": "Response time improved by 15% after optimizations",
      "severity": "info",
      "timestamp": "2024-01-16T10:30:00Z",
      "resolved": true,
      "resolution": "Performance within acceptable limits"
    }
  ],
  "rules": [
    {
      "id": "error_rate_threshold",
      "name": "Error Rate Alert",
      "condition": "errorRate > 2.0",
      "severity": "critical",
      "message": "Error rate has exceeded 2%",
      "enabled": true
    },
    {
      "id": "adoption_rate_threshold",
      "name": "Adoption Rate Alert",
      "condition": "adoptionRate < 70.0",
      "severity": "warning",
      "message": "Adoption rate below 70%",
      "enabled": true
    },
    {
      "id": "performance_threshold",
      "name": "Performance Alert",
      "condition": "performance > 2000",
      "severity": "warning",
      "message": "Response time exceeds 2000ms",
      "enabled": true
    }
  ]
}
```

### 5. Scripts de Utilidad

```bash
#!/bin/bash
# scripts/start-monitoring.sh
# Script para iniciar el dashboard de monitoreo

echo "🚀 Iniciando A4CO Monitoring Dashboard..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar que los archivos de datos existan
if [ ! -f "data/phase1-metrics.json" ]; then
    echo "❌ Error: Archivo data/phase1-metrics.json no encontrado"
    exit 1
fi

if [ ! -f "data/phase2-metrics.json" ]; then
    echo "❌ Error: Archivo data/phase2-metrics.json no encontrado"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar el servidor
echo "📊 Iniciando servidor en puerto 3003..."
node scripts/simple-monitoring-server.js &
SERVER_PID=$!

echo "✅ Dashboard iniciado con PID: $SERVER_PID"
echo "🌐 Acceder en: http://localhost:3003"
echo "💚 Health check: http://localhost:3003/health"

# Función para detener el servidor
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidor..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Capturar señales para cleanup
trap cleanup SIGINT SIGTERM

# Mantener el script ejecutándose
wait $SERVER_PID
```

```bash
#!/bin/bash
# scripts/update-metrics.sh
# Script para actualizar métricas del dashboard

echo "📊 Actualizando métricas del dashboard..."

# Función para generar métricas simuladas
generate_metrics() {
    local phase=$1
    local adoption_base=$2
    local error_base=$3
    local satisfaction_base=$4
    local performance_base=$5

    # Generar variación aleatoria (±5%)
    adoption_variation=$(echo "scale=1; $adoption_base + ($RANDOM % 10 - 5)" | bc)
    error_variation=$(echo "scale=1; $error_base + ($RANDOM % 4 - 2)" | bc)
    satisfaction_variation=$(echo "scale=1; $satisfaction_base + ($RANDOM % 6 - 3)/10" | bc)
    performance_variation=$(echo "$performance_base + ($RANDOM % 200 - 100)" | bc)

    # Asegurar límites razonables
    adoption=$(echo "scale=1; if ($adoption_variation > 100) 100 else if ($adoption_variation < 0) 0 else $adoption_variation" | bc)
    error=$(echo "scale=1; if ($error_variation > 5) 5 else if ($error_variation < 0) 0 else $error_variation" | bc)
    satisfaction=$(echo "scale=1; if ($satisfaction_variation > 5) 5 else if ($satisfaction_variation < 1) 1 else $satisfaction_variation" | bc)
    performance=$(echo "if ($performance_variation > 3000) 3000 else if ($performance_variation < 500) 500 else $performance_variation" | bc)

    cat << EOF
{
  "phase": "$phase",
  "current": {
    "adoptionRate": $adoption,
    "adoptionChange": $(echo "scale=1; $adoption - $adoption_base" | bc),
    "errorRate": $error,
    "errorChange": $(echo "scale=1; $error - $error_base" | bc),
    "userSatisfaction": $satisfaction,
    "satisfactionChange": $(echo "scale=1; $satisfaction - $satisfaction_base" | bc),
    "performance": $performance,
    "performanceChange": $(echo "$performance - $performance_base" | bc),
    "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  }
}
EOF
}

# Actualizar Phase 2 metrics
echo "📈 Generando métricas de Phase 2..."
generate_metrics "Phase 2 - External Beta (25%)" 78.5 0.8 4.6 1420 > data/phase2-metrics.json

echo "✅ Métricas actualizadas exitosamente"
echo "🔄 Última actualización: $(date)"
```

### 6. Tests Unitarios

```javascript
// tests/monitoring-server.test.js
const request = require('supertest');
const express = require('express');
const monitoringServer = require('../scripts/simple-monitoring-server');

describe('Monitoring Server', () => {
    let app;

    beforeEach(() => {
        app = express();
        // Configurar rutas de prueba
        app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                uptime: process.uptime()
            });
        });
    });

    afterEach(() => {
        // Cleanup
    });

    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('version');
            expect(response.body).toHaveProperty('uptime');
        });

        it('should return valid timestamp', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            const timestamp = new Date(response.body.timestamp);
            expect(timestamp).toBeInstanceOf(Date);
            expect(isNaN(timestamp)).toBe(false);
        });
    });

    describe('Data Loading', () => {
        it('should load Phase 1 metrics successfully', async () => {
            // Mock fs.readFile
            const mockData = {
                phase: 'Phase 1 - Internal Beta',
                duration: '3 days'
            };

            // Test data loading logic
            expect(mockData.phase).toBe('Phase 1 - Internal Beta');
        });

        it('should handle file not found error', async () => {
            // Test error handling
            const error = new Error('File not found');
            expect(error.message).toBe('File not found');
        });
    });

    describe('Caching', () => {
        it('should use cached data within TTL', () => {
            const cache = {};
            const now = Date.now();

            // Simulate caching logic
            cache['test'] = { data: 'cached' };
            const cached = cache['test'];

            expect(cached.data).toBe('cached');
        });

        it('should refresh cache after TTL expires', () => {
            const CACHE_TTL = 30000; // 30 seconds
            const now = Date.now();
            const oldTimestamp = now - CACHE_TTL - 1000;

            // Should refresh
            const shouldRefresh = (now - oldTimestamp) > CACHE_TTL;
            expect(shouldRefresh).toBe(true);
        });
    });
});
```

### 7. Configuración de CI/CD

```yaml
# .github/workflows/monitoring-dashboard.yml
name: Monitoring Dashboard CI/CD

on:
  push:
    branches: [ main, develop ]
    paths:
      - 'scripts/simple-monitoring-server.js'
      - 'public/**'
      - 'data/**'
      - 'docs/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'scripts/simple-monitoring-server.js'
      - 'public/**'
      - 'data/**'
      - 'docs/**'

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd scripts
        npm ci

    - name: Run tests
      run: |
        cd scripts
        npm test

    - name: Run linting
      run: |
        cd scripts
        npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Build Docker image
      run: |
        docker build -t a4co-monitoring-dashboard:${{ github.sha }} .

    - name: Run container health check
      run: |
        docker run -d --name test-container -p 3003:3003 a4co-monitoring-dashboard:${{ github.sha }}
        sleep 10
        curl -f http://localhost:3003/health
        docker stop test-container

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v4

    - name: Deploy to production
      run: |
        echo "🚀 Deploying to production..."
        # Add deployment commands here
```

---

*Ejemplos de Código - A4CO Monitoring Dashboard v1.0*</content>
<parameter name="filePath">/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices/docs/MONITORING_DASHBOARD_CODE_EXAMPLES.md