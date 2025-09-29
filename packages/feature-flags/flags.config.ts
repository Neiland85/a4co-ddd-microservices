export interface FlagConfig {
  development: boolean;
  production: boolean;
  description: string;
}

export const FLAGS_CONFIG: Record<string, FlagConfig> = {
  // Nuevas funcionalidades
  NEW_DASHBOARD: {
    development: true,
    production: false,
    description: 'Nuevo dashboard con métricas DORA'
  },

  ADVANCED_ANALYTICS: {
    development: true,
    production: false,
    description: 'Análisis avanzado de rendimiento'
  },

  // Funcionalidades experimentales
  AI_SUGGESTIONS: {
    development: true,
    production: false,
    description: 'Sugerencias basadas en IA'
  },

  // Optimizaciones de rendimiento
  LAZY_LOADING: {
    development: true,
    production: true,
    description: 'Carga diferida de componentes'
  },

  // Integraciones
  THIRD_PARTY_INTEGRATIONS: {
    development: true,
    production: false,
    description: 'Integraciones con servicios externos'
  },

  // Microservicios avanzados
  MICROSERVICE_COMMUNICATION: {
    development: true,
    production: true,
    description: 'Comunicación avanzada entre microservicios'
  },

  EVENT_DRIVEN_ARCHITECTURE: {
    development: true,
    production: false,
    description: 'Arquitectura basada en eventos'
  },

  // Observabilidad
  ADVANCED_TRACING: {
    development: true,
    production: false,
    description: 'Tracing distribuido avanzado'
  },

  METRICS_COLLECTION: {
    development: true,
    production: true,
    description: 'Recolección automática de métricas'
  },

  LOG_AGGREGATION: {
    development: true,
    production: true,
    description: 'Agregación centralizada de logs'
  },

  // Seguridad
  ADVANCED_SECURITY: {
    development: true,
    production: false,
    description: 'Características de seguridad avanzadas'
  },

  API_RATE_LIMITING: {
    development: true,
    production: true,
    description: 'Rate limiting inteligente para APIs'
  },

  ENCRYPTED_COMMUNICATION: {
    development: true,
    production: true,
    description: 'Comunicación encriptada end-to-end'
  },

  // Base de datos
  READ_REPLICAS: {
    development: false,
    production: false,
    description: 'Réplicas de lectura para alta disponibilidad'
  },

  DATABASE_SHARDING: {
    development: false,
    production: false,
    description: 'Sharding automático de base de datos'
  },

  // Cache avanzado
  MULTI_LEVEL_CACHE: {
    development: true,
    production: false,
    description: 'Cache multinivel (L1, L2, L3)'
  },

  PREDICTIVE_CACHE: {
    development: false,
    production: false,
    description: 'Cache predictivo basado en IA'
  },

  // Machine Learning
  ML_MODEL_SERVING: {
    development: true,
    production: false,
    description: 'Servicio de modelos ML integrados'
  },

  RECOMMENDATION_ENGINE: {
    development: false,
    production: false,
    description: 'Motor de recomendaciones personalizado'
  },

  // DevOps
  AUTO_SCALING: {
    development: false,
    production: false,
    description: 'Auto-scaling inteligente basado en métricas'
  },

  BLUE_GREEN_DEPLOYMENT: {
    development: true,
    production: false,
    description: 'Deployments blue-green para zero-downtime'
  },

  CANARY_RELEASES: {
    development: true,
    production: false,
    description: 'Releases canary para testing gradual'
  },

  // 🚀 BUSINESS FEATURE FLAGS - EXPANSIÓN 2025
  // eCommerce Features
  
// Internal Beta Configuration (10% rollout)
ADVANCED_CHECKOUT: {
  development: true,
  production: false, // Controlled rollout
  description: 'Checkout avanzado con múltiples métodos de pago y validaciones inteligentes - EXTERNAL BETA 25%',
  targeting: {
    enabled: true,
    percentage: 25,
    audience: 'external_beta',
    userIds: [] // Will be populated by rollout service
  }
},

SMART_PRICING: {
  development: true,
  production: false, // Controlled rollout
  description: 'Precios dinámicos basados en demanda y comportamiento del usuario - EXTERNAL BETA 25%',
  targeting: {
    enabled: true,
    percentage: 25,
    audience: 'external_beta',
    userIds: [] // Will be populated by rollout service
  }
},

  PERSONALIZED_RECOMMENDATIONS: {
    development: true,
    production: false,
    description: 'Recomendaciones personalizadas usando machine learning'
  },

  ONE_CLICK_PURCHASE: {
    development: false,
    production: false,
    description: 'Compra con un clic para usuarios premium'
  },

  // Logistics & Operations
  REAL_TIME_TRACKING: {
    development: true,
    production: false,
    description: 'Seguimiento en tiempo real de pedidos con geolocalización'
  },

  INVENTORY_OPTIMIZATION: {
    development: true,
    production: false,
    description: 'Optimización automática de inventario usando predicciones'
  },

  DYNAMIC_ROUTING: {
    development: false,
    production: false,
    description: 'Rutas de entrega optimizadas en tiempo real'
  },

  SUPPLIER_INTEGRATION: {
    development: true,
    production: false,
    description: 'Integración automática con proveedores externos'
  },

  // Analytics & Intelligence
  BUSINESS_INTELLIGENCE: {
    development: true,
    production: false,
    description: 'Dashboard avanzado de business intelligence con KPIs en tiempo real'
  },

  PREDICTIVE_ANALYTICS: {
    development: false,
    production: false,
    description: 'Analytics predictivos para tendencias de venta y demanda'
  },

  CUSTOMER_SEGMENTATION: {
    development: true,
    production: false,
    description: 'Segmentación automática de clientes usando clustering'
  },

  PERFORMANCE_MONITORING: {
    development: true,
    production: true,
    description: 'Monitoreo avanzado de performance con alertas inteligentes'
  },

  // Security & Compliance
  ENHANCED_SECURITY: {
    development: true,
    production: false,
    description: 'Seguridad mejorada con autenticación multifactor avanzada'
  },

  FRAUD_DETECTION: {
    development: true,
    production: false,
    description: 'Detección de fraude usando machine learning'
  },

  GDPR_COMPLIANCE: {
    development: true,
    production: true,
    description: 'Cumplimiento automático de GDPR con gestión de consentimientos'
  },

  AUDIT_TRAIL: {
    development: true,
    production: true,
    description: 'Registro completo de auditoría para compliance'
  }
};

// Helper para verificar flags en código
export const isFlagEnabled = (flagName: string): boolean => {
  const flag = FLAGS_CONFIG[flagName];
  if (!flag) return false;

  return process.env.NODE_ENV === 'production' ?
    flag.production : flag.development;
};
