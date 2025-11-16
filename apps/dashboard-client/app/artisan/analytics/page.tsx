/**
 * Artisan Analytics Page
 * Displays KPIs and charts for artisan performance
 */
'use client';

import { useState, useEffect } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { analyticsApi } from '@/lib/api/client';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Eye, Phone, MousePointerClick, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface Stats {
  profileViews: number;
  contactClicks: number;
  whatsappClicks: number;
  phoneClicks: number;
  websiteClicks: number;
  topProducts: Array<{ name: string; views: number }>;
  viewsOverTime: Array<{ date: string; views: number }>;
}

type Period = '7d' | '30d' | '90d';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function ArtisanAnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    profileViews: 0,
    contactClicks: 0,
    whatsappClicks: 0,
    phoneClicks: 0,
    websiteClicks: 0,
    topProducts: [],
    viewsOverTime: [],
  });
  const [period, setPeriod] = useState<Period>('30d');
  const [isLoading, setIsLoading] = useState(true);

  const artisanId = '1'; // From auth context

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await analyticsApi.getStats(artisanId, period);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set mock data for demo
      setStats({
        profileViews: 1234,
        contactClicks: 89,
        whatsappClicks: 45,
        phoneClicks: 28,
        websiteClicks: 16,
        topProducts: [
          { name: 'Jarrón de Cerámica', views: 245 },
          { name: 'Plato Decorativo', views: 189 },
          { name: 'Taza Artesanal', views: 156 },
          { name: 'Bowl Grande', views: 123 },
          { name: 'Set de Té', views: 98 },
        ],
        viewsOverTime: [
          { date: '01', views: 120 },
          { date: '05', views: 150 },
          { date: '10', views: 180 },
          { date: '15', views: 165 },
          { date: '20', views: 200 },
          { date: '25', views: 190 },
          { date: '30', views: 220 },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactData = [
    { name: 'WhatsApp', value: stats.whatsappClicks },
    { name: 'Teléfono', value: stats.phoneClicks },
    { name: 'Web', value: stats.websiteClicks },
  ];

  const periodLabels = {
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días',
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
          <p className="mt-1 text-gray-600">
            Rendimiento de tu perfil y productos
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                period === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Visitas al Perfil</p>
              <p className="mt-2 text-3xl font-bold text-purple-900">
                {formatNumber(stats.profileViews)}
              </p>
            </div>
            <div className="rounded-full bg-purple-200 p-3">
              <Eye className="h-8 w-8 text-purple-700" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-purple-700">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>+12% vs período anterior</span>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Clics en Contacto</p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {formatNumber(stats.contactClicks)}
              </p>
            </div>
            <div className="rounded-full bg-blue-200 p-3">
              <MousePointerClick className="h-8 w-8 text-blue-700" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-blue-700">
            <TrendingUp className="mr-1 h-4 w-4" />
            <span>+8% vs período anterior</span>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">WhatsApp</p>
              <p className="mt-2 text-3xl font-bold text-green-900">
                {formatNumber(stats.whatsappClicks)}
              </p>
            </div>
            <div className="rounded-full bg-green-200 p-3">
              <Phone className="h-8 w-8 text-green-700" />
            </div>
          </div>
          <div className="mt-3 text-sm text-green-700">
            50% de los contactos
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Teléfono</p>
              <p className="mt-2 text-3xl font-bold text-orange-900">
                {formatNumber(stats.phoneClicks)}
              </p>
            </div>
            <div className="rounded-full bg-orange-200 p-3">
              <Phone className="h-8 w-8 text-orange-700" />
            </div>
          </div>
          <div className="mt-3 text-sm text-orange-700">
            31% de los contactos
          </div>
        </AnimatedCard>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Views Over Time */}
        <AnimatedCard>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Visitas en el Tiempo
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Visitas"
              />
            </LineChart>
          </ResponsiveContainer>
        </AnimatedCard>

        {/* Contact Methods Distribution */}
        <AnimatedCard>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Métodos de Contacto
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contactData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {contactData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AnimatedCard>
      </div>

      {/* Top Products */}
      <AnimatedCard>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Productos Más Vistos
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="views" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </AnimatedCard>

      {/* Insights */}
      <AnimatedCard className="bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">💡 Insights</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              Tu perfil ha recibido un <strong>12% más de visitas</strong> que el
              período anterior. ¡Sigue así!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              WhatsApp es tu canal de contacto preferido (50%). Asegúrate de tener
              notificaciones activas.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              &quot;Jarrón de Cerámica&quot; es tu producto estrella con{' '}
              <strong>245 vistas</strong>. Considera crear productos similares.
            </span>
          </li>
        </ul>
      </AnimatedCard>
    </div>
  );
}
