import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

interface ChunkInfo {
  name: string;
  size: number;
  sizeKB: string;
  modules: string[];
}

interface BundleAnalysis {
  problematicChunks: ChunkInfo[];
  duplicatedModules: Map<string, string[]>;
  totalSize: number;
  recommendations: string[];
}

const THRESHOLD_KB = 50;
const LARGE_MODULE_KB = 10;

export const analyzeBundle = async(): Promise<BundleAnalysis> => {
  console.log('🔍 Iniciando análisis de bundle...\n');

  try {
    // Verificar si existe el directorio
    if (!existsSync('apps/dashboard-web')) {
      throw new Error('No se encontró apps/dashboard-web');
    }

    // Ejecutar build con análisis
    console.log('📦 Construyendo con análisis activado...');
    execSync('cd apps/dashboard-web && ANALYZE=true next build', {
      encoding: 'utf8',
      stdio: 'inherit',
    });

    // Buscar el archivo de stats
    const statsPath = path.join('apps/dashboard-web/.next/analyze/client.json');
    if (!existsSync(statsPath)) {
      throw new Error(
        'No se encontró el archivo de análisis. Asegúrate de tener @next/bundle-analyzer configurado.'
      );
    }

    const stats = JSON.parse(readFileSync(statsPath, 'utf8'));

    // Analizar chunks problemáticos
    const problematicChunks: ChunkInfo[] = [];
    const moduleOccurrences = new Map<string, string[]>();
    let totalSize = 0;

    Object.entries(stats.chunks || {}).forEach(([name, chunk]: [string, WebpackChunk]) => {
      const size = chunk.size || 0;
      totalSize += size;

      if (size > THRESHOLD_KB * 1024) {
        const largeModules = (chunk.modules || [])
          .filter((m: WebpackModule) => m.size > LARGE_MODULE_KB * 1024)
          .map((m: WebpackModule) => `${m.name} (${(m.size / 1024).toFixed(1)}KB)`)
          .slice(0, 5); // Top 5 módulos más grandes

        problematicChunks.push({
          name,
          size,
          sizeKB: `${(size / 1024).toFixed(2)}KB`,
          modules: largeModules,
        });
      }

      // Detectar módulos duplicados
      (chunk.modules || []).forEach((module: any) => {
        const moduleName = module.name;
        if (!moduleOccurrences.has(moduleName)) {
          moduleOccurrences.set(moduleName, []);
        }
        moduleOccurrences.get(moduleName)!.push(name);
      });
    });

    // Filtrar módulos que aparecen en múltiples chunks
    const duplicatedModules = new Map<string, string[]>();
    moduleOccurrences.forEach((chunks, module) => {
      if (chunks.length > 1) {
        duplicatedModules.set(module, chunks);
      }
    });

    // Generar recomendaciones
    const recommendations = generateRecommendations(
      problematicChunks,
      duplicatedModules,
      totalSize,
    );

    // Mostrar resultados
    displayResults({
      problematicChunks,
      duplicatedModules,
      totalSize,
      recommendations,
    });

    return {
      problematicChunks,
      duplicatedModules,
      totalSize,
      recommendations,
    };
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
    throw error;
  }
};

function generateRecommendations(
  chunks: ChunkInfo[],
  duplicates: Map<string, string[]>,
  totalSize: number,
): string[] {
  const recommendations: string[] = [];

  // Recomendaciones por tamaño
  if (totalSize > 1024 * 1024) {
    // > 1MB
    recommendations.push(
      `⚠️ Bundle total excede 1MB (${(totalSize / 1024 / 1024).toFixed(2)}MB). Considera:`,
    );
    recommendations.push('  - Implementar lazy loading para rutas pesadas');
    recommendations.push('  - Revisar dependencias innecesarias en package.json');
  }

  // Recomendaciones por chunks grandes
  chunks.forEach(chunk => {
    if (chunk.size > 200 * 1024) {
      // > 200KB
      recommendations.push(`🔴 Chunk "${chunk.name}" es muy grande (${chunk.sizeKB}). Acciones:`);
      recommendations.push('  - Dividir en chunks más pequeños');
      recommendations.push('  - Mover a lazy loading si no es crítico');

      if (chunk.modules.length > 0) {
        recommendations.push(`  - Revisar módulos grandes: ${chunk.modules[0]}`);
      }
    }
  });

  // Recomendaciones por duplicados
  if (duplicates.size > 0) {
    recommendations.push(`\n📦 Se encontraron ${duplicates.size} módulos duplicados:`);
    let count = 0;
    duplicates.forEach((chunks, module) => {
      if (count++ < 5) {
        // Mostrar solo top 5
        recommendations.push(`  - ${module} aparece en: ${chunks.join(', ')}`);
      }
    });
    recommendations.push('  💡 Solución: Configurar splitChunks para extraer módulos comunes');
  }

  // Configuración sugerida
  if (chunks.length > 0 || duplicates.size > 0) {
    recommendations.push('\n📝 Configuración sugerida para next.config.js:');
    recommendations.push(generateOptimalConfig(chunks, duplicates));
  }

  return recommendations;
}

function generateOptimalConfig(chunks: ChunkInfo[], duplicates: Map<string, string[]>): string {
  return `
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        // Vendor splitting
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([[\\/]|$)/)[1];
            return \`vendor-\${packageName.replace('@', '')}\`;
          },
          priority: 10,
          reuseExistingChunk: true,
        },
        // Common chunks
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
        // Framework chunks
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          name: 'framework',
          priority: 20,
        },
      },
    };
    return config;
  },
});`;
}

function displayResults(analysis: BundleAnalysis): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTADOS DEL ANÁLISIS DE BUNDLE');
  console.log('='.repeat(60) + '\n');

  console.log(`📦 Tamaño total del bundle: ${(analysis.totalSize / 1024 / 1024).toFixed(2)}MB\n`);

  if (analysis.problematicChunks.length > 0) {
    console.log('🚨 CHUNKS PROBLEMÁTICOS (> 50KB):');
    console.log('-'.repeat(60));

    analysis.problematicChunks.forEach(chunk => {
      console.log(`\n📌 ${chunk.name}: ${chunk.sizeKB}`);
      if (chunk.modules.length > 0) {
        console.log('   Módulos más grandes:');
        chunk.modules.forEach(m => console.log(`   - ${m}`));
      }
    });
  }

  if (analysis.duplicatedModules.size > 0) {
    console.log('\n\n🔁 MÓDULOS DUPLICADOS:');
    console.log('-'.repeat(60));

    let count = 0;
    analysis.duplicatedModules.forEach((chunks, module) => {
      if (count++ < 10) {
        console.log(`\n   ${module}`);
        console.log(`   Aparece en: ${chunks.join(', ')}`);
      }
    });

    if (analysis.duplicatedModules.size > 10) {
      console.log(`\n   ... y ${analysis.duplicatedModules.size - 10} más`);
    }
  }

  if (analysis.recommendations.length > 0) {
    console.log('\n\n💡 RECOMENDACIONES:');
    console.log('-'.repeat(60));
    analysis.recommendations.forEach(rec => console.log(rec));
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  analyzeBundle().catch(console.error);
}
