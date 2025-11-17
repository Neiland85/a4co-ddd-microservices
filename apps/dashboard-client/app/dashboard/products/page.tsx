import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card className="p-6">
        <div className="text-center text-slate-500 dark:text-slate-400 py-12">
          <p className="text-lg font-medium mb-2">No hay productos registrados</p>
          <p className="text-sm">Comienza añadiendo productos a tu catálogo</p>
        </div>
      </Card>
    </div>
  );
}
