'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Flag,
  MessageSquare,
  ImageIcon,
  Video,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface ContentReport {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  reason: string;
  reporter: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
  severity: 'low' | 'medium' | 'high';
}

export function ContentModeration() {
  const [reports, setReports] = useState<ContentReport[]>([
    {
      id: '1',
      type: 'text',
      content: 'Comentario inapropiado sobre...',
      reason: 'Lenguaje ofensivo',
      reporter: 'usuario123',
      timestamp: new Date(Date.now() - 300000),
      status: 'pending',
      severity: 'medium',
    },
    {
      id: '2',
      type: 'image',
      content: 'Imagen reportada por contenido inapropiado',
      reason: 'Contenido explícito',
      reporter: 'moderador1',
      timestamp: new Date(Date.now() - 600000),
      status: 'pending',
      severity: 'high',
    },
    {
      id: '3',
      type: 'text',
      content: 'Spam repetitivo en múltiples publicaciones',
      reason: 'Spam',
      reporter: 'usuario456',
      timestamp: new Date(Date.now() - 900000),
      status: 'approved',
      severity: 'low',
    },
  ]);

  const [moderationNote, setModerationNote] = useState('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    }
  };

  const moderateContent = (id: string, action: 'approve' | 'reject') => {
    setReports(prev =>
      prev.map(report =>
        report.id === id
          ? { ...report, status: action === 'approve' ? 'approved' : 'rejected' }
          : report
      )
    );
  };

  const pendingReports = reports.filter(r => r.status === 'pending');
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status !== 'pending').length;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Flag className="h-5 w-5" />
          <span>Moderación de Contenido</span>
        </CardTitle>
        <CardDescription>Revisión y moderación de contenido reportado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-500">{pendingReports.length}</div>
            <div className="text-muted-foreground text-xs">Pendientes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">{resolvedReports}</div>
            <div className="text-muted-foreground text-xs">Resueltos</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalReports}</div>
            <div className="text-muted-foreground text-xs">Total</div>
          </div>
        </div>

        {/* Reportes pendientes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Reportes Pendientes</h4>
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {pendingReports.map(report => (
              <Alert key={report.id} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(report.type)}
                      <Badge variant={getSeverityColor(report.severity)} className="text-xs">
                        {report.severity.toUpperCase()}
                      </Badge>
                      {getStatusIcon(report.status)}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {report.timestamp.toLocaleString('es-ES')}
                    </span>
                  </div>

                  <AlertDescription className="space-y-1 text-xs">
                    <div>
                      <strong>Contenido:</strong> {report.content}
                    </div>
                    <div>
                      <strong>Razón:</strong> {report.reason}
                    </div>
                    <div>
                      <strong>Reportado por:</strong> {report.reporter}
                    </div>
                  </AlertDescription>

                  {report.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moderateContent(report.id, 'approve')}
                        className="text-xs"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => moderateContent(report.id, 'reject')}
                        className="text-xs"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              </Alert>
            ))}
          </div>
        </div>

        {/* Notas de moderación */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Notas de Moderación</label>
          <Textarea
            placeholder="Agregar notas sobre la moderación..."
            value={moderationNote}
            onChange={e => setModerationNote(e.target.value)}
            className="text-xs"
            rows={2}
          />
          <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
            Guardar Notas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
