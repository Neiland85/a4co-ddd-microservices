export class ProductService {
  addProduct(name: string, price: number): string {
    return `Producto ${name} agregado con precio ${price}.`;
  }

  getProduct(name: string): string {
    return `Información del producto ${name}.`;
  }
}
