import { ProductService } from './service';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  it('should add a product', () => {
    const result = productService.addProduct('testProduct', 100);
    expect(result).toBe('Product created successfully: with testProduct and 100');
  });

  it('should get product information', () => {
    const result = productService.getProduct('testProduct');
    expect(result).toBe('Product retrieved successfully: testProduct');
  });
});
