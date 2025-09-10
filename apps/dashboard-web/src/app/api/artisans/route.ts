// API para gestión de artesanos/productores locales
import { NextRequest, NextResponse } from 'next/server';

interface Artisan {
  id: string;
  name: string;
  specialty: string;
  location: {
    municipality: string;
    address: string;
    coordinates: [number, number];
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  description: string;
  experience: number; // años
  certifications: string[];
  products: string[]; // IDs de productos
  images: string[];
  schedules: {
    [key: string]: string; // día: horario
  };
  services: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
}

const mockArtisans: Artisan[] = [
  {
    id: 'art-001',
    name: 'Cooperativa Olivarera San José',
    specialty: 'Aceite de Oliva Virgen Extra',
    location: {
      municipality: 'Úbeda',
      address: 'Carretera de Córdoba, Km 12',
      coordinates: [38.0138, -3.3706],
    },
    contact: {
      phone: '+34 953 795 123',
      email: 'info@olivarerasanjose.com',
      website: 'www.olivarerasanjose.com',
    },
    description:
      'Cooperativa fundada en 1952 que agrupa a más de 300 olivicultores de la región. Especializada en aceite de oliva virgen extra de variedad Picual.',
    experience: 72,
    certifications: ['Denominación de Origen', 'Certificación Ecológica', 'ISO 9001'],
    products: ['prod-001'],
    images: ['/images/cooperativa-san-jose.jpg', '/images/olivos-ubeda.jpg'],
    schedules: {
      lunes: '8:00-14:00',
      martes: '8:00-14:00',
      miércoles: '8:00-14:00',
      jueves: '8:00-14:00',
      viernes: '8:00-14:00',
      sábado: '9:00-13:00',
    },
    services: ['Visitas guiadas', 'Catas de aceite', 'Venta directa', 'Tours del olivar'],
    rating: 4.8,
    reviewsCount: 156,
    verified: true,
  },
  {
    id: 'art-002',
    name: 'Quesería Los Olivos',
    specialty: 'Quesos Artesanales de Cabra',
    location: {
      municipality: 'Cazorla',
      address: 'Parque Natural de Cazorla, Finca Los Olivos',
      coordinates: [37.9105, -2.9745],
    },
    contact: {
      phone: '+34 953 720 456',
      email: 'contacto@queserialos olivos.es',
    },
    description:
      'Quesería familiar que elabora quesos artesanales con leche de cabras criadas en libertad en el Parque Natural de Cazorla.',
    experience: 25,
    certifications: ['Artesanal', 'Bienestar Animal', 'Local'],
    products: ['prod-002'],
    images: ['/images/queseria-olivos.jpg', '/images/cabras-cazorla.jpg'],
    schedules: {
      martes: '10:00-14:00, 16:00-19:00',
      miércoles: '10:00-14:00, 16:00-19:00',
      jueves: '10:00-14:00, 16:00-19:00',
      viernes: '10:00-14:00, 16:00-19:00',
      sábado: '10:00-14:00',
      domingo: '10:00-14:00',
    },
    services: [
      'Visitas a la quesería',
      'Talleres de elaboración',
      'Degustaciones',
      'Venta directa',
    ],
    rating: 4.9,
    reviewsCount: 89,
    verified: true,
  },
  {
    id: 'art-003',
    name: 'Taller Cerámico Paco Tito',
    specialty: 'Cerámica Tradicional de Úbeda',
    location: {
      municipality: 'Úbeda',
      address: 'Calle Valencia, 22',
      coordinates: [38.0138, -3.3706],
    },
    contact: {
      phone: '+34 953 795 789',
      email: 'taller@pacotito.com',
      website: 'www.pacotito.com',
    },
    description:
      'Taller familiar fundado en 1928, especializado en cerámica vidriada tradicional de Úbeda con técnicas transmitidas de generación en generación.',
    experience: 96,
    certifications: ['Artesanía Tradicional', 'Denominación Específica', 'Patrimonio Cultural'],
    products: ['prod-006'],
    images: ['/images/taller-paco-tito.jpg', '/images/ceramica-proceso.jpg'],
    schedules: {
      lunes: '9:00-13:00, 16:00-20:00',
      martes: '9:00-13:00, 16:00-20:00',
      miércoles: '9:00-13:00, 16:00-20:00',
      jueves: '9:00-13:00, 16:00-20:00',
      viernes: '9:00-13:00, 16:00-20:00',
      sábado: '9:00-13:00',
    },
    services: [
      'Talleres de cerámica',
      'Visitas al taller',
      'Cursos intensivos',
      'Piezas personalizadas',
    ],
    rating: 4.7,
    reviewsCount: 134,
    verified: true,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const municipality = searchParams.get('municipality');
  const specialty = searchParams.get('specialty');
  const verified = searchParams.get('verified');
  const search = searchParams.get('search');

  try {
    await new Promise(resolve => setTimeout(resolve, 700));

    let filteredArtisans = [...mockArtisans];

    if (municipality) {
      filteredArtisans = filteredArtisans.filter(artisan =>
        artisan.location.municipality.toLowerCase().includes(municipality.toLowerCase())
      );
    }

    if (specialty) {
      filteredArtisans = filteredArtisans.filter(artisan =>
        artisan.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (verified === 'true') {
      filteredArtisans = filteredArtisans.filter(artisan => artisan.verified);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredArtisans = filteredArtisans.filter(
        artisan =>
          artisan.name.toLowerCase().includes(searchLower) ||
          artisan.specialty.toLowerCase().includes(searchLower) ||
          artisan.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        artisans: filteredArtisans,
        total: filteredArtisans.length,
        filters: {
          municipality,
          specialty,
          verified: verified === 'true',
          search,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        region: 'Jaén, Andalucía',
        specialties: [
          'Aceite de Oliva',
          'Quesos Artesanales',
          'Cerámica',
          'Apicultura',
          'Conservas',
        ],
      },
    });
  } catch (error) {
    console.error('Error en API artesanos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener artesanos',
        code: 'ARTISANS_ERROR',
      },
      { status: 500 }
    );
  }
}

export type { Artisan };
