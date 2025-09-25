import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateProductDTO,
  ProductService,
  UpdateProductDTO,
} from './application/services/product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Get('sku/:sku')
  @ApiOperation({ summary: 'Obtener producto por SKU' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductBySku(@Param('sku') sku: string) {
    return await this.productService.getProductBySku(sku);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener producto por slug' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async getProductBySlug(@Param('slug') slug: string) {
    return await this.productService.getProductBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async createProduct(@Body() productData: CreateProductDTO) {
    return await this.productService.createProduct(productData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async updateProduct(@Param('id') id: string, @Body() productData: UpdateProductDTO) {
    const updateDto = { ...productData, id };
    return await this.productService.updateProduct(updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publicar producto' })
  @ApiResponse({ status: 200, description: 'Producto publicado exitosamente' })
  async publishProduct(@Param('id') id: string) {
    return await this.productService.publishProduct(id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archivar producto' })
  @ApiResponse({ status: 200, description: 'Producto archivado exitosamente' })
  async archiveProduct(@Param('id') id: string) {
    return await this.productService.archiveProduct(id);
  }
}
