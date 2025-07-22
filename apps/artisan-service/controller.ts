import { ArtisanService } from './service';

export class ArtisanController {
  private artisanService = new ArtisanService();

  createArtisanProfile(req: { name: string; specialty: string }): string {
    return this.artisanService.createArtisanProfile(req.name, req.specialty);
  }

  getArtisanProfile(req: { name: string }): string {
    return this.artisanService.getArtisanProfile(req.name);
  }
}
