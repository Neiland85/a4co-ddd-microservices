import { Router, Request, Response } from 'express';
import { InventoryServicePort } from '../../application/ports/inventory.ports';

export function inventoryRoutes(inventoryService: InventoryServicePort): Router {
  const router = Router();

  // GET /api/inventory/check/:productId
<<<<<<< HEAD
  router.get('/check/:productId', async(req: Request, res: Response) => {
=======
  router.get('/check/:productId', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'productId is required',
        });
      }
      const result = await inventoryService.checkInventory({ productId });
      res.json(result);
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/inventory/check/bulk
<<<<<<< HEAD
  router.post('/check/bulk', async(req: Request, res: Response) => {
=======
  router.post('/check/bulk', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'productIds must be an array',
        });
      }
      const result = await inventoryService.bulkCheckInventory({ productIds });
      res.json(result);
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/inventory/reserve
<<<<<<< HEAD
  router.post('/reserve', async(req: Request, res: Response) => {
=======
  router.post('/reserve', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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
        res.status(200).json(result);
      } else {
        res.status(409).json(result); // Conflict - cannot reserve
      }
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/inventory/release
<<<<<<< HEAD
  router.post('/release', async(req: Request, res: Response) => {
=======
  router.post('/release', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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
        res.status(200).json(result);
      } else {
        res.status(409).json(result); // Conflict - cannot release
      }
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products
<<<<<<< HEAD
  router.get('/products', async(req: Request, res: Response) => {
=======
  router.get('/products', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    try {
      const products = await inventoryService.getAllProducts();
      res.json(products.map(p => p.toJSON()));
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products/low-stock
<<<<<<< HEAD
  router.get('/products/low-stock', async(req: Request, res: Response) => {
=======
  router.get('/products/low-stock', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    try {
      const products = await inventoryService.getLowStockProducts();
      res.json(products.map(p => p.toJSON()));
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products/out-of-stock
<<<<<<< HEAD
  router.get('/products/out-of-stock', async(req: Request, res: Response) => {
=======
  router.get('/products/out-of-stock', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    try {
      const products = await inventoryService.getOutOfStockProducts();
      res.json(products.map(p => p.toJSON()));
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // GET /api/inventory/products/:id
<<<<<<< HEAD
  router.get('/products/:id', async(req: Request, res: Response) => {
=======
  router.get('/products/:id', async (req: Request, res: Response) => {
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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

      res.json(product.toJSON());
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}
