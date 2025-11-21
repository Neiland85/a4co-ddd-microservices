import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProductService } from './application/services/product.service';
import { ProductController } from './product.controller';
import { ImageUploadService } from './infrastructure/services/image-upload.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const extension = extname(file.originalname);
          const filename = `${timestamp}-${randomSuffix}${extension}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/png', 'image/jpeg', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error(`Tipo de archivo no permitido. Solo se permiten: ${allowedMimes.join(', ')}`),
            false,
          );
        }
      },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ImageUploadService],
  exports: [ProductService, ImageUploadService],
})
export class ProductModule {}
