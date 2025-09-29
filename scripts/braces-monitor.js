#!/usr/bin/env node

/**
 * Monitor básico de seguridad de braces
 */

const fs = require('fs');
const path = require('path');

class BasicBracesMonitor {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'braces-alerts.config.json');
    this.loadConfig();
  }

  loadConfig() {
    try {
      this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    } catch (error) {
      console.error('Failed to load config:', error.message);
      this.config = { enabled: false };
    }
  }

  simulateAlert() {
    const mockAlert = {
      id: 'test-' + Date.now(),
      timestamp: new Date().toISOString(),
      service: 'test-service',
      severity: 'HIGH',
      type: 'EXPANSION_ATTACK',
      details: {
        expression: '{1..1000}',
        clientIP: '127.0.0.1',
        endpoint: '/api/test',
      },
    };

    console.log('🚨 Test Alert Generated:');
    console.log(JSON.stringify(mockAlert, null, 2));

    if (this.config.alertChannels?.console?.enabled) {
      console.log('📤 Console notification sent');
    }

    if (this.config.alertChannels?.slack?.enabled) {
      console.log('📤 Slack notification would be sent (configure webhook)');
    }

    if (this.config.alertChannels?.pagerduty?.enabled) {
      console.log('📤 PagerDuty notification would be sent (configure integration)');
    }
  }

  showConfig() {
    console.log('🔧 Current Configuration:');
    console.log(JSON.stringify(this.config, null, 2));
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

const monitor = new BasicBracesMonitor();

switch (command) {
  case 'test':
    monitor.simulateAlert();
    break;
  case 'config':
    monitor.showConfig();
    break;
  default:
    console.log('Usage: node scripts/braces-monitor.js [test|config]');
    console.log('  test  - Generate a test alert');
    console.log('  config - Show current configuration');
}
