#!/bin/bash
# Script para métricas DORA - Deployment Frequency, Lead Time, MTTR

echo "=== MÉTRICAS DORA A4CO ==="

# Deployment Frequency
echo "📊 Deployment Frequency (última semana):"
echo "Deploys this week: $(git log --since='1 week ago' --grep='deploy' --oneline | wc -l)"

# Lead Time (simplificado - tiempo promedio de PRs)
echo ""
echo "⏱️  Lead Time for Changes:"
echo "Average PR time: $(gh pr list --state merged --json mergedAt,createdAt --jq '[.[] | (.mergedAt | fromdate) - (.createdAt | fromdate)] | add/length' 2>/dev/null || echo 'Requiere GitHub CLI configurado')"

# MTTR (Mean Time To Recovery)
echo ""
echo "🔧 Mean Time To Recovery:"
echo "Last incident recovery: $(git log --grep='hotfix\|fix.*production' -1 --format='%cr' 2>/dev/null || echo 'No hotfixes found')"

# Change Failure Rate (simplificado)
echo ""
echo "❌ Change Failure Rate:"
echo "Failed deployments (última semana): $(git log --since='1 week ago' --grep='rollback\|revert' --oneline | wc -l)"

echo ""
echo "💡 Recomendaciones:"
echo "- Deployment Frequency: Apunta a múltiples deploys por día"
echo "- Lead Time: <1 hora para cambios críticos"
echo "- MTTR: <1 hora para recovery"
echo "- Change Failure Rate: <15%"