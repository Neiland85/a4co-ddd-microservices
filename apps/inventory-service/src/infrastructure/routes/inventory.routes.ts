import { Request, Response, Router } from 'express';
import { InventoryServicePort } from '../../application/ports/inventory.ports';

export function inventoryRoutes(inventoryService: InventoryServicePort): Router {
  const router = Router();

  // GET /api/inventory/check/:productId
  router.get('/check/:productId', async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'productId is required',
        });
      }

      const result = await inventoryService.checkInventory({ productId });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/inventory/check/bulk
  router.post('/check/bulk', async (req: Request, res: Response) => {
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'productIds must be an array',
        });
      }

      const result = await inventoryService.bulkCheckInventory({ productIds });
      return res.json(result);
    } catch (error) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/inventory/reserve
  router.post('/reserve', async (req: Request, res: Response) => {
    try {
      const { productId, quantity, orderId, customerId, expiresAt } = req.body;

      if (!productId || !quantity || !orderId || !customerId || !expiresAt) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Missing required fields: productId, quantity, orderId, customerId, expiresAt',
        });
      }

      const result = await inventoryService.reserveStock({
        productId,
        quantity: Number(quantity),
        orderId,
        customerId,
        expiresAt: new Date(expiresAt),
      });

      if (result.success) {
        return res.status(200).json(result);
      }

      return res.status(409).json(result); // Conflict - cannot reserve
    } catch (error) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/inventory/release
  router.post('/release', async (req: Request, res: Response) => {
    try {
      const { productId, quantity, reason } = req.body;

      if (!productId || !quantity || !reason) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Missing required fields: productId, quantity, reason',
        });
      }

      const result = await inventoryService.releaseStock({
        productId,
        quantity: Number(quantity),
        reason,
      });

      if (result.success) {
        return res.status(200).json(result);
      }

      return res.status(409).json(result); // Conflict - cannot release
    } catch (error) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products
  router.get('/products', async (req: Request, res: Response) => {
    try {
      const products = await inventoryService.getAllProducts();
      return res.json(products.map((product) => product.toJSON()));
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products/low-stock
  router.get('/products/low-stock', async (req: Request, res: Response) => {
    try {
      const products = await inventoryService.getLowStockProducts();
      return res.json(products.map((product) => product.toJSON()));
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products/out-of-stock
  router.get('/products/out-of-stock', async (req: Request, res: Response) => {
    try {
      const products = await inventoryService.getOutOfStockProducts();
      return res.json(products.map((product) => product.toJSON()));
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products/:id
  router.get('/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'id is required',
        });
      }
      const product = await inventoryService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Product with id ${id} not found`,
        });
      }

      return res.json(product.toJSON());
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}
