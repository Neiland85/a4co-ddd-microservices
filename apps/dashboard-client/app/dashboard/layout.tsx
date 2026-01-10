'use client';

import React from 'react';
import { ToastProvider } from '@/lib/context/ToastContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
