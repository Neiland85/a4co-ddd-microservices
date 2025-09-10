import { Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/use-cases/CreateProductUseCase';
import { UpdateProductPriceUseCase } from '../../application/use-cases/UpdateProductPriceUseCase';
import { GetProductByIdUseCase } from '../../application/use-cases/GetProductByIdUseCase';
import { SearchProductsUseCase } from '../../application/use-cases/SearchProductsUseCase';

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductPriceUseCase: UpdateProductPriceUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase
  ) {}

  /**
   * POST /api/products
   * Crear un nuevo producto
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { sku, name, description, price, currency, categoryId, variants, images, attributes } =
        req.body;

      const result = await this.createProductUseCase.execute({
        sku,
        name,
        description,
        price,
        currency,
        categoryId,
        variants: variants || [],
        images: images || [],
        attributes: attributes || [],
      });

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          error: result.error,
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: {
          productId: result.getValue().productId,
          sku: result.getValue().sku,
          name: result.getValue().name,
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/products/:id
   * Obtener un producto por ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.getProductByIdUseCase.execute({ productId: id });

      if (result.isFailure) {
        res.status(404).json({
          success: false,
          error: result.error,
        });
        return;
      }

      const product = result.getValue();

      res.json({
        success: true,
        data: {
          id: product.productId,
          sku: product.sku,
          name: product.name,
          description: product.description,
          price: {
            amount: product.price.amount,
            currency: product.price.currency,
          },
          categoryId: product.categoryId,
          isActive: product.isActive,
          variants: product.variants.map(v => ({
            id: v.id,
            sku: v.sku,
            name: v.name,
            price: v.price,
            stockQuantity: v.stockQuantity,
            availableQuantity: v.availableQuantity,
            attributes: v.attributes,
          })),
          images: product.images.map(img => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary,
          })),
          attributes: product.attributes.map(attr => ({
            name: attr.name,
            value: attr.value,
            groupName: attr.groupName,
          })),
          totalStock: product.getTotalStock(),
          isInStock: product.isInStock(),
        },
      });
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * PUT /api/products/:id/price
   * Actualizar el precio de un producto
   */
  async updateProductPrice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { price, currency } = req.body;

      if (!price || !currency) {
        res.status(400).json({
          success: false,
          error: 'Price and currency are required',
        });
        return;
      }

      const result = await this.updateProductPriceUseCase.execute({
        productId: id,
        newPrice: price,
        currency,
      });

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          error: result.error,
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product price updated successfully',
      });
    } catch (error) {
      console.error('Error updating product price:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/products/search
   * Buscar productos
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q, categoryIds, minPrice, maxPrice, isActive, page = 1, limit = 20 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const result = await this.searchProductsUseCase.execute({
        query: q as string,
        categoryIds: categoryIds ? String(categoryIds).split(',') : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        isActive: isActive === 'true',
        skip,
        take: Number(limit),
      });

      if (result.isFailure) {
        res.status(400).json({
          success: false,
          error: result.error,
        });
        return;
      }

      const { products, total } = result.getValue();

      res.json({
        success: true,
        data: {
          products: products.map(product => ({
            id: product.productId,
            sku: product.sku,
            name: product.name,
            description: product.description,
            price: {
              amount: product.price.amount,
              currency: product.price.currency,
            },
            categoryId: product.categoryId,
            isActive: product.isActive,
            primaryImage: product.images.find(img => img.isPrimary)?.url,
            totalStock: product.getTotalStock(),
            isInStock: product.isInStock(),
          })),
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /api/products/:id/availability
   * Verificar disponibilidad de un producto (comunicación síncrona)
   */
  async checkProductAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { variantId } = req.query;

      const result = await this.getProductByIdUseCase.execute({ productId: id });

      if (result.isFailure) {
        res.status(404).json({
          success: false,
          error: 'Product not found',
        });
        return;
      }

      const product = result.getValue();

      if (variantId) {
        const variant = product.variants.find(v => v.id === variantId);
        if (!variant) {
          res.status(404).json({
            success: false,
            error: 'Variant not found',
          });
          return;
        }

        res.json({
          success: true,
          data: {
            productId: product.productId,
            variantId: variant.id,
            available: variant.availableQuantity > 0,
            quantity: variant.availableQuantity,
          },
        });
      } else {
        res.json({
          success: true,
          data: {
            productId: product.productId,
            available: product.isInStock(),
            quantity: product.getTotalStock(),
          },
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
