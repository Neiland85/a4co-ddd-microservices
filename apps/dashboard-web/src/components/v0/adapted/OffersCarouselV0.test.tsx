// apps/dashboard-web/src/components/v0/adapted/OffersCarouselV0.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OffersCarouselV0 from './OffersCarouselV0';

describe('OffersCarouselV0', () => {
  it('renders the component with offers branding', () => {
    render(<OffersCarouselV0 />);

    const header = screen.getByText('🛍️ Ofertas Destacadas - Mercado Local de Jaén');
    expect(header).toBeTruthy();
    expect(screen.getByText('Descubre las mejores ofertas de productores locales')).toBeTruthy();
  });

  it('renders the raw offers carousel component', () => {
    const { container } = render(<OffersCarouselV0 />);

    // El componente raw debería estar presente
    expect(container.firstChild).toBeTruthy();
  });

  it('displays the Jaén specific header', () => {
    render(<OffersCarouselV0 />);

    const header = screen.getByText('🛍️ Ofertas Destacadas - Mercado Local de Jaén');
    expect(header).toBeTruthy();
  });
});
