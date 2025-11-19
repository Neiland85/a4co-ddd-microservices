import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@a4co/design-system';
import AnimatedButton from '@/components/AnimatedButton';

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Gestiona el catálogo de productos
          </p>
        </div>
        <AnimatedButton animationIntensity="intense">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </AnimatedButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            <p className="text-lg font-medium mb-2">No hay productos registrados</p>
            <p className="text-sm">Comienza añadiendo productos a tu catálogo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
