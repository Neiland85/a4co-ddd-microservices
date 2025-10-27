
// FIX: Implement mock API and data source.
import type { User, Category, Product, Producer, Order, Review, DeliveryOption, OrderPayload } from './types.ts';

// --- MOCK DATABASE ---

// This is a simplified in-memory store. A real app would use a database.
// We use 'let' to allow mutation.

let MOCK_REVIEWS: Review[] = [
    { id: 'rev1', author: 'Ana García', rating: 5, comment: '¡Un aceite espectacular! Sabor intenso y de una calidad superior. Repetiré sin duda.', date: '2023-10-15' },
    { id: 'rev2', author: 'Carlos Pérez', rating: 4, comment: 'Muy bueno, aunque un poco caro. Se nota que es un producto artesanal.', date: '2023-10-12' },
];

let MOCK_PRODUCERS: Producer[] = [
    { id: 'prod-1', name: 'Oro de Cánava', description: 'Desde las faldas de Sierra Mágina, producimos un Aceite de Oliva Virgen Extra de cosecha temprana, reconocido internacionalmente por su frutado verde intenso y su equilibrio en boca.', province: 'Jaén', logoUrl: 'https://picsum.photos/id/1025/100/100', bannerUrl: 'https://picsum.photos/id/1015/1000/400', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 'prod-2', name: 'Cerámica Tito', description: 'Generaciones de alfareros en Úbeda han perfeccionado un arte que se refleja en cada pieza. Nuestra cerámica, con su característico vidriado verde, es un pedazo de la historia de Jaén.', province: 'Jaén', logoUrl: 'https://picsum.photos/id/1026/100/100', bannerUrl: 'https://picsum.photos/id/1016/1000/400' },
];

let MOCK_CATEGORIES: Category[] = [
    { id: 'aceites', name: 'Aceites' },
    { id: 'restaurantes', name: 'Restaurantes' },
    { id: 'eventos', name: 'Eventos' },
    { id: 'regalos', name: 'Regalos' },
];

let MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1', name: 'AOVE Picual Cosecha Temprana 500ml', description: 'Frutado verde intenso, con notas de hierba recién cortada.', longDescription: 'Nuestro aceite estrella, extraído en los primeros días de cosecha. Es un aceite potente, ideal para tomar en crudo.', price: 18.50, imageUrl: 'https://picsum.photos/id/20/400/400', galleryImageUrls: ['https://picsum.photos/id/21/400/400', 'https://picsum.photos/id/22/400/400'], categoryId: 'aceites', producerId: 'prod-1', rating: 4.8, reviewCount: 82, stock: 150, reviews: [MOCK_REVIEWS[0], MOCK_REVIEWS[1]]
    },
    {
        id: 'p2', name: 'Cena Degustación "Sabores de Jaén"', description: 'Un viaje gastronómico por los productos de la tierra.', longDescription: 'Disfruta de un menú de 6 pases maridado con nuestros mejores aceites. Una experiencia única en el corazón de Jaén.', price: 75.00, imageUrl: 'https://picsum.photos/id/30/400/400', galleryImageUrls: [], categoryId: 'restaurantes', producerId: 'prod-1', rating: 4.9, reviewCount: 45, stock: 20, reviews: []
    },
];

type UserWithPassword = User & { passwordHash: string };

let MOCK_USERS: UserWithPassword[] = [
    { id: 'user-1', name: 'Maria Lopez', email: 'cliente@a4co.es', favoriteProductIds: ['p1'], isProducer: false, passwordHash: 'password123' },
    { id: 'user-2', name: 'Jaencoop', email: 'productor@a4co.es', favoriteProductIds: [], isProducer: true, producerId: 'prod-1', passwordHash: 'password123' },
];

let MOCK_ORDERS: Order[] = [
    {
        id: 'order-123', userId: 'user-1', items: [{ product: MOCK_PRODUCTS[0], quantity: 1 }], subtotal: 18.50, shippingCost: 4.99, total: 23.49, customerDetails: { email: 'cliente@a4co.es', firstName: 'Maria', lastName: 'Lopez', address: 'Calle Falsa 123', city: 'Jaén', postalCode: '23001' }, date: '2023-10-20T10:00:00Z', status: 'Entregado'
    },
];

export const DELIVERY_OPTIONS: DeliveryOption[] = [
    { id: 'standard', name: 'Envío Estándar', description: 'Entrega en 3-5 días laborables', price: 4.99 },
    { id: 'pickup', name: 'Recogida en tienda (Jaén)', description: 'Listo en 24h en el punto de recogida', price: 0.00 },
];

