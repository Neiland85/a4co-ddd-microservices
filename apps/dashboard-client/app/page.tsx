import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente al dashboard de productos
  redirect('/dashboard/products');
}
