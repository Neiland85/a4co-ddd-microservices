#!/usr/bin/env node

/**
 * Feature Flag Rollback Commands
 * Comandos para ejecutar rollbacks de feature flags
 */

const { RollbackService } = require('../packages/feature-flags/rollback.service');
const { RollbackStrategies } = require('../packages/feature-flags/rollback.strategies');

class RollbackCommands {
  constructor() {
    this.rollbackService = new RollbackService();
  }

  async emergencyRollback(flagName, reason, approvedBy) {
    console.log(`🚨 Executing emergency rollback for '${flagName}'`);
    console.log(`Reason: ${reason}`);
    console.log(`Approved by: ${approvedBy}`);

    const strategy = RollbackStrategies.emergency(reason, approvedBy);
    await this.rollbackService.emergencyRollback(flagName);

    console.log(`✅ Emergency rollback completed`);
  }

  async gradualRollback(flagName, durationHours, reason, approvedBy) {
    console.log(`🔄 Executing gradual rollback for '${flagName}'`);
    console.log(`Duration: ${durationHours} hours`);
    console.log(`Reason: ${reason}`);
    console.log(`Approved by: ${approvedBy}`);

    await this.rollbackService.gradualRollback(flagName, durationHours);
    console.log(`✅ Gradual rollback initiated`);
  }

  async percentageRollback(flagName, percentage, reason, approvedBy) {
    console.log(`📊 Executing percentage rollback for '${flagName}'`);
    console.log(`Target percentage: ${percentage * 100}%`);
    console.log(`Reason: ${reason}`);
    console.log(`Approved by: ${approvedBy}`);

    await this.rollbackService.percentageRollback(flagName, percentage);
    console.log(`✅ Percentage rollback initiated`);
  }

  async checkRollbackStatus(flagName) {
    const status = await this.rollbackService.getRollbackStatus(flagName);
    console.log(`📊 Rollback status for '${flagName}':`, JSON.stringify(status, null, 2));
  }

  showHelp() {
    console.log(`
🚨 Feature Flag Rollback Commands

Emergency Rollback:
  pnpm run rollback:emergency <flag> <reason> <approved-by>

Gradual Rollback:
  pnpm run rollback:gradual <flag> <duration-hours> <reason> <approved-by>

Percentage Rollback:
  pnpm run rollback:percentage <flag> <percentage> <reason> <approved-by>

Check Status:
  pnpm run rollback:status <flag>

Examples:
  pnpm run rollback:emergency NEW_DASHBOARD "High error rate" "tech-lead"
  pnpm run rollback:gradual ADVANCED_ANALYTICS 4 "Performance issues" "engineering-manager"
  pnpm run rollback:percentage AI_SUGGESTIONS 0.5 "User feedback" "product-manager"
  pnpm run rollback:status NEW_DASHBOARD
`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const commands = new RollbackCommands();

  switch (command) {
    case 'emergency':
      const [emergencyFlag, reason, approvedBy] = args.slice(1);
      if (!emergencyFlag || !reason || !approvedBy) {
        console.error('❌ Missing required parameters for emergency rollback');
        commands.showHelp();
        process.exit(1);
      }
      commands.emergencyRollback(emergencyFlag, reason, approvedBy);
      break;

    case 'gradual':
      const [gradualFlag, durationStr, gradualReason, gradualApprovedBy] = args.slice(1);
      const duration = parseFloat(durationStr);
      if (!gradualFlag || isNaN(duration) || !gradualReason || !gradualApprovedBy) {
        console.error('❌ Invalid parameters for gradual rollback');
        commands.showHelp();
        process.exit(1);
      }
      commands.gradualRollback(gradualFlag, duration, gradualReason, gradualApprovedBy);
      break;

    case 'percentage':
      const [percentageFlag, percentageStr, percentageReason, percentageApprovedBy] = args.slice(1);
      const percentage = parseFloat(percentageStr);
      if (!percentageFlag || isNaN(percentage) || !percentageReason || !percentageApprovedBy) {
        console.error('❌ Invalid parameters for percentage rollback');
        commands.showHelp();
        process.exit(1);
      }
      commands.percentageRollback(percentageFlag, percentage, percentageReason, percentageApprovedBy);
      break;

    case 'status':
      const [statusFlag] = args.slice(1);
      if (!statusFlag) {
        console.error('❌ Missing flag name for status check');
        commands.showHelp();
        process.exit(1);
      }
      commands.checkRollbackStatus(statusFlag);
      break;

    default:
      commands.showHelp();
      break;
  }
}

module.exports = RollbackCommands;
