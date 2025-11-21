import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  CreateProductDTO,
  ProductService,
  UpdateProductDTO,
} from './application/services/product.service';
import { ImageUploadService, UploadResult } from './infrastructure/services/image-upload.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductById(@Param('id') id: string): Promise<any> {
    return await this.productService.findById(id);
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Obtener producto por SKU' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductBySku(@Param('sku') sku: string): Promise<any> {
    return await this.productService.findBySku(sku);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener producto por slug' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductBySlug(@Param('slug') slug: string): Promise<any> {
    return await this.productService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async createProduct(@Body() productData: CreateProductDTO): Promise<any> {
    return await this.productService.createProduct(productData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDTO,
  ): Promise<any> {
    return await this.productService.updateProduct({ ...productData, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return await this.productService.deleteProduct(id);
  }

  // STOCK MANAGEMENT ENDPOINTS

  @Post(':id/stock/add')
  @ApiOperation({ summary: 'Agregar stock a producto' })
  @ApiResponse({ status: 200, description: 'Stock agregado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async addStock(@Param('id') id: string, @Body() body: { quantity: number }): Promise<any> {
    return await this.productService.addStockToProduct(id, body.quantity);
  }

  @Post(':id/stock/remove')
  @ApiOperation({ summary: 'Remover stock de producto' })
  @ApiResponse({ status: 200, description: 'Stock removido exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async removeStock(@Param('id') id: string, @Body() body: { quantity: number }): Promise<any> {
    return await this.productService.removeStockFromProduct(id, body.quantity);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Obtener información de stock del producto' })
  @ApiResponse({ status: 200, description: 'Información de stock obtenida' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductStock(
    @Param('id') id: string,
  ): Promise<{ stock: number; isInStock: boolean; isLowStock: boolean }> {
    return await this.productService.getProductStock(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publicar producto' })
  @ApiResponse({ status: 200, description: 'Producto publicado exitosamente' })
  async publishProduct(@Param('id') id: string): Promise<any> {
    return await this.productService.publishProduct(id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archivar producto' })
  @ApiResponse({ status: 200, description: 'Producto archivado exitosamente' })
  async archiveProduct(@Param('id') id: string): Promise<any> {
    return await this.productService.archiveProduct(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir imagen de producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Imagen del producto',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (PNG, JPEG, WebP) - máximo 10MB',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida exitosamente',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: '/uploads/1234567890-abc123.jpg' },
        fileName: { type: 'string', example: '1234567890-abc123.jpg' },
        size: { type: 'number', example: 2048576 },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Archivo inválido o demasiado grande' })
  async uploadImage(@UploadedFile() file: any): Promise<UploadResult> {
    return await this.imageUploadService.uploadImage(file);
  }
}
