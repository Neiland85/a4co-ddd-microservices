import { CreateProductUseCase } from '../../../../src/application/use-cases/CreateProductUseCase';
import { CreateProductDto } from '../../../../src/application/dto/CreateProductDto';
import { Product } from '../../../../src/domain/entities/Product';
import { ProductRepository } from '../../../../src/domain/interfaces/ProductRepository';

// Mock del repositorio
const mockProductRepository: jest.Mocked<ProductRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByCategory: jest.fn(),
  findBySeasonal: jest.fn(),
  findByAvailable: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
};

describe('CreateProductUseCase', () => {
  let createProductUseCase: CreateProductUseCase;
  let validDto: CreateProductDto;

  beforeEach(() => {
    createProductUseCase = new CreateProductUseCase(mockProductRepository);
    validDto = {
      name: 'Aceite de Oliva',
      category: 'aceite',
      seasonal: true,
      price: 12.5,
      unit: 'botella 500ml',
      description: 'Aceite de primera presión',
      producer: 'Cooperativa San José',
      location: { municipality: 'Úbeda', coordinates: [38.0138, -3.3706] },
      images: ['/images/aceite.jpg'],
      certifications: ['Denominación de Origen'],
      available: true,
      stock: 150,
      harvestDate: '2024-11-15'
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('execute()', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const savedProduct = new Product(
        'prod_1234567890_abc123',
        validDto.name,
        validDto.category,
        validDto.seasonal,
        validDto.price,
        validDto.unit,
        validDto.description,
        validDto.producer,
        validDto.location,
        validDto.images!,
        validDto.certifications!,
        validDto.available!,
        validDto.stock,
        validDto.harvestDate
      );

      mockProductRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await createProductUseCase.execute(validDto);

      // Assert
      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^prod_\d+_[a-z0-9]+$/),
          name: validDto.name,
          category: validDto.category,
          seasonal: validDto.seasonal,
          price: validDto.price,
          unit: validDto.unit,
          description: validDto.description,
          producer: validDto.producer,
          location: validDto.location,
          images: validDto.images,
          certifications: validDto.certifications,
          available: validDto.available,
          stock: validDto.stock,
          harvestDate: validDto.harvestDate
        })
      );

      expect(result).toEqual({
        id: savedProduct.id,
        name: savedProduct.name,
        category: savedProduct.category,
        seasonal: savedProduct.seasonal,
        price: savedProduct.price,
        unit: savedProduct.unit,
        description: savedProduct.description,
        producer: savedProduct.producer,
        location: savedProduct.location,
        images: savedProduct.images,
        certifications: savedProduct.certifications,
        available: savedProduct.available,
        stock: savedProduct.stock,
        harvestDate: savedProduct.harvestDate,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should create a product with minimal data', async () => {
      // Arrange
      const minimalDto: CreateProductDto = {
        name: 'Queso',
        category: 'queso',
        seasonal: false
      };

      const savedProduct = new Product(
        'prod_1234567890_def456',
        minimalDto.name,
        minimalDto.category,
        minimalDto.seasonal
      );

      mockProductRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await createProductUseCase.execute(minimalDto);

      // Assert
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: minimalDto.name,
          category: minimalDto.category,
          seasonal: minimalDto.seasonal,
          images: [],
          certifications: [],
          available: true
        })
      );

      expect(result.available).toBe(true);
      expect(result.images).toEqual([]);
      expect(result.certifications).toEqual([]);
    });

    it('should throw error when name is missing', async () => {
      // Arrange
      const invalidDto = { ...validDto, name: '' };

      // Act & Assert
      await expect(createProductUseCase.execute(invalidDto)).rejects.toThrow('Name and category are required');
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when category is missing', async () => {
      // Arrange
      const invalidDto = { ...validDto, category: '' };

      // Act & Assert
      await expect(createProductUseCase.execute(invalidDto)).rejects.toThrow('Name and category are required');
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when name is undefined', async () => {
      // Arrange
      const invalidDto = { ...validDto, name: undefined as any };

      // Act & Assert
      await expect(createProductUseCase.execute(invalidDto)).rejects.toThrow('Name and category are required');
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when category is undefined', async () => {
      // Arrange
      const invalidDto = { ...validDto, category: undefined as any };

      // Act & Assert
      await expect(createProductUseCase.execute(invalidDto)).rejects.toThrow('Name and category are required');
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository save error', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockProductRepository.save.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(createProductUseCase.execute(validDto)).rejects.toThrow('Database connection failed');
      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle product validation error from domain', async () => {
      // Arrange
      const invalidDto = { ...validDto, price: -5 }; // Negative price will fail validation

      // Act & Assert
      await expect(createProductUseCase.execute(invalidDto)).rejects.toThrow('Product price cannot be negative');
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should set default values correctly', async () => {
      // Arrange
      const dtoWithDefaults = {
        name: 'Test Product',
        category: 'test',
        seasonal: false,
        available: undefined,
        images: undefined,
        certifications: undefined
      };

      const savedProduct = new Product(
        'prod_1234567890_ghi789',
        dtoWithDefaults.name,
        dtoWithDefaults.category,
        dtoWithDefaults.seasonal
      );

      mockProductRepository.save.mockResolvedValue(savedProduct);

      // Act
      const result = await createProductUseCase.execute(dtoWithDefaults);

      // Assert
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          available: true,
          images: [],
          certifications: []
        })
      );

      expect(result.available).toBe(true);
      expect(result.images).toEqual([]);
      expect(result.certifications).toEqual([]);
    });

    it('should generate unique ProductId for each product', async () => {
      // Arrange
      const savedProduct1 = new Product('prod_1234567890_abc123', 'Product 1', 'test', false);
      const savedProduct2 = new Product('prod_1234567891_def456', 'Product 2', 'test', false);

      mockProductRepository.save
        .mockResolvedValueOnce(savedProduct1)
        .mockResolvedValueOnce(savedProduct2);

      // Act
      const result1 = await createProductUseCase.execute(validDto);
      const result2 = await createProductUseCase.execute({ ...validDto, name: 'Product 2' });

      // Assert
      expect(result1.id).not.toBe(result2.id);
      expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
    });
  });
}); 