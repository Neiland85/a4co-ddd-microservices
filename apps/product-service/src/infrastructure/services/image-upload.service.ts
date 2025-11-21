import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
}

@Injectable()
export class ImageUploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  async uploadImage(file: any): Promise<UploadResult> {
    // El archivo ya fue validado por Multer en el módulo
    // Solo necesitamos retornar los metadatos
    return {
      url: `/uploads/${file.filename}`,
      fileName: file.filename,
      size: file.size,
    };
  }
}
