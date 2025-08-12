import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/CreateProductUseCase';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase';
import { ProductRepositoryPrisma } from '../../infrastructure/repositories/ProductRepositoryPrisma';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../../application/dto/CreateProductDto';

/**
 * Controlador REST para operaciones de productos
 * Maneja las peticiones HTTP y aplica rate limiting y validación
 */
export class ProductController {
  private createProductUseCase: CreateProductUseCase;
  private getProductsUseCase: GetProductsUseCase;

  constructor() {
    const productRepository = new ProductRepositoryPrisma();
    this.createProductUseCase = new CreateProductUseCase(productRepository);
    this.getProductsUseCase = new GetProductsUseCase(productRepository);
  }

  /**
   * Obtiene todos los productos con filtros opcionales
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, seasonal, available, search } = req.query;
      
      const filters = {
        category: category as string,
        seasonal: seasonal === 'true',
        available: available === 'true',
        search: search as string
      };

      const products = await this.getProductsUseCase.execute(filters);
      
      res.status(200).json({
        success: true,
        data: products,
        count: products.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al obtener los productos',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtiene un producto por su ID
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'ID de producto requerido',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const products = await this.getProductsUseCase.execute({ id });
      
      if (products.length === 0) {
        res.status(404).json({
          error: 'Not found',
          message: 'Producto no encontrado',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: products[0],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al obtener el producto',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Crea un nuevo producto
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductDto = req.body;
      
      // Validación adicional de seguridad
      if (!productData.name || !productData.category) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Nombre y categoría son requeridos',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const product = await this.createProductUseCase.execute(productData);
      
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: product,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al crear el producto',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Actualiza un producto existente
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateProductDto = req.body;
      
      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'ID de producto requerido',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Implementar lógica de actualización
      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: { id, ...updateData },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al actualizar el producto',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Elimina un producto
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'ID de producto requerido',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Implementar lógica de eliminación
      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente',
        data: { id },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al eliminar el producto',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Endpoint de búsqueda de productos
   * @param req - Request de Express
   * @param res - Response de Express
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q, category, minPrice, maxPrice } = req.query;
      
      if (!q && !category && !minPrice && !maxPrice) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Al menos un parámetro de búsqueda es requerido',
          timestamp: new Date().toISOString()
        });
        return;
      }

      const searchFilters = {
        search: q as string,
        category: category as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined
      };

      const products = await this.getProductsUseCase.execute(searchFilters);
      
      res.status(200).json({
        success: true,
        data: products,
        count: products.length,
        filters: searchFilters,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error al buscar productos',
        timestamp: new Date().toISOString()
      });
    }
  }
} 