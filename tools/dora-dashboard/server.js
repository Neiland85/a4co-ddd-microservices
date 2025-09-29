#!/usr/bin/env node

/**
 * DORA Dashboard Server
 * Servidor simple para visualizar métricas DORA
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ruta para obtener métricas más recientes
app.get('/api/metrics/latest', (req, res) => {
  try {
    const files = fs.readdirSync(__dirname)
      .filter(file => file.startsWith('dora-metrics-') && file.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return res.status(404).json({ error: 'No metrics found' });
    }

    const latestFile = path.join(__dirname, files[0]);
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para ejecutar cálculo de métricas
app.post('/api/metrics/calculate', async (req, res) => {
  try {
    console.log('🔄 Ejecutando cálculo de métricas DORA...');

    // Ejecutar script de cálculo
    execSync('node ../../scripts/dora-metrics/calculate-dora-metrics.js', {
      cwd: __dirname,
      stdio: 'inherit'
    });

    res.json({ success: true, message: 'Métricas calculadas exitosamente' });
  } catch (error) {
    console.error('Error calculando métricas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para dora-metrics-latest.json (compatibilidad con dashboard)
app.get('/dora-metrics-latest.json', (req, res) => {
  try {
    const files = fs.readdirSync(__dirname)
      .filter(file => file.startsWith('dora-metrics-') && file.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return res.status(404).json({ error: 'No metrics found' });
    }

    const latestFile = path.join(__dirname, files[0]);
    res.sendFile(latestFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 DORA Dashboard corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api/metrics/latest`);
  console.log(`🔄 Para calcular métricas: POST http://localhost:${PORT}/api/metrics/calculate`);
});

// Exportar para testing
module.exports = app;