import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/admin-layout';
import { Loader2 } from 'lucide-react';

// Lazy load the Analytics component
const Analytics = dynamic(() => import('../../../components/admin/analytics'), {
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <div className="text-a4co-olive-600 flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="font-medium">Cargando analytics...</span>
      </div>
    </div>
  ),
});

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <div className="text-a4co-olive-600 flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Cargando analytics...</span>
            </div>
          </div>
        }
      >
        <Analytics />
      </Suspense>
    </AdminLayout>
  );
}
