'use client';

import dynamic from 'next/dynamic';

const AnimationDemo = dynamic(() => import('../../../components/AnimationDemo'), {
  ssr: false,
  loading: () => <div>Cargando animaciones...</div>,
});

export default function AnimationsPage() {
  return <AnimationDemo />;
}