// --- API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const stripPassword = (user: UserWithPassword): User => {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// --- PUBLIC API ---

export const getProducts = async (): Promise<Product[]> => {
    await delay(500);
    return JSON.parse(JSON.stringify(MOCK_PRODUCTS));
};

export const getCategories = async (): Promise<Category[]> => {
    await delay(200);
    return JSON.parse(JSON.stringify(MOCK_CATEGORIES));
};

export const getProducers = async (): Promise<Producer[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(MOCK_PRODUCERS));
};

// --- AUTH API ---

export const loginUser = (email: string, pass: string, role: 'customer' | 'producer' = 'customer'): { user: User, token: string } | null => {
    const user = MOCK_USERS.find(u => u.email === email && u.passwordHash === pass);
    const roleMatch = role === 'producer' ? user?.isProducer : !user?.isProducer;
    if (user && roleMatch) {
        return { user: stripPassword(user), token: `fake-jwt-for-${user.id}` };
    }
    return null;
};

export const registerUser = (name: string, email: string, pass: string): { user: User, token: string } | null => {
    if (MOCK_USERS.some(u => u.email === email)) {
        return null; // User already exists
    }
    const newUser: UserWithPassword = {
        id: `user-${MOCK_USERS.length + 1}`,
        name,
        email,
        passwordHash: pass,
        favoriteProductIds: [],
        isProducer: false,
    };
    MOCK_USERS.push(newUser);
    return { user: stripPassword(newUser), token: `fake-jwt-for-${newUser.id}` };
};

export const getMe = (token: string): User | null => {
    const userId = token.replace('fake-jwt-for-', '');
    const user = MOCK_USERS.find(u => u.id === userId);
    return user ? stripPassword(user) : null;
};

// --- USER-SPECIFIC API ---

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
    await delay(400);
    return JSON.parse(JSON.stringify(MOCK_ORDERS.filter(o => o.userId === userId)));
};

export const toggleFavorite = (userId: string, productId: string) => {
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const user = MOCK_USERS[userIndex];
    const isFavorite = user.favoriteProductIds.includes(productId);

    if (isFavorite) {
        user.favoriteProductIds = user.favoriteProductIds.filter(id => id !== productId);
    } else {
        user.favoriteProductIds.push(productId);
    }
    console.log(`Favorites for ${user.name}:`, user.favoriteProductIds);
};

export const addOrder = async (orderPayload: OrderPayload, userId: string): Promise<Order> => {
    await delay(1000);
    const newOrder: Order = {
        ...orderPayload,
        id: `order-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        date: new Date().toISOString(),
        status: 'Pendiente',
    };
    MOCK_ORDERS.push(newOrder);
    return JSON.parse(JSON.stringify(newOrder));
};


// --- PRODUCER DASHBOARD API ---

export const getOrdersByProducer = async (producerId: string): Promise<Order[]> => {
    await delay(400);
    const producerOrders = MOCK_ORDERS.filter(order => order.items.some(item => item.product.producerId === producerId));
    return JSON.parse(JSON.stringify(producerOrders));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    await delay(500);
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        MOCK_ORDERS[orderIndex].status = status;
    }
    return Promise.resolve();
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    await delay(500);
    const newProduct: Product = {
        ...productData,
        id: `p${MOCK_PRODUCTS.length + 1}`,
        rating: 0,
        reviewCount: 0,
        reviews: [],
        galleryImageUrls: [],
    };
    MOCK_PRODUCTS.push(newProduct);
    return JSON.parse(JSON.stringify(newProduct));
};

export const updateProduct = async (productData: Product): Promise<Product> => {
    await delay(500);
    const index = MOCK_PRODUCTS.findIndex(p => p.id === productData.id);
    if (index > -1) {
        MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
        return JSON.parse(JSON.stringify(MOCK_PRODUCTS[index]));
    }
    throw new Error("Product not found");
};

export const deleteProduct = async (productId: string): Promise<void> => {
    await delay(500);
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== productId);
    return Promise.resolve();
};

export const updateProducer = async (producerData: Producer): Promise<Producer> => {
    await delay(600);
    const index = MOCK_PRODUCERS.findIndex(p => p.id === producerData.id);
    if (index > -1) {
        MOCK_PRODUCERS[index] = { ...MOCK_PRODUCERS[index], ...producerData };
        return JSON.parse(JSON.stringify(MOCK_PRODUCERS[index]));
    }
    throw new Error("Producer not found");
};