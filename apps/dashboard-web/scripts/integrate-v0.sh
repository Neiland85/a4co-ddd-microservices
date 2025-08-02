#!/bin/bash

# 🎨 Script de Integración V0.dev
# Automatiza la creación de estructura y archivos para componentes v0

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🎨 Script de Integración V0.dev${NC}"
    echo ""
    echo "Uso: ./integrate-v0.sh <ComponentName> [options]"
    echo ""
    echo "Opciones:"
    echo "  --url <url>          URL del componente en v0.dev"
    echo "  --type <type>        Tipo de componente (dashboard|catalog|form|card|modal)"
    echo "  --preset <preset>    Preset de configuración (minimal|elevated|glass)"
    echo "  --analytics          Habilitar analytics por defecto"
    echo "  --help               Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./integrate-v0.sh ProductCatalog --url https://v0.dev/r/abc123"
    echo "  ./integrate-v0.sh UserDashboard --type dashboard --preset elevated --analytics"
    echo ""
}

# Parsear argumentos
COMPONENT_NAME=""
V0_URL=""
COMPONENT_TYPE="card"
PRESET="elevated"
ENABLE_ANALYTICS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --url)
            V0_URL="$2"
            shift 2
            ;;
        --type)
            COMPONENT_TYPE="$2"
            shift 2
            ;;
        --preset)
            PRESET="$2"
            shift 2
            ;;
        --analytics)
            ENABLE_ANALYTICS=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        -*)
            echo -e "${RED}❌ Opción desconocida: $1${NC}"
            show_help
            exit 1
            ;;
        *)
            if [ -z "$COMPONENT_NAME" ]; then
                COMPONENT_NAME="$1"
            else
                echo -e "${RED}❌ Demasiados argumentos${NC}"
                show_help
                exit 1
            fi
            shift
            ;;
    esac
done

# Validar argumentos requeridos
if [ -z "$COMPONENT_NAME" ]; then
    echo -e "${RED}❌ Error: Nombre del componente es requerido${NC}"
    show_help
    exit 1
fi

# Función para validar nombre de componente
validate_component_name() {
    if [[ ! "$COMPONENT_NAME" =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
        echo -e "${RED}❌ Error: El nombre del componente debe empezar con mayúscula y solo contener letras y números${NC}"
        exit 1
    fi
}

# Función para crear directorios
create_directories() {
    echo -e "${BLUE}📁 Creando estructura de directorios...${NC}"
    
    mkdir -p "src/components/v0/raw"
    mkdir -p "src/components/v0/adapted"
    mkdir -p "src/components/custom/enhanced"
    mkdir -p "src/components/custom/wrappers"
    mkdir -p "src/styles/v0"
    
    echo -e "${GREEN}✅ Directorios creados${NC}"
}

# Función para generar configuración de adaptador según tipo
generate_adapter_config() {
    case $COMPONENT_TYPE in
        "dashboard")
            echo '{
  dataMapping: {
    metrics: "metrics",
    charts: "chartData", 
    loading: "loading",
    user: "currentUser"
  },
  eventHandlers: {
    onMetricClick: (metric) => console.log("Metric clicked:", metric),
    onChartInteraction: (data) => console.log("Chart interaction:", data)
  },
  validation: {
    required: ["metrics"],
    optional: ["charts", "loading", "user"]
  }
}'
            ;;
        "catalog")
            echo '{
  dataMapping: {
    products: "products",
    loading: "loading",
    error: "error",
    searchQuery: "searchQuery",
    filters: "filters"
  },
  eventHandlers: {
    onProductClick: (product) => console.log("Product clicked:", product),
    onSearchChange: (query) => console.log("Search query:", query),
    onFilterChange: (filters) => console.log("Filters changed:", filters)
  },
  validation: {
    required: ["products"],
    optional: ["loading", "error", "searchQuery", "filters"]
  }
}'
            ;;
        "form")
            echo '{
  dataMapping: {
    initialValues: "defaultValues",
    errors: "validationErrors",
    loading: "isSubmitting"
  },
  eventHandlers: {
    onSubmit: (values) => console.log("Form submitted:", values),
    onChange: (field, value) => console.log("Field changed:", { field, value }),
    onValidation: (errors) => console.log("Validation errors:", errors)
  },
  validation: {
    required: [],
    optional: ["initialValues", "errors", "loading"]
  }
}'
            ;;
        *)
            echo '{
  dataMapping: {
    // Configurar según necesidades
  },
  eventHandlers: {
    // onClick: (data) => console.log("Clicked:", data)
  },
  styleOverrides: {
    // Estilos CSS personalizados
  }
}'
            ;;
    esac
}

# Función para generar template de wrapper
generate_wrapper_customizations() {
    local analytics_flag="false"
    if [ "$ENABLE_ANALYTICS" = true ]; then
        analytics_flag="true"
    fi
    
    case $PRESET in
        "minimal")
            echo "{
    theme: 'minimal',
    animation: 'none',
    errorBoundary: true,
    analytics: $analytics_flag,
  }"
            ;;
        "glass")
            echo "{
    theme: 'glass',
    animation: 'fade',
    errorBoundary: true,
    analytics: $analytics_flag,
  }"
            ;;
        *)
            echo "{
    theme: 'elevated',
    animation: 'subtle',
    errorBoundary: true,
    analytics: $analytics_flag,
  }"
            ;;
    esac
}

# Función para crear archivo raw
create_raw_file() {
    local file_path="src/components/v0/raw/${COMPONENT_NAME}V0Raw.tsx"
    
    echo -e "${BLUE}📝 Creando archivo raw: ${file_path}${NC}"
    
    cat > "$file_path" << EOF
// 🔒 CÓDIGO ORIGINAL V0.DEV - NO MODIFICAR DIRECTAMENTE
// Fuente: ${V0_URL:-"Pendiente de especificar URL"}
// Fecha de creación: $(date '+%Y-%m-%d %H:%M:%S')
// Tipo de componente: ${COMPONENT_TYPE}

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: Reemplazar este template con el código copiado de v0.dev
export default function ${COMPONENT_NAME}V0Raw() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>${COMPONENT_NAME}</CardTitle>
        <CardDescription>Componente generado con v0.dev</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pendiente: Pegar aquí el código copiado de v0.dev
          </p>
          ${V0_URL:+<a 
            href="$V0_URL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            🔗 Ver en v0.dev
          </a>}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('${COMPONENT_NAME} clicked')}
          >
            Acción de prueba
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Metadata del componente
${COMPONENT_NAME}V0Raw.displayName = '${COMPONENT_NAME}V0Raw';
EOF

    echo -e "${GREEN}✅ Archivo raw creado${NC}"
}

# Función para crear archivo adaptado
create_adapted_file() {
    local file_path="src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"
    local adapter_config=$(generate_adapter_config)
    
    echo -e "${BLUE}📝 Creando archivo adaptado: ${file_path}${NC}"
    
    cat > "$file_path" << 'EOF'
// 🔄 VERSIÓN ADAPTADA PARA INTEGRACIÓN LOCAL
// Conecta el componente v0 raw con datos y eventos locales

'use client';

import React from 'react';
import COMPONENT_RAW from '../raw/COMPONENT_RAW';
import { createV0Adapter, adapterPresets } from '../templates/V0AdapterUtils';

// Configuración del adaptador para COMPONENT_NAME
const adapterConfig = ADAPTER_CONFIG;

// Crear el componente adaptado
export const COMPONENT_V0 = createV0Adapter(
  COMPONENT_RAW,
  adapterConfig
);

// Configuración de tipos para TypeScript
export interface COMPONENT_PROPS {
  // Props específicas del componente
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  
  // Datos personalizados
  customData?: {
    // Definir estructura de datos esperada
    [key: string]: any;
  };
  
  // Eventos personalizados
  onCustomEvent?: (event: string, data: any) => void;
}

// Wrapper tipado del componente
export default function COMPONENT_TYPED(props: COMPONENT_PROPS) {
  return <COMPONENT_V0 {...props} />;
}

// Metadata del componente
COMPONENT_TYPED.displayName = 'COMPONENT_V0';
EOF

    # Reemplazar placeholders
    sed -i '' "s/COMPONENT_RAW/${COMPONENT_NAME}V0Raw/g" "$file_path"
    sed -i '' "s/COMPONENT_V0/${COMPONENT_NAME}V0/g" "$file_path"
    sed -i '' "s/COMPONENT_PROPS/${COMPONENT_NAME}V0Props/g" "$file_path"
    sed -i '' "s/COMPONENT_TYPED/${COMPONENT_NAME}V0Typed/g" "$file_path"
    sed -i '' "s/COMPONENT_NAME/${COMPONENT_NAME}/g" "$file_path"
    
    # Insertar configuración del adaptador
    local temp_file=$(mktemp)
    head -n 8 "$file_path" > "$temp_file"
    echo "$adapter_config" | sed 's/^/  /' >> "$temp_file"
    tail -n +9 "$file_path" >> "$temp_file"
    mv "$temp_file" "$file_path"

    echo -e "${GREEN}✅ Archivo adaptado creado${NC}"
}

# Función para crear archivo enhanced
create_enhanced_file() {
    local file_path="src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
    local wrapper_config=$(generate_wrapper_customizations)
    
    echo -e "${BLUE}📝 Creando archivo enhanced: ${file_path}${NC}"
    
    cat > "$file_path" << EOF
// 🎨 VERSIÓN MEJORADA CON FUNCIONALIDADES ADICIONALES
// Agrega analytics, temas personalizados y funcionalidades extra

'use client';

import React from 'react';
import { ${COMPONENT_NAME}V0 } from '../../v0/adapted/${COMPONENT_NAME}V0';
import { V0ComponentWrapper, v0WrapperPresets } from '../wrappers/V0ComponentWrapper';

// Interface para props del componente enhanced
export interface ${COMPONENT_NAME}EnhancedProps {
  // Props del componente v0 original
  v0Props?: React.ComponentProps<typeof ${COMPONENT_NAME}V0>;
  
  // Funcionalidades adicionales
  analytics?: boolean;
  theme?: 'minimal' | 'elevated' | 'glass';
  animation?: 'subtle' | 'bounce' | 'fade' | 'slide';
  
  // Configuraciones avanzadas
  errorBoundary?: boolean;
  loading?: boolean;
  autoRefresh?: number; // en milisegundos
  
  // Callbacks personalizados
  onCustomEvent?: (event: string, data: any) => void;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  
  // Props adicionales
  className?: string;
  children?: React.ReactNode;
}

// Hook personalizado para ${COMPONENT_NAME}
function use${COMPONENT_NAME}Enhanced(props: ${COMPONENT_NAME}EnhancedProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Efecto de carga
  React.useEffect(() => {
    setIsLoaded(true);
    props.onLoad?.();
  }, [props.onLoad]);
  
  // Auto-refresh si está configurado
  React.useEffect(() => {
    if (!props.autoRefresh) return;
    
    const interval = setInterval(() => {
      // Trigger refresh logic aquí
      console.log('Auto-refreshing ${COMPONENT_NAME}');
    }, props.autoRefresh);
    
    return () => clearInterval(interval);
  }, [props.autoRefresh]);
  
  return { isLoaded };
}

// Componente Enhanced principal
export function ${COMPONENT_NAME}Enhanced({
  v0Props = {},
  analytics = ${ENABLE_ANALYTICS},
  theme = '${PRESET}',
  animation = 'subtle',
  errorBoundary = true,
  loading = false,
  autoRefresh,
  onCustomEvent,
  onError,
  onLoad,
  className,
  children,
}: ${COMPONENT_NAME}EnhancedProps) {
  
  // Hook personalizado
  const { isLoaded } = use${COMPONENT_NAME}Enhanced({ 
    autoRefresh, 
    onLoad 
  });
  
  // Configuración del wrapper
  const wrapperCustomizations = ${wrapper_config.replace(/^/gm, '    ')};
  
  // Event handler mejorado
  const handleCustomEvent = React.useCallback((event: string, data: any) => {
    // Analytics automático
    if (analytics) {
      console.log(\`📊 ${COMPONENT_NAME} Analytics: \${event}\`, data);
    }
    
    // Callback personalizado
    onCustomEvent?.(event, data);
  }, [analytics, onCustomEvent]);
  
  return (
    <V0ComponentWrapper
      v0Component={${COMPONENT_NAME}V0}
      customizations={{
        ...wrapperCustomizations,
        theme,
        animation,
        analytics,
        errorBoundary,
        loading,
        className: \`enhanced-${COMPONENT_NAME.toLowerCase()} \${className || ''}\`.trim(),
      }}
      onError={onError}
      onEvent={handleCustomEvent}
      {...v0Props}
    >
      {children}
    </V0ComponentWrapper>
  );
}

// Export por defecto
export default ${COMPONENT_NAME}Enhanced;

// Presets específicos para este componente
export const ${COMPONENT_NAME}Presets = {
  minimal: (props: Partial<${COMPONENT_NAME}EnhancedProps> = {}) => (
    <${COMPONENT_NAME}Enhanced theme="minimal" animation="none" {...props} />
  ),
  
  elevated: (props: Partial<${COMPONENT_NAME}EnhancedProps> = {}) => (
    <${COMPONENT_NAME}Enhanced theme="elevated" animation="subtle" analytics {...props} />
  ),
  
  glass: (props: Partial<${COMPONENT_NAME}EnhancedProps> = {}) => (
    <${COMPONENT_NAME}Enhanced theme="glass" animation="fade" analytics {...props} />
  ),
};

// Metadata del componente
${COMPONENT_NAME}Enhanced.displayName = '${COMPONENT_NAME}Enhanced';
EOF

    echo -e "${GREEN}✅ Archivo enhanced creado${NC}"
}

# Función para crear archivo de estilos
create_styles_file() {
    local file_path="src/styles/v0/${COMPONENT_NAME}.css"
    
    echo -e "${BLUE}🎨 Creando archivo de estilos: ${file_path}${NC}"
    
    cat > "$file_path" << EOF
/* 🎨 Estilos personalizados para ${COMPONENT_NAME}
   Variables CSS y clases para personalización */

.enhanced-${COMPONENT_NAME,,} {
  /* Variables CSS personalizables */
  --${COMPONENT_NAME,,}-primary: var(--primary);
  --${COMPONENT_NAME,,}-secondary: var(--secondary);
  --${COMPONENT_NAME,,}-background: var(--background);
  --${COMPONENT_NAME,,}-foreground: var(--foreground);
  --${COMPONENT_NAME,,}-border: var(--border);
  --${COMPONENT_NAME,,}-radius: var(--radius);
  
  /* Transiciones suaves */
  transition: all 0.2s ease-in-out;
}

/* Temas específicos */
.enhanced-${COMPONENT_NAME,,}.v0-theme-minimal {
  box-shadow: none;
  border: 1px solid var(--${COMPONENT_NAME,,}-border);
  background: var(--${COMPONENT_NAME,,}-background);
}

.enhanced-${COMPONENT_NAME,,}.v0-theme-elevated {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: none;
  background: var(--${COMPONENT_NAME,,}-background);
}

.enhanced-${COMPONENT_NAME,,}.v0-theme-glass {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Animaciones */
.enhanced-${COMPONENT_NAME,,}.v0-animation-subtle:hover {
  transform: translateY(-2px);
}

.enhanced-${COMPONENT_NAME,,}.v0-animation-bounce:hover {
  animation: bounce 0.5s ease;
}

.enhanced-${COMPONENT_NAME,,}.v0-animation-fade {
  animation: fadeIn 0.3s ease-in;
}

.enhanced-${COMPONENT_NAME,,}.v0-animation-slide {
  animation: slideIn 0.3s ease-out;
}

/* Estados */
.enhanced-${COMPONENT_NAME,,}.v0-loading {
  opacity: 0.7;
  pointer-events: none;
}

.enhanced-${COMPONENT_NAME,,}.v0-error {
  border-color: hsl(var(--destructive));
  background-color: hsl(var(--destructive) / 0.1);
}

/* Keyframes */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0,-30px,0);
  }
  70% {
    transform: translate3d(0,-15px,0);
  }
  90% {
    transform: translate3d(0,-4px,0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .enhanced-${COMPONENT_NAME,,} {
    /* Ajustes para móvil */
    padding: 0.75rem;
    margin: 0.5rem;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .enhanced-${COMPONENT_NAME,,}.v0-theme-glass {
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
EOF

    echo -e "${GREEN}✅ Archivo de estilos creado${NC}"
}

# Función para crear ejemplo de uso
create_usage_example() {
    local file_path="src/components/v0/examples/${COMPONENT_NAME}Example.tsx"
    
    mkdir -p "src/components/v0/examples"
    
    echo -e "${BLUE}📚 Creando ejemplo de uso: ${file_path}${NC}"
    
    cat > "$file_path" << EOF
// 📚 Ejemplo de uso para ${COMPONENT_NAME}
// Muestra cómo implementar y personalizar el componente

'use client';

import React from 'react';
import ${COMPONENT_NAME}Enhanced, { ${COMPONENT_NAME}Presets } from '../custom/enhanced/${COMPONENT_NAME}Enhanced';
import { ${COMPONENT_NAME}V0 } from '../v0/adapted/${COMPONENT_NAME}V0';

// Datos de ejemplo
const exampleData = {
  // TODO: Definir datos de ejemplo específicos para ${COMPONENT_NAME}
  title: '${COMPONENT_NAME} de Ejemplo',
  description: 'Datos de ejemplo para testing',
  items: [
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'pending' },
    { id: 3, name: 'Item 3', status: 'completed' },
  ],
};

export default function ${COMPONENT_NAME}Example() {
  // Handlers de ejemplo
  const handleCustomEvent = (event: string, data: any) => {
    console.log(\`${COMPONENT_NAME} Event: \${event}\`, data);
  };

  const handleError = (error: Error) => {
    console.error('${COMPONENT_NAME} Error:', error);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Ejemplos de ${COMPONENT_NAME}</h1>
      
      {/* Ejemplo básico - Componente V0 puro */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Componente V0 Básico</h2>
        <${COMPONENT_NAME}V0 
          customData={exampleData}
          onCustomEvent={handleCustomEvent}
        />
      </section>

      {/* Ejemplo Enhanced - Versión mejorada */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Versión Enhanced</h2>
        <${COMPONENT_NAME}Enhanced
          v0Props={{ customData: exampleData }}
          analytics
          theme="elevated"
          animation="subtle"
          onCustomEvent={handleCustomEvent}
          onError={handleError}
        />
      </section>

      {/* Presets predefinidos */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Presets Predefinidos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Minimal</h3>
            <${COMPONENT_NAME}Presets.minimal 
              v0Props={{ customData: exampleData }}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Elevated</h3>
            <${COMPONENT_NAME}Presets.elevated 
              v0Props={{ customData: exampleData }}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Glass</h3>
            <${COMPONENT_NAME}Presets.glass 
              v0Props={{ customData: exampleData }}
            />
          </div>
        </div>
      </section>

      {/* Ejemplo con auto-refresh */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Con Auto-refresh</h2>
        <${COMPONENT_NAME}Enhanced
          v0Props={{ customData: exampleData }}
          analytics
          autoRefresh={5000} // 5 segundos
          onCustomEvent={handleCustomEvent}
        />
      </section>

      {/* Ejemplo personalizado */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Personalización Avanzada</h2>
        <${COMPONENT_NAME}Enhanced
          v0Props={{ 
            customData: exampleData,
            className: "custom-styling"
          }}
          theme="glass"
          animation="bounce"
          analytics
          errorBoundary
          onCustomEvent={handleCustomEvent}
          onError={handleError}
          onLoad={() => console.log('${COMPONENT_NAME} cargado')}
        >
          <div className="mt-4 p-2 bg-muted rounded">
            <p className="text-sm text-muted-foreground">
              Contenido adicional personalizado
            </p>
          </div>
        </${COMPONENT_NAME}Enhanced>
      </section>
    </div>
  );
}
EOF

    echo -e "${GREEN}✅ Ejemplo de uso creado${NC}"
}

# Función para actualizar imports globales
update_imports() {
    local index_file="src/components/v0/index.ts"
    
    echo -e "${BLUE}📦 Actualizando exports centralizados...${NC}"
    
    if [ ! -f "$index_file" ]; then
        cat > "$index_file" << EOF
// 📦 Exports centralizados para componentes V0
// Auto-generado por integrate-v0.sh

EOF
    fi
    
    # Agregar exports del nuevo componente
    cat >> "$index_file" << EOF
// ${COMPONENT_NAME} - Generado $(date '+%Y-%m-%d')
export { default as ${COMPONENT_NAME}V0Raw } from './raw/${COMPONENT_NAME}V0Raw';
export { ${COMPONENT_NAME}V0, default as ${COMPONENT_NAME}V0Typed } from './adapted/${COMPONENT_NAME}V0';
export { ${COMPONENT_NAME}Enhanced, ${COMPONENT_NAME}Presets } from '../custom/enhanced/${COMPONENT_NAME}Enhanced';

EOF

    echo -e "${GREEN}✅ Exports actualizados${NC}"
}

# Función para mostrar resumen final
show_summary() {
    echo ""
    echo -e "${PURPLE}🎉 ¡Integración completada exitosamente!${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
    echo -e "${BLUE}📁 Archivos creados:${NC}"
    echo "   🔒 Raw: src/components/v0/raw/${COMPONENT_NAME}V0Raw.tsx"
    echo "   🔄 Adapted: src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"
    echo "   🎨 Enhanced: src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
    echo "   🎨 Styles: src/styles/v0/${COMPONENT_NAME}.css"
    echo "   📚 Example: src/components/v0/examples/${COMPONENT_NAME}Example.tsx"
    echo ""
    echo -e "${YELLOW}📋 Próximos pasos:${NC}"
    echo "   1. 📋 Copiar código de v0.dev → archivo Raw"
    echo "   2. 🔧 Configurar adaptación → archivo Adapted"
    echo "   3. 🎨 Personalizar enhanced → archivo Enhanced"
    echo "   4. 📦 Importar en tu página/componente"
    echo ""
    echo -e "${GREEN}💡 Ejemplos de importación:${NC}"
    echo ""
    echo "   // Componente básico adaptado"
    echo "   import { ${COMPONENT_NAME}V0 } from '@/components/v0/adapted/${COMPONENT_NAME}V0';"
    echo ""
    echo "   // Versión enhanced con funcionalidades extra"
    echo "   import ${COMPONENT_NAME}Enhanced from '@/components/custom/enhanced/${COMPONENT_NAME}Enhanced';"
    echo ""
    echo "   // Presets predefinidos"
    echo "   import { ${COMPONENT_NAME}Presets } from '@/components/custom/enhanced/${COMPONENT_NAME}Enhanced';"
    echo ""
    echo -e "${BLUE}🔗 URLs útiles:${NC}"
    if [ -n "$V0_URL" ]; then
        echo "   V0.dev: $V0_URL"
    fi
    echo "   Ejemplo: http://localhost:3000/components/examples/${COMPONENT_NAME,,}"
    echo "   Documentación: ./GUIA_INTEGRACION_V0_COMPONENTES.md"
    echo ""
}

# Función principal
main() {
    echo -e "${PURPLE}🎨 Iniciando integración de ${COMPONENT_NAME}...${NC}"
    echo ""
    
    # Validaciones
    validate_component_name
    
    # Crear estructura
    create_directories
    
    # Crear archivos
    create_raw_file
    create_adapted_file
    create_enhanced_file
    create_styles_file
    create_usage_example
    
    # Actualizar imports
    update_imports
    
    # Mostrar resumen
    show_summary
}

# Ejecutar función principal
main 