export class ArtisanService {
  createArtisanProfile(name: string, specialty: string): string {
    return `Perfil de artesano ${name} creado con especialidad ${specialty}.`;
  }

  getArtisanProfile(name: string): string {
    return `Información del perfil de artesano ${name}.`;
  }
}
