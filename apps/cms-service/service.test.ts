import { CmsService } from './service';

describe('CmsService', () => {
  const cmsService = new CmsService();

  it('should create a page', () => {
    const result = cmsService.createPage('Inicio', 'Contenido de la página');
    expect(result).toBe('Página \'Inicio\' creada con contenido.');
  });

  it('should update a page', () => {
    const result = cmsService.updatePage('page1', 'Nuevo contenido');
    expect(result).toBe('Página con ID page1 actualizada.');
  });
});
