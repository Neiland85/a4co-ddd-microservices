import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente al dashboard
  redirect('/dashboard');
}
