'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Ban, CheckCircle, Eye, Shield, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'vulnerability' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  ip?: string;
  resolved: boolean;
}

interface SecurityStats {
  totalThreats: number;
  blockedAttacks: number;
  activeMonitoring: boolean;
  lastScan: Date;
}

const INITIAL_EVENTS: SecurityEvent[] = [
  {
    id: '1',
    type: 'unauthorized_access',
    severity: 'high',
    description: 'Intento de acceso fallido desde IP sospechosa',
    timestamp: new Date(Date.now() - 300000),
    ip: '192.168.1.100',
    resolved: false,
  },
  {
    id: '2',
    type: 'vulnerability',
    severity: 'medium',
    description: 'Dependencia con vulnerabilidad detectada',
    timestamp: new Date(Date.now() - 600000),
    resolved: true,
  },
  {
    id: '3',
    type: 'suspicious_activity',
    severity: 'low',
    description: 'Patrón de tráfico inusual detectado',
    timestamp: new Date(Date.now() - 900000),
    resolved: false,
  },
];

const INITIAL_STATS: SecurityStats = {
  totalThreats: 12,
  blockedAttacks: 8,
  activeMonitoring: true,
  lastScan: new Date(),
};

const EVENT_TYPES = ['unauthorized_access', 'vulnerability', 'suspicious_activity'] as const;
const SEVERITY_LEVELS = ['low', 'medium', 'high'] as const;
const UPDATE_INTERVAL = 10000;
const EVENT_PROBABILITY = 0.1;
const MAX_EVENTS = 5;

export function SecurityMonitoring() {
  const [events, setEvents] = useState<SecurityEvent[]>(INITIAL_EVENTS);
  const [stats] = useState<SecurityStats>(INITIAL_STATS);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Generador de eventos optimizado con useCallback
  const generateSecurityEvent = useCallback(
    (): SecurityEvent => ({
      id: Date.now().toString(),
      type: EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)],
      severity: SEVERITY_LEVELS[Math.floor(Math.random() * SEVERITY_LEVELS.length)],
      description: 'Nuevo evento de seguridad detectado',
      timestamp: new Date(),
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      resolved: false,
    }),
    []
  );

  // Función recursiva con setTimeout optimizada
  const scheduleNextUpdate = useCallback(() => {
    if (!mountedRef.current) return;

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      // Simular nuevos eventos de seguridad ocasionalmente
      if (Math.random() < EVENT_PROBABILITY) {
        const newEvent = generateSecurityEvent();
        setEvents(prev => [newEvent, ...prev.slice(0, MAX_EVENTS - 1)]);
      }

      scheduleNextUpdate();
    }, UPDATE_INTERVAL);
  }, [generateSecurityEvent]);

  useEffect(() => {
    mountedRef.current = true;
    scheduleNextUpdate();

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scheduleNextUpdate]);

  // Funciones memoizadas para mejorar rendimiento
  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
      default:
        return 'outline';
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'unauthorized_access':
        return <Ban className="h-4 w-4" />;
      case 'vulnerability':
        return <AlertTriangle className="h-4 w-4" />;
      case 'suspicious_activity':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  }, []);

  const resolveEvent = useCallback((id: string) => {
    setEvents(prev => prev.map(event => (event.id === id ? { ...event, resolved: true } : event)));
  }, []);

  // Eventos recientes memoizados
  const recentEvents = useMemo(() => events.slice(0, 3), [events]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Monitoreo de Seguridad</span>
          </div>
          <Badge
            variant={stats.activeMonitoring ? 'default' : 'destructive'}
            className="bg-green-500"
          >
            {stats.activeMonitoring ? 'Activo' : 'Inactivo'}
          </Badge>
        </CardTitle>
        <CardDescription>Detección y prevención de amenazas en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas de seguridad */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-500">{stats.totalThreats}</div>
            <div className="text-muted-foreground text-xs">Amenazas Detectadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{stats.blockedAttacks}</div>
            <div className="text-muted-foreground text-xs">Ataques Bloqueados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">99.8%</div>
            <div className="text-muted-foreground text-xs">Disponibilidad</div>
          </div>
        </div>

        {/* Eventos recientes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Eventos Recientes</h4>
          {recentEvents.map(event => (
            <Alert key={event.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {getTypeIcon(event.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                        {event.severity.toUpperCase()}
                      </Badge>
                      {event.resolved ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                    <AlertDescription className="text-xs">
                      {event.description}
                      {event.ip && (
                        <span className="text-muted-foreground block">IP: {event.ip}</span>
                      )}
                      <span className="text-muted-foreground block">
                        {event.timestamp.toLocaleString('es-ES')}
                      </span>
                    </AlertDescription>
                  </div>
                </div>
                {!event.resolved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveEvent(event.id)}
                    className="text-xs"
                  >
                    Resolver
                  </Button>
                )}
              </div>
            </Alert>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Shield className="mr-1 h-3 w-3" />
            Escanear
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Eye className="mr-1 h-3 w-3" />
            Ver Todo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
