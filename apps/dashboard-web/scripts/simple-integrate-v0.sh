#!/bin/bash

# 🎨 Script Simplificado de Integración V0.dev
# Versión más simple y robusta

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Argumentos
COMPONENT_NAME=$1
V0_URL=$2

if [ -z "$COMPONENT_NAME" ]; then
    echo "Uso: ./simple-integrate-v0.sh <ComponentName> [v0-url]"
    exit 1
fi

echo -e "${BLUE}🎨 Integrando componente $COMPONENT_NAME...${NC}"

# Crear directorios
mkdir -p "src/components/v0/raw"
mkdir -p "src/components/v0/adapted"
mkdir -p "src/components/custom/enhanced"
mkdir -p "src/styles/v0"

# Crear archivo raw
cat > "src/components/v0/raw/${COMPONENT_NAME}V0Raw.tsx" << 'EOF'
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function COMPONENT_RAW() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>COMPONENT_NAME</CardTitle>
        <CardDescription>Componente generado con v0.dev</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pendiente: Pegar aquí el código copiado de v0.dev
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => console.log('COMPONENT_NAME clicked')}
          >
            Acción de prueba
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

COMPONENT_RAW.displayName = 'COMPONENT_RAW';
EOF

# Reemplazar placeholders en raw
sed -i '' "s/COMPONENT_RAW/${COMPONENT_NAME}V0Raw/g" "src/components/v0/raw/${COMPONENT_NAME}V0Raw.tsx"
sed -i '' "s/COMPONENT_NAME/${COMPONENT_NAME}/g" "src/components/v0/raw/${COMPONENT_NAME}V0Raw.tsx"

# Crear archivo adaptado
cat > "src/components/v0/adapted/${COMPONENT_NAME}V0.tsx" << 'EOF'
'use client';

import React from 'react';
import COMPONENT_RAW from '../raw/COMPONENT_RAW';
import { createV0Adapter } from '../templates/V0AdapterUtils';

const adapterConfig = {
  dataMapping: {
    // Configurar según necesidades
  },
  eventHandlers: {
    // onClick: (data) => console.log('Clicked:', data)
  },
  styleOverrides: {
    // Estilos CSS personalizados
  }
};

export const COMPONENT_V0 = createV0Adapter(
  COMPONENT_RAW,
  adapterConfig
);

export interface COMPONENT_PROPS {
  className?: string;
  customData?: any;
  onCustomEvent?: (event: string, data: any) => void;
}

export default function COMPONENT_TYPED(props: COMPONENT_PROPS) {
  return <COMPONENT_V0 {...props} />;
}

COMPONENT_TYPED.displayName = 'COMPONENT_V0';
EOF

# Reemplazar placeholders en adapted
sed -i '' "s/COMPONENT_RAW/${COMPONENT_NAME}V0Raw/g" "src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"
sed -i '' "s/COMPONENT_V0/${COMPONENT_NAME}V0/g" "src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"
sed -i '' "s/COMPONENT_PROPS/${COMPONENT_NAME}V0Props/g" "src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"
sed -i '' "s/COMPONENT_TYPED/${COMPONENT_NAME}V0Typed/g" "src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"

# Crear archivo enhanced
cat > "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx" << 'EOF'
'use client';

import React from 'react';
import { COMPONENT_V0 } from '../../v0/adapted/COMPONENT_V0';
import { V0ComponentWrapper } from '../wrappers/V0ComponentWrapper';

