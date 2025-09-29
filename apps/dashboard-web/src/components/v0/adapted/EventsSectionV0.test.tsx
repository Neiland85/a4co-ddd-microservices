import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EventsSectionV0 from './EventsSectionV0';

describe('EventsSectionV0', () => {
  it('renders with A4CO branding', () => {
    render(<EventsSectionV0 />);
    const heading = screen.getByText('📅 Eventos del Mercado Local de Jaén');
    expect(heading).toBeTruthy();
  });

  it('displays events description', () => {
    render(<EventsSectionV0 />);
    const description = screen.getByText(
      'Ferias, mercados y eventos gastronómicos de la provincia'
    );
    expect(description).toBeTruthy();
  });

  it('shows upcoming events note', () => {
    render(<EventsSectionV0 />);
    expect(screen.getByText('🏛️ Próximos eventos locales y ferias agrícolas')).toBeTruthy();
  });

  it('renders the raw EventsSection component', () => {
    const { container } = render(<EventsSectionV0 />);
    // Verificar que el componente se renderiza sin errores
    expect(container.firstChild).toBeTruthy();
  });

  it('shows upcoming features list', () => {
    render(<EventsSectionV0 />);
    // Verificar que aparecen algunos eventos del componente raw
    expect(screen.getByText('Festival de Música Electrónica')).toBeTruthy();
    expect(screen.getByText('Próximas aventuras culturales')).toBeTruthy();
  });
});
