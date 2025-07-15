import { ArtisanService } from './service';

describe('ArtisanService', () => {
  let artisanService: ArtisanService;

  beforeEach(() => {
    artisanService = new ArtisanService();
  });

  it('should create an artisan profile', () => {
    const result = artisanService.createArtisanProfile('John Doe', 'Pottery');
    expect(result).toBe(
      'Perfil de artesano John Doe creado con especialidad Pottery.'
    );
  });

  it('should get artisan profile information', () => {
    const result = artisanService.getArtisanProfile('John Doe');
    expect(result).toBe('Información del perfil de artesano John Doe.');
  });
});
