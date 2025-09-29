// apps/dashboard-web/src/components/v0/adapted/InteractiveMapV0.test.tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InteractiveMapV0 from './InteractiveMapV0';

// Mock de los hooks
const mockUseGeolocation = vi.fn();
const mockUseSalesOpportunities = vi.fn();

vi.mock('../../../hooks/useGeolocation', () => ({
  useGeolocation: () => mockUseGeolocation(),
}));

vi.mock('../../../hooks/useSalesOpportunities', () => ({
  useSalesOpportunities: () => mockUseSalesOpportunities(),
}));

describe('InteractiveMapV0', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseGeolocation.mockReturnValue({
      location: { latitude: 37.7793, longitude: -3.7849 },
      loading: false,
    });
    mockUseSalesOpportunities.mockReturnValue({
      opportunities: [],
      loading: false,
    });
  });

  it('renders the component with Jaén branding', () => {
    render(<InteractiveMapV0 />);

    expect(screen.getByText('🗺️ Mapa Interactivo - Mercado Local de Jaén')).toBeTruthy();
    expect(
      screen.getByText('Descubre comercios locales, productores y puntos de venta en la provincia')
    ).toBeTruthy();
  });

  it('shows loading state when hooks are loading', () => {
    mockUseGeolocation.mockReturnValue({
      location: null,
      loading: true,
    });

    render(<InteractiveMapV0 />);
    expect(screen.getByText('Cargando mapa...')).toBeTruthy();
  });

  it('renders the raw interactive map component', () => {
    render(<InteractiveMapV0 />);

    // El componente raw debería estar presente
    expect(screen.getByText('🗺️ Mapa Interactivo - Mercado Local de Jaén')).toBeTruthy();
  });
});
