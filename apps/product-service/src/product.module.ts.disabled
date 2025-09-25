import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductService } from './application/services/product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
