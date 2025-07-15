import { ProductService } from './service';

export class ProductController {
  private productService = new ProductService();

  addProduct(req: { name: string; price: number }): string {
    return this.productService.addProduct(req.name, req.price);
  }

  getProduct(req: { name: string }): string {
    return this.productService.getProduct(req.name);
  }
}
