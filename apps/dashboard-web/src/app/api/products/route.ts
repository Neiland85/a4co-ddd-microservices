// API para gestión de productos locales
import { NextRequest, NextResponse } from 'next/server';
import type { LocalProduct } from '../sales-opportunities/route';

// Mock data extendido para productos
const mockProducts: LocalProduct[] = [
  {
    id: 'prod-001',
    name: 'Aceite de Oliva Virgen Extra Picual',
    category: 'aceite',
    producer: 'Cooperativa Olivarera San José',
    location: {
      municipality: 'Úbeda',
      coordinates: [38.0138, -3.3706],
    },
    price: 12.5,
    unit: 'botella 500ml',
    seasonal: true,
    harvestDate: '2024-11-15',
    description:
      'Aceite de primera presión en frío de aceitunas Picual recogidas en su punto óptimo de maduración.',
    images: ['/images/aceite-picual.jpg', '/images/aceite-picual-2.jpg'],
    certifications: ['Denominación de Origen', 'Ecológico'],
    available: true,
    stock: 150,
  },
  {
    id: 'prod-002',
    name: 'Queso de Cabra Artesanal',
    category: 'queso',
    producer: 'Quesería Los Olivos',
    location: {
      municipality: 'Cazorla',
      coordinates: [37.9105, -2.9745],
    },
    price: 8.75,
    unit: 'pieza 250g',
    seasonal: false,
    description:
      'Queso artesanal elaborado con leche fresca de cabras criadas en la Sierra de Cazorla.',
    images: ['/images/queso-cabra.jpg'],
    certifications: ['Artesanal', 'Local'],
    available: true,
    stock: 45,
  },
  {
    id: 'prod-003',
    name: 'Miel de Azahar Sierra Mágina',
    category: 'miel',
    producer: 'Apiarios Hermanos Ruiz',
    location: {
      municipality: 'Huelma',
      coordinates: [37.7253, -3.4675],
    },
    price: 15.0,
    unit: 'tarro 500g',
    seasonal: true,
    harvestDate: '2024-05-20',
    description: 'Miel pura de azahar recolectada en los campos de naranjos de la Sierra Mágina.',
    images: ['/images/miel-azahar.jpg'],
    certifications: ['100% Natural', 'Sin Aditivos'],
    available: true,
    stock: 80,
  },
  {
    id: 'prod-004',
    name: 'Jamón Ibérico de Bellota',
    category: 'jamón',
    producer: 'Dehesa El Encinar',
    location: {
      municipality: 'Andújar',
      coordinates: [38.0384, -4.0517],
    },
    price: 45.0,
    unit: 'kg',
    seasonal: false,
    description: 'Jamón ibérico de cerdos criados en libertad en dehesas de encinas centenarias.',
    images: ['/images/jamon-iberico.jpg'],
    certifications: ['Denominación de Origen', 'Bellota 100%'],
    available: true,
    stock: 25,
  },
  {
    id: 'prod-005',
    name: 'Aceitunas Aliñadas Tradicionales',
    category: 'aceitunas',
    producer: 'Conservas Guadalquivir',
    location: {
      municipality: 'Mengíbar',
      coordinates: [37.9934, -3.9009],
    },
    price: 6.5,
    unit: 'bote 500g',
    seasonal: false,
    description:
      'Aceitunas verdes aliñadas con receta tradicional familiar transmitida por generaciones.',
    images: ['/images/aceitunas-alinadas.jpg'],
    certifications: ['Receta Tradicional', 'Sin Conservantes Artificiales'],
    available: true,
    stock: 120,
  },
  {
    id: 'prod-006',
    name: 'Cerámica Artesanal de Úbeda',
    category: 'artesanía',
    producer: 'Taller Cerámico Paco Tito',
    location: {
      municipality: 'Úbeda',
      coordinates: [38.0138, -3.3706],
    },
    price: 25.0,
    unit: 'pieza',
    seasonal: false,
    description:
      'Cerámica artesanal realizada con técnicas tradicionales del Renacimiento andaluz.',
    images: ['/images/ceramica-ubeda.jpg'],
    certifications: ['Artesanía Traditional', 'Denominación Específica'],
    available: true,
    stock: 30,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const seasonal = searchParams.get('seasonal');
  const available = searchParams.get('available');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 600));

    let filteredProducts = [...mockProducts];

    // Aplicar filtros
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    if (location) {
      filteredProducts = filteredProducts.filter(product =>
        product.location.municipality.toLowerCase().includes(location.toLowerCase()),
      );
    }

    if (seasonal === 'true') {
      filteredProducts = filteredProducts.filter(product => product.seasonal);
    }

    if (available === 'true') {
      filteredProducts = filteredProducts.filter(product => product.available && product.stock > 0);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.producer.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower),
      );
    }

    // Paginación
    const totalProducts = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          total: totalProducts,
          limit,
          offset,
          hasMore: offset + limit < totalProducts,
        },
        filters: {
          category,
          location,
          seasonal: seasonal === 'true',
          available: available === 'true',
          search,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        region: 'Jaén, Andalucía',
        categories: ['aceite', 'queso', 'jamón', 'miel', 'vino', 'aceitunas', 'artesanía'],
      },
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos',
        code: 'PRODUCTS_ERROR',
      },
      { status: 500 },
    );
  }
}

// GET específico por ID
export async function getProductById(id: string) {
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return NextResponse.json(
      {
        success: false,
        error: 'Producto no encontrado',
        code: 'PRODUCT_NOT_FOUND',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: product,
  });
}