export interface COMPONENT_ENHANCED_PROPS {
  v0Props?: React.ComponentProps<typeof COMPONENT_V0>;
  analytics?: boolean;
  theme?: 'minimal' | 'elevated' | 'glass';
  animation?: 'subtle' | 'bounce' | 'fade' | 'slide';
  errorBoundary?: boolean;
  loading?: boolean;
  onCustomEvent?: (event: string, data: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
}

export function COMPONENT_ENHANCED({
  v0Props = {},
  analytics = false,
  theme = 'elevated',
  animation = 'subtle',
  errorBoundary = true,
  loading = false,
  onCustomEvent,
  onError,
  className,
  children,
}: COMPONENT_ENHANCED_PROPS) {
  
  const handleCustomEvent = React.useCallback((event: string, data: any) => {
    if (analytics) {
      console.log(`📊 COMPONENT_NAME Analytics: ${event}`, data);
    }
    onCustomEvent?.(event, data);
  }, [analytics, onCustomEvent]);
  
  return (
    <V0ComponentWrapper
      v0Component={COMPONENT_V0}
      customizations={{
        theme,
        animation,
        analytics,
        errorBoundary,
        loading,
        className: `enhanced-${COMPONENT_NAME_LOWER} ${className || ''}`.trim(),
      }}
      onError={onError}
      onEvent={handleCustomEvent}
      {...v0Props}
    >
      {children}
    </V0ComponentWrapper>
  );
}

export default COMPONENT_ENHANCED;

export const COMPONENT_PRESETS = {
  minimal: (props: Partial<COMPONENT_ENHANCED_PROPS> = {}) => (
    <COMPONENT_ENHANCED theme="minimal" animation="none" {...props} />
  ),
  elevated: (props: Partial<COMPONENT_ENHANCED_PROPS> = {}) => (
    <COMPONENT_ENHANCED theme="elevated" animation="subtle" analytics {...props} />
  ),
  glass: (props: Partial<COMPONENT_ENHANCED_PROPS> = {}) => (
    <COMPONENT_ENHANCED theme="glass" animation="fade" analytics {...props} />
  ),
};

COMPONENT_ENHANCED.displayName = 'COMPONENT_ENHANCED';
EOF

# Reemplazar placeholders en enhanced
sed -i '' "s/COMPONENT_V0/${COMPONENT_NAME}V0/g" "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
sed -i '' "s/COMPONENT_ENHANCED/${COMPONENT_NAME}Enhanced/g" "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
sed -i '' "s/COMPONENT_ENHANCED_PROPS/${COMPONENT_NAME}EnhancedProps/g" "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
sed -i '' "s/COMPONENT_PRESETS/${COMPONENT_NAME}Presets/g" "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
sed -i '' "s/COMPONENT_NAME/${COMPONENT_NAME}/g" "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
sed -i '' "s/COMPONENT_NAME_LOWER/${COMPONENT_NAME,,}/g" "src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"

# Crear estilos
cat > "src/styles/v0/${COMPONENT_NAME}.css" << 'EOF'
/* Estilos para COMPONENT_NAME */

.enhanced-COMPONENT_NAME_LOWER {
  --COMPONENT_NAME_LOWER-primary: var(--primary);
  --COMPONENT_NAME_LOWER-secondary: var(--secondary);
  --COMPONENT_NAME_LOWER-background: var(--background);
  --COMPONENT_NAME_LOWER-foreground: var(--foreground);
  --COMPONENT_NAME_LOWER-border: var(--border);
  --COMPONENT_NAME_LOWER-radius: var(--radius);
  
  transition: all 0.2s ease-in-out;
}

.enhanced-COMPONENT_NAME_LOWER.v0-theme-minimal {
  box-shadow: none;
  border: 1px solid var(--COMPONENT_NAME_LOWER-border);
  background: var(--COMPONENT_NAME_LOWER-background);
}

.enhanced-COMPONENT_NAME_LOWER.v0-theme-elevated {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: none;
  background: var(--COMPONENT_NAME_LOWER-background);
}

.enhanced-COMPONENT_NAME_LOWER.v0-theme-glass {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.enhanced-COMPONENT_NAME_LOWER.v0-animation-subtle:hover {
  transform: translateY(-2px);
}

.enhanced-COMPONENT_NAME_LOWER.v0-animation-bounce:hover {
  animation: bounce 0.5s ease;
}

.enhanced-COMPONENT_NAME_LOWER.v0-animation-fade {
  animation: fadeIn 0.3s ease-in;
}

.enhanced-COMPONENT_NAME_LOWER.v0-animation-slide {
  animation: slideIn 0.3s ease-out;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-30px,0); }
  70% { transform: translate3d(0,-15px,0); }
  90% { transform: translate3d(0,-4px,0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
EOF

# Reemplazar placeholders en estilos
sed -i '' "s/COMPONENT_NAME/${COMPONENT_NAME}/g" "src/styles/v0/${COMPONENT_NAME}.css"
sed -i '' "s/COMPONENT_NAME_LOWER/${COMPONENT_NAME,,}/g" "src/styles/v0/${COMPONENT_NAME}.css"

echo -e "${GREEN}✅ ¡Integración completada!${NC}"
echo ""
echo -e "${YELLOW}📁 Archivos creados:${NC}"
echo "   🔒 Raw: src/components/v0/raw/${COMPONENT_NAME}V0Raw.tsx"
echo "   🔄 Adapted: src/components/v0/adapted/${COMPONENT_NAME}V0.tsx"
echo "   🎨 Enhanced: src/components/custom/enhanced/${COMPONENT_NAME}Enhanced.tsx"
echo "   🎨 Styles: src/styles/v0/${COMPONENT_NAME}.css"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "   1. Copiar código de v0.dev → archivo Raw"
echo "   2. Configurar adaptación → archivo Adapted"
echo "   3. Personalizar enhanced → archivo Enhanced"
echo "   4. Importar en tu página"
echo ""
echo -e "${GREEN}💡 Ejemplo de uso:${NC}"
echo "   import ${COMPONENT_NAME}Enhanced from '@/components/custom/enhanced/${COMPONENT_NAME}Enhanced';" 