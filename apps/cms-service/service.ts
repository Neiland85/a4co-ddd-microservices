export class CmsService {
  createPage(title: string, content: string): string {
    return `Página '${title}' creada con contenido.`;
  }

  updatePage(pageId: string, content: string): string {
    return `Página con ID ${pageId} actualizada.`;
  }
}
