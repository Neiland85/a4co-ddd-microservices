import { CmsService } from './service';

export class CmsController {
  private cmsService = new CmsService();

  createPage(title: string, content: string): string {
    return this.cmsService.createPage(title, content);
  }

  updatePage(pageId: string, content: string): string {
    return this.cmsService.updatePage(pageId, content);
  }
}
