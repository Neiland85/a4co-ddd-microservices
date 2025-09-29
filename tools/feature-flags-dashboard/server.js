const express = require('express');
const { ProductionFeatureFlagService } = require('../packages/feature-flags/production-feature-flag.service');
const { FeatureFlagMetricsService } = require('../packages/feature-flags/metrics.service');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Services (in production, these would be injected)
const featureFlagService = new ProductionFeatureFlagService();
const metricsService = new FeatureFlagMetricsService();

// API Routes
app.get('/api/feature-flags', async (req, res) => {
  try {
    const features = await metricsService.getAllFeaturesStatus();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feature-flags/:name', async (req, res) => {
  try {
    const status = await featureFlagService.getFlagStatus(req.params.name);
    const metrics = await metricsService.getFeatureUsageStats(req.params.name);
    const progress = await metricsService.getRolloutProgress(req.params.name);
    const health = await metricsService.getFeatureHealthScore(req.params.name);

    res.json({
      ...status,
      metrics,
      progress,
      health,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feature-flags/:name/toggle', async (req, res) => {
  try {
    const { enabled } = req.body;
    await featureFlagService.setFlag(req.params.name, enabled);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feature-flags/rollout', async (req, res) => {
  try {
    const { flagName, strategy, value } = req.body;

    let rolloutStrategy;
    switch (strategy) {
      case 'percentage':
        rolloutStrategy = { strategy: 'percentage', percentage: parseFloat(value) };
        break;
      case 'gradual':
        rolloutStrategy = { strategy: 'gradual', duration: parseFloat(value) * 60 * 60 * 1000 };
        break;
      case 'user_list':
        rolloutStrategy = { strategy: 'user_list', users: value.split(',') };
        break;
      default:
        throw new Error('Invalid rollout strategy');
    }

    await featureFlagService.startRollout(flagName, rolloutStrategy);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feature-flags/:name/rollback', async (req, res) => {
  try {
    const { type, ...params } = req.body;

    switch (type) {
      case 'emergency':
        await featureFlagService.setFlag(req.params.name, false);
        await featureFlagService.stopRollout(req.params.name);
        break;
      case 'percentage':
        await featureFlagService.startRollout(req.params.name, {
          strategy: 'percentage',
          percentage: parseFloat(params.percentage),
          reverse: true,
        });
        break;
      default:
        throw new Error('Invalid rollback type');
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(port, () => {
  console.log(`🚩 Feature Flags Dashboard API running on port ${port}`);
  console.log(`📊 Dashboard available at http://localhost:${port}`);
});

module.exports = app;
