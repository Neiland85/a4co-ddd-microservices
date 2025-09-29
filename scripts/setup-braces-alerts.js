#!/usr/bin/env node

/**
 * Configuración de alertas para monitoreo de seguridad de braces
 *
 * Este script configura alertas y notificaciones para el sistema
 * de seguridad de braces expansion.
 */

const fs = require('fs');
const path = require('path');

class BracesSecurityAlertsSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.configDir = path.join(this.projectRoot, 'config');
    this.alertsConfigFile = path.join(this.configDir, 'braces-alerts.config.json');
  }

  /**
   * Configurar alertas básicas
   */
  async setupBasicAlerts() {
    console.log('🚨 Setting up Braces Security Alerts');
    console.log('=====================================\n');

    // Crear directorio de configuración si no existe
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    // Configuración básica de alertas
    const alertsConfig = {
      version: '1.0.0',
      enabled: true,
      alertChannels: {
        console: {
          enabled: true,
          level: 'INFO',
        },
        slack: {
          enabled: false,
          webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
          channel: '#security-alerts',
          username: 'Braces Security Monitor',
        },
        pagerduty: {
          enabled: false,
          integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY || '',
          serviceName: 'braces-security-monitor',
        },
        email: {
          enabled: false,
          smtp: {
            host: process.env.SMTP_HOST || '',
            port: 587,
            secure: false,
            auth: {
              user: process.env.SMTP_USER || '',
              pass: process.env.SMTP_PASS || '',
            },
          },
          recipients: ['security@company.com', 'devops@company.com'],
        },
      },
      alertRules: {
        critical: {
          enabled: true,
          conditions: [
            { type: 'severity', value: 'CRITICAL' },
            { type: 'attack_type', value: 'EXPANSION_ATTACK' },
          ],
          channels: ['console', 'slack', 'pagerduty', 'email'],
          throttle: {
            maxAlertsPerHour: 10,
            cooldownMinutes: 5,
          },
        },
        high: {
          enabled: true,
          conditions: [{ type: 'severity', value: 'HIGH' }],
          channels: ['console', 'slack'],
          throttle: {
            maxAlertsPerHour: 50,
            cooldownMinutes: 15,
          },
        },
        medium: {
          enabled: true,
          conditions: [{ type: 'severity', value: 'MEDIUM' }],
          channels: ['console'],
          throttle: {
            maxAlertsPerHour: 100,
            cooldownMinutes: 30,
          },
        },
        performance: {
          enabled: true,
          conditions: [
            { type: 'processing_time', operator: '>', value: 5000 },
            { type: 'memory_usage', operator: '>', value: 100 * 1024 * 1024 }, // 100MB
          ],
          channels: ['console'],
          throttle: {
            maxAlertsPerHour: 20,
            cooldownMinutes: 60,
          },
        },
      },
      monitoring: {
        metrics: {
          collectionInterval: 60000, // 1 minuto
          retentionDays: 30,
          exportTo: ['console', 'json-file'],
        },
        healthChecks: {
          enabled: true,
          interval: 300000, // 5 minutos
          timeout: 30000, // 30 segundos
          failureThreshold: 3,
        },
      },
      services: {
        'auth-service': {
          alertRules: ['critical', 'high', 'medium'],
          customThresholds: {
            maxRequestsPerMinute: 1000,
            maxBlockedRequestsPerMinute: 50,
          },
        },
        'user-service': {
          alertRules: ['critical', 'high', 'medium'],
          customThresholds: {
            maxRequestsPerMinute: 2000,
            maxBlockedRequestsPerMinute: 100,
          },
        },
        'product-service': {
          alertRules: ['critical', 'high', 'medium'],
          customThresholds: {
            maxRequestsPerMinute: 5000,
            maxBlockedRequestsPerMinute: 200,
          },
        },
        'order-service': {
          alertRules: ['critical', 'high', 'medium', 'performance'],
          customThresholds: {
            maxRequestsPerMinute: 1000,
            maxBlockedRequestsPerMinute: 50,
          },
        },
        'payment-service': {
          alertRules: ['critical', 'high', 'medium'],
          customThresholds: {
            maxRequestsPerMinute: 500,
            maxBlockedRequestsPerMinute: 10,
          },
        },
      },
    };

    // Guardar configuración
    fs.writeFileSync(this.alertsConfigFile, JSON.stringify(alertsConfig, null, 2));
    console.log(`✅ Alerts configuration saved: ${this.alertsConfigFile}\n`);

    // Crear script de monitoreo
    await this.createMonitoringScript();

    // Crear dashboard básico
    await this.createMonitoringDashboard();

    console.log('🎉 Braces security alerts setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Configure environment variables for external services');
    console.log('2. Test alert notifications');
    console.log('3. Set up monitoring dashboard');
    console.log('4. Configure on-call rotations');
  }

  /**
   * Crear script de monitoreo continuo
   */
  async createMonitoringScript() {
    const monitoringScript = `#!/usr/bin/env node

/**
 * Script de monitoreo continuo para seguridad de braces
 */

const { BracesSecurityMonitorFactory } = require('@a4co/shared-utils');
const fs = require('fs');
const path = require('path');

class BracesSecurityMonitor {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'braces-alerts.config.json');
    this.metricsPath = path.join(__dirname, '..', 'logs', 'braces-metrics.json');
    this.alertsPath = path.join(__dirname, '..', 'logs', 'braces-alerts.json');

    // Crear directorios si no existen
    const logsDir = path.dirname(this.metricsPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.loadConfig();
    this.setupEventHandlers();
  }

  loadConfig() {
    try {
      this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    } catch (error) {
      console.error('Failed to load alerts config:', error.message);
      this.config = { enabled: false };
    }
  }

  setupEventHandlers() {
    if (!this.config.enabled) return;

    // Configurar manejadores de eventos para todos los monitores
    const monitors = BracesSecurityMonitorFactory.getAllMonitors();

    monitors.forEach((monitor, serviceName) => {
      monitor.on('alert', (alert) => this.handleAlert(alert, serviceName));
      monitor.on('critical-alert', (alert) => this.handleCriticalAlert(alert, serviceName));
    });

    console.log(\`🚀 Braces security monitoring started for \${monitors.size} services\`);
  }

  handleAlert(alert, serviceName) {
    console.log(\`🚨 [\${serviceName}] Security Alert: \${alert.type} (\${alert.severity})\`);

    // Guardar alerta en archivo
    this.saveAlert(alert, serviceName);

    // Enviar notificaciones según configuración
    this.sendNotifications(alert, serviceName);
  }

  handleCriticalAlert(alert, serviceName) {
    console.error(\`🚨🚨 CRITICAL [\${serviceName}] Security Alert: \${alert.type}\`);
    console.error('Immediate action required!');

    // Para alertas críticas, forzar notificación inmediata
    this.sendCriticalNotifications(alert, serviceName);
  }

  saveAlert(alert, serviceName) {
    try {
      const alerts = this.loadExistingAlerts();
      alerts.push({
        ...alert,
        serviceName,
        savedAt: new Date().toISOString()
      });

      // Mantener solo las últimas 1000 alertas
      if (alerts.length > 1000) {
        alerts.splice(0, alerts.length - 1000);
      }

      fs.writeFileSync(this.alertsPath, JSON.stringify(alerts, null, 2));
    } catch (error) {
      console.error('Failed to save alert:', error.message);
    }
  }

  sendNotifications(alert, serviceName) {
    const rule = this.getAlertRule(alert.severity);
    if (!rule || !rule.enabled) return;

    rule.channels.forEach(channel => {
      this.sendToChannel(channel, alert, serviceName);
    });
  }

  sendCriticalNotifications(alert, serviceName) {
    // Para alertas críticas, enviar a todos los canales habilitados
    Object.entries(this.config.alertChannels).forEach(([channelName, channelConfig]) => {
      if (channelConfig.enabled) {
        this.sendToChannel(channelName, alert, serviceName);
      }
    });
  }

  sendToChannel(channelName, alert, serviceName) {
    const channelConfig = this.config.alertChannels[channelName];
    if (!channelConfig.enabled) return;

    const message = this.formatAlertMessage(alert, serviceName);

    switch (channelName) {
      case 'console':
        console.log(\`[\${channelName.toUpperCase()}] \${message}\`);
        break;
      case 'slack':
        this.sendSlackAlert(channelConfig, message, alert);
        break;
      case 'pagerduty':
        this.sendPagerDutyAlert(channelConfig, alert, serviceName);
        break;
      case 'email':
        this.sendEmailAlert(channelConfig, message, alert);
        break;
    }
  }

  formatAlertMessage(alert, serviceName) {
    return \`🚨 Braces Security Alert

Service: \${serviceName}
Severity: \${alert.severity}
Type: \${alert.type}
Time: \${alert.timestamp}

Expression: \${alert.details.expression?.substring(0, 100) || 'N/A'}
Client IP: \${alert.details.clientIP || 'N/A'}
Endpoint: \${alert.details.endpoint || 'N/A'}

\${alert.details.expansionSize ? \`Expansion Size: \${alert.details.expansionSize}\` : ''}
\${alert.details.processingTime ? \`Processing Time: \${alert.details.processingTime}ms\` : ''}
\`;
  }

  sendSlackAlert(channelConfig, message, alert) {
    if (!channelConfig.webhookUrl) return;

    // Implementar envío a Slack webhook
    console.log('📤 Sending Slack alert...');
    // TODO: Implementar HTTP request a Slack
  }

  sendPagerDutyAlert(channelConfig, alert, serviceName) {
    if (!channelConfig.integrationKey) return;

    // Implementar integración con PagerDuty
    console.log('📤 Sending PagerDuty alert...');
    // TODO: Implementar HTTP request a PagerDuty
  }

  sendEmailAlert(channelConfig, message, alert) {
    // Implementar envío de email
    console.log('📤 Sending email alert...');
    // TODO: Implementar envío SMTP
  }

  getAlertRule(severity) {
    return this.config.alertRules[severity.toLowerCase()];
  }

  loadExistingAlerts() {
    try {
      return JSON.parse(fs.readFileSync(this.alertsPath, 'utf8'));
    } catch {
      return [];
    }
  }

  // Método para obtener métricas actuales
  getMetrics() {
    return BracesSecurityMonitorFactory.getGlobalMetrics();
  }

  // Método para generar reportes
  generateReport() {
    const metrics = this.getMetrics();
    const alerts = this.loadExistingAlerts();

    return {
      timestamp: new Date().toISOString(),
      metrics,
      recentAlerts: alerts.slice(-10),
      alertStats: this.calculateAlertStats(alerts)
    };
  }

  calculateAlertStats(alerts) {
    return alerts.reduce((stats, alert) => {
      stats[alert.severity] = (stats[alert.severity] || 0) + 1;
      return stats;
    }, {});
  }
}

// Exportar para uso programático
module.exports = BracesSecurityMonitor;

// Ejecutar monitoreo si se llama directamente
if (require.main === module) {
  const monitor = new BracesSecurityMonitor();

  // Ejecutar indefinidamente
  setInterval(() => {
    const metrics = monitor.getMetrics();
    console.log(\`📊 [\${new Date().toISOString()}] Metrics: \${metrics.totalRequests} req, \${metrics.blockedRequests} blocked, \${metrics.alertsTriggered} alerts\`);
  }, 60000); // Cada minuto
}
`;

    const monitoringScriptPath = path.join(this.projectRoot, 'scripts', 'braces-monitor.js');
    fs.writeFileSync(monitoringScriptPath, monitoringScript);
    fs.chmodSync(monitoringScriptPath, '755');

    console.log(`✅ Monitoring script created: ${monitoringScriptPath}`);
  }

  /**
   * Crear dashboard básico de monitoreo
   */
  async createMonitoringDashboard() {
    const dashboardHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Braces Security Monitor Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2em; font-weight: bold; color: #2c3e50; }
        .alerts-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .alert { padding: 10px; margin: 5px 0; border-left: 4px solid; }
        .alert.CRITICAL { border-color: #e74c3c; background: #fdf2f2; }
        .alert.HIGH { border-color: #f39c12; background: #fef9e7; }
        .alert.MEDIUM { border-color: #f1c40f; background: #fefce8; }
        .alert.LOW { border-color: #27ae60; background: #f0f9f0; }
        .refresh-btn { background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .refresh-btn:hover { background: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Braces Security Monitor Dashboard</h1>
            <p>Monitoreo en tiempo real de ataques de expansión de braces</p>
            <button class="refresh-btn" onclick="refreshData()">Actualizar</button>
        </div>

        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Total Requests</h3>
                <div class="metric-value" id="totalRequests">-</div>
            </div>
            <div class="metric-card">
                <h3>Requests Blocked</h3>
                <div class="metric-value" id="blockedRequests">-</div>
            </div>
            <div class="metric-card">
                <h3>Alerts Triggered</h3>
                <div class="metric-value" id="alertsTriggered">-</div>
            </div>
            <div class="metric-card">
                <h3>Avg Processing Time</h3>
                <div class="metric-value" id="avgProcessingTime">-</div>
            </div>
        </div>

        <div class="alerts-section">
            <h3>Recent Alerts</h3>
            <div id="alertsList">Loading...</div>
        </div>
    </div>

    <script>
        async function loadData() {
            try {
                // En un entorno real, esto haría una llamada a una API
                // Por ahora, simulamos datos
                const mockData = {
                    totalRequests: 15420,
                    blockedRequests: 23,
                    alertsTriggered: 5,
                    avgProcessingTime: 45,
                    recentAlerts: [
                        {
                            id: 'alert-001',
                            timestamp: new Date().toISOString(),
                            service: 'auth-service',
                            severity: 'HIGH',
                            type: 'EXPANSION_ATTACK',
                            details: {
                                expression: '{1..1000}',
                                clientIP: '192.168.1.100',
                                endpoint: '/api/login'
                            }
                        },
                        {
                            id: 'alert-002',
                            timestamp: new Date(Date.now() - 300000).toISOString(),
                            service: 'product-service',
                            severity: 'MEDIUM',
                            type: 'PATTERN_VIOLATION',
                            details: {
                                expression: '{a,b,c}',
                                clientIP: '10.0.0.50',
                                endpoint: '/api/products/search'
                            }
                        }
                    ]
                };

                updateDashboard(mockData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        function updateDashboard(data) {
            document.getElementById('totalRequests').textContent = data.totalRequests.toLocaleString();
            document.getElementById('blockedRequests').textContent = data.blockedRequests.toLocaleString();
            document.getElementById('alertsTriggered').textContent = data.alertsTriggered.toLocaleString();
            document.getElementById('avgProcessingTime').textContent = data.avgProcessingTime + 'ms';

            const alertsList = document.getElementById('alertsList');
            alertsList.innerHTML = data.recentAlerts.map(alert => \`
                <div class="alert \${alert.severity}">
                    <strong>\${alert.service}</strong> - \${alert.type}
                    <br><small>\${new Date(alert.timestamp).toLocaleString()}</small>
                    <br><small>IP: \${alert.details.clientIP} | Endpoint: \${alert.details.endpoint}</small>
                    \${alert.details.expression ? \`<br><small>Expression: \${alert.details.expression}</small>\` : ''}
                </div>
            \`).join('');
        }

        function refreshData() {
            loadData();
        }

        // Cargar datos iniciales
        loadData();

        // Actualizar cada 30 segundos
        setInterval(loadData, 30000);
    </script>
</body>
</html>`;

    const dashboardPath = path.join(this.projectRoot, 'docs', 'braces-security-dashboard.html');
    fs.writeFileSync(dashboardPath, dashboardHtml);

    console.log(`✅ Monitoring dashboard created: ${dashboardPath}`);
  }

  /**
   * Configurar variables de entorno
   */
  setupEnvironmentVariables() {
    const envTemplate = `# Braces Security Alerts Configuration
# Copy this to your .env file and configure the values

# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# PagerDuty Integration
PAGERDUTY_INTEGRATION_KEY=your_pagerduty_integration_key

# Email SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security Thresholds
BRACES_MAX_EXPANSION_SIZE=1000
BRACES_MAX_RANGE_SIZE=100
BRACES_TIMEOUT_MS=5000
BRACES_MONITORING_ENABLED=true
`;

    const envPath = path.join(this.projectRoot, 'config', 'braces-security.env.example');
    fs.writeFileSync(envPath, envTemplate);

    console.log(`✅ Environment template created: ${envPath}`);
  }
}

// Ejecutar configuración si se llama directamente
if (require.main === module) {
  const setup = new BracesSecurityAlertsSetup();
  setup
    .setupBasicAlerts()
    .then(() => {
      setup.setupEnvironmentVariables();
    })
    .catch(error => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = BracesSecurityAlertsSetup;
