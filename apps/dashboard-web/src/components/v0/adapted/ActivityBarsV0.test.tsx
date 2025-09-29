import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ActivityBarsV0 from './ActivityBarsV0';

// Mock de hooks locales
vi.mock('../../../hooks/useSalesOpportunities', () => ({
  useSalesOpportunities: () => ({
    opportunities: [],
    loading: false,
  }),
}));

vi.mock('../../../hooks/useProducts', () => ({
  useProducts: () => ({
    products: [],
    loading: false,
  }),
}));

describe('ActivityBarsV0', () => {
  it('renders with A4CO branding', () => {
    render(<ActivityBarsV0 />);
    const heading = screen.getByText('📊 Estadísticas del Mercado Local de Jaén');
    expect(heading).toBeTruthy();
  });

  it('displays market metrics description', () => {
    render(<ActivityBarsV0 />);
    const description = screen.getByText('Métricas de actividad y rendimiento del marketplace');
    expect(description).toBeTruthy();
  });

  it('shows product and opportunity counts', () => {
    render(<ActivityBarsV0 />);
    expect(screen.getByText('📦 0 productos activos')).toBeTruthy();
    expect(screen.getByText('💰 0 oportunidades de venta')).toBeTruthy();
  });

  it('renders the raw ActivityBars component', () => {
    const { container } = render(<ActivityBarsV0 />);
    // Verificar que el componente se renderiza sin errores
    expect(container.firstChild).toBeTruthy();
  });
});
