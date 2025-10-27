// API Routes para el Mercado Local de Jaén
import { NextRequest, NextResponse } from 'next/server';

// Tipos de datos para productos locales
interface LocalProduct {
  id: string;
  name: string;
  category: 'aceite' | 'queso' | 'jamón' | 'miel' | 'vino' | 'aceitunas' | 'artesanía';
  producer: string;
  location: {
    municipality: string;
    coordinates: [number, number]; // [lat, lng]
  };
  price: number;
  unit: string;
  seasonal: boolean;
  harvestDate?: string;
  description: string;
  images: string[];
  certifications: string[];
  available: boolean;
  stock: number;
}

interface SalesOpportunity {
  id: string;
  type: 'direct_sale' | 'market_event' | 'festival' | 'cooperative';
  title: string;
  location: string;
  date: string;
  products: LocalProduct[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  priority: 'alta' | 'media' | 'baja';
}

// Mock data para productos locales de Jaén
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
    images: ['/images/aceite-picual.jpg'],
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
];

// Mock data para oportunidades de venta
const mockSalesOpportunities: SalesOpportunity[] = [
  {
    id: 'opp-001',
    type: 'market_event',
    title: 'Mercado de Productos Locales - Plaza de Santa María',
    location: 'Úbeda, Jaén',
    date: '2025-08-15',
    products: mockProducts.slice(0, 2),
    contactInfo: {
      name: 'María González',
      phone: '+34 653 789 123',
      email: 'maria@mercadoubeda.es',
    },
    priority: 'alta',
  },
  {
    id: 'opp-002',
    type: 'festival',
    title: 'Festival del Aceite de Oliva',
    location: 'Baeza, Jaén',
    date: '2025-09-10',
    products: [mockProducts[0]],
    contactInfo: {
      name: 'Antonio Martín',
      phone: '+34 667 456 789',
      email: 'info@festivaleaceite.com',
    },
    priority: 'alta',
  },
  {
    id: 'opp-003',
    type: 'cooperative',
    title: 'Cooperativa de Consumo Responsable',
    location: 'Jaén Capital',
    date: '2025-07-30',
    products: mockProducts,
    contactInfo: {
      name: 'Carmen López',
      phone: '+34 620 345 678',
      email: 'cooperativa@consumojaen.org',
    },
    priority: 'media',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const location = searchParams.get('location');
  const category = searchParams.get('category');

  try {
    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredOpportunities = [...mockSalesOpportunities];

    // Filtrar por tipo si se especifica
    if (type) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.type === type);
    }

    // Filtrar por ubicación si se especifica
    if (location) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
<<<<<<< HEAD
        opp.location.toLowerCase().includes(location.toLowerCase()),
=======
        opp.location.toLowerCase().includes(location.toLowerCase())
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );
    }

    // Filtrar por categoría de producto si se especifica
    if (category) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
<<<<<<< HEAD
        opp.products.some(product => product.category === category),
=======
        opp.products.some(product => product.category === category)
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        opportunities: filteredOpportunities,
        total: filteredOpportunities.length,
        filters: {
          type,
          location,
          category,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        region: 'Jaén, Andalucía',
        season: getSeason(),
      },
    });
  } catch (error) {
    console.error('Error al obtener oportunidades de venta:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener oportunidades de venta',
        code: 'SALES_OPPORTUNITIES_ERROR',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    const requiredFields = ['title', 'location', 'date', 'contactInfo'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Campo requerido: ${field}`,
            code: 'VALIDATION_ERROR',
          },
          { status: 400 },
        );
      }
    }

    // Simular creación de nueva oportunidad
    const newOpportunity: SalesOpportunity = {
      id: `opp-${Date.now()}`,
      type: body.type || 'direct_sale',
      title: body.title,
      location: body.location,
      date: body.date,
      products: body.products || [],
      contactInfo: body.contactInfo,
      priority: body.priority || 'media',
    };

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        data: newOpportunity,
        message: 'Oportunidad de venta creada exitosamente',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error al crear oportunidad de venta:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear oportunidad de venta',
        code: 'CREATE_OPPORTUNITY_ERROR',
      },
      { status: 500 },
    );
  }
}

// Función auxiliar para determinar la temporada
function getSeason(): string {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 5) return 'primavera';
  if (month >= 6 && month <= 8) return 'verano';
  if (month >= 9 && month <= 11) return 'otoño';
  return 'invierno';
}

// Exportar tipos para uso en otros componentes
export type { LocalProduct, SalesOpportunity };
