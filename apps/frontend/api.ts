// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
const PRODUCT_SERVICE_URL = (import.meta as any).env?.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3003/api/v1/products';
const USER_SERVICE_URL = (import.meta as any).env?.VITE_USER_SERVICE_URL || 'http://localhost:3002/api/v1/users';
const ORDER_SERVICE_URL = (import.meta as any).env?.VITE_ORDER_SERVICE_URL || 'http://localhost:3004/api/v1/orders';
const PAYMENT_SERVICE_URL = (import.meta as any).env?.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3005/api/v1/payments';
const INVENTORY_SERVICE_URL = (import.meta as any).env?.VITE_INVENTORY_SERVICE_URL || 'http://localhost:3006/api/inventory';
const NOTIFICATION_SERVICE_URL = (import.meta as any).env?.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3007/api/notifications';
const TRANSPORTISTA_SERVICE_URL = (import.meta as any).env?.VITE_TRANSPORTISTA_SERVICE_URL || 'http://localhost:3008';

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
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/`);

        if (response.ok) {
            const data = await response.json();
            // Product service returns { data: Product[], pagination: {...} }
            return data.data || data;
        }

        // Fallback to mock if API fails
        console.warn('Product service not available, using mock data');
        await delay(500);
        return JSON.parse(JSON.stringify(MOCK_PRODUCTS));
    } catch (error) {
        console.warn('Product service error, using mock data:', error);
        await delay(500);
        return JSON.parse(JSON.stringify(MOCK_PRODUCTS));
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/categories`);

        if (response.ok) {
            const data = await response.json();
            // Product service returns { data: Category[] }
            return data.data || data;
        }

        // Fallback to mock if API fails
        console.warn('Product service not available, using mock categories');
        await delay(200);
        return JSON.parse(JSON.stringify(MOCK_CATEGORIES));
    } catch (error) {
        console.warn('Product service error, using mock categories:', error);
        await delay(200);
        return JSON.parse(JSON.stringify(MOCK_CATEGORIES));
    }
};

export const getProducers = async (): Promise<Producer[]> => {
    try {
        // Get users with role=artisan from user-service
        const response = await fetch(`${USER_SERVICE_URL}/?role=artisan`);

        if (response.ok) {
            const data = await response.json();
            const artisans = data.data || data;

            // Transform artisan users to Producer format
            return artisans.map((artisan: any) => ({
                id: artisan.id,
                name: `${artisan.firstName} ${artisan.lastName}`,
                description: artisan.bio || 'Artesano local',
                province: artisan.address?.city || 'Andalucía',
                logoUrl: artisan.avatar || 'https://picsum.photos/id/1025/100/100',
                bannerUrl: artisan.bannerUrl || 'https://picsum.photos/id/1015/1000/400',
                videoUrl: artisan.videoUrl,
            }));
        }

        // Fallback to mock if API fails
        console.warn('User service not available, using mock producers');
        await delay(300);
        return JSON.parse(JSON.stringify(MOCK_PRODUCERS));
    } catch (error) {
        console.warn('User service error, using mock producers:', error);
        await delay(300);
        return JSON.parse(JSON.stringify(MOCK_PRODUCERS));
    }
};

export const getProductById = async (productId: string): Promise<Product | null> => {
    try {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/${productId}`);

        if (response.ok) {
            const product = await response.json();
            return product;
        }

        // Fallback to mock if API fails
        console.warn('Product service not available, using mock data');
        await delay(300);
        return MOCK_PRODUCTS.find(p => p.id === productId) || null;
    } catch (error) {
        console.warn('Product service error, using mock data:', error);
        await delay(300);
        return MOCK_PRODUCTS.find(p => p.id === productId) || null;
    }
};

export const searchProducts = async (query: string, filters?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
}): Promise<Product[]> => {
    try {
        const params = new URLSearchParams();
        params.append('q', query);

        if (filters?.category) params.append('category', filters.category);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.rating !== undefined) params.append('rating', filters.rating.toString());

        const response = await fetch(`${PRODUCT_SERVICE_URL}/search?${params.toString()}`);

        if (response.ok) {
            const data = await response.json();
            return data.data || data;
        }

        // Fallback to mock search
        console.warn('Product service search not available, using mock search');
        const searchLower = query.toLowerCase();
        return MOCK_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    } catch (error) {
        console.warn('Product service search error, using mock search:', error);
        const searchLower = query.toLowerCase();
        return MOCK_PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }
};

// --- AUTH API ---

export const loginUser = async (email: string, pass: string, role: 'customer' | 'producer' = 'customer'): Promise<{ user: User, token: string } | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
        });

        if (response.ok) {
            const data = await response.json();
            return { user: data.user, token: data.access_token || data.token };
        }

        // Fallback to mock if API fails
        const user = MOCK_USERS.find(u => u.email === email && u.passwordHash === pass);
        const roleMatch = role === 'producer' ? user?.isProducer : !user?.isProducer;
        if (user && roleMatch) {
            return { user: stripPassword(user), token: `fake-jwt-for-${user.id}` };
        }
        return null;
    } catch (error) {
        console.warn('API call failed, using mock data:', error);
        // Fallback to mock
        const user = MOCK_USERS.find(u => u.email === email && u.passwordHash === pass);
        const roleMatch = role === 'producer' ? user?.isProducer : !user?.isProducer;
        if (user && roleMatch) {
            return { user: stripPassword(user), token: `fake-jwt-for-${user.id}` };
        }
        return null;
    }
};

export const registerUser = async (name: string, email: string, pass: string): Promise<{ user: User, token: string } | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass, name }),
        });

        if (response.ok) {
            const data = await response.json();
            return { user: data.user, token: data.access_token || data.token };
        }

        // Fallback to mock
        return null;
    } catch (error) {
        console.warn('API call failed, using mock data:', error);
        // Fallback to mock
        if (MOCK_USERS.some(u => u.email === email)) {
            return null;
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
    }
};

export const getMe = (token: string): User | null => {
    const userId = token.replace('fake-jwt-for-', '');
    const user = MOCK_USERS.find(u => u.id === userId);
    return user ? stripPassword(user) : null;
};

export const getUserProfile = async (token: string): Promise<User | null> => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            return await response.json();
        }

        // Fallback to getMe
        return getMe(token);
    } catch (error) {
        console.warn('User service error, using mock:', error);
        return getMe(token);
    }
};

export const updateUserProfile = async (token: string, profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}): Promise<User | null> => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (response.ok) {
            return await response.json();
        }

        return null;
    } catch (error) {
        console.warn('User service error:', error);
        return null;
    }
};

// --- USER-SPECIFIC API ---

export const getOrdersByUser = async (userId: string, token?: string): Promise<Order[]> => {
    try {
        if (token) {
            const response = await fetch(`${ORDER_SERVICE_URL}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.data || data;
            }
        }

        // Fallback to mock
        console.warn('Order service not available, using mock orders');
        await delay(400);
        return JSON.parse(JSON.stringify(MOCK_ORDERS.filter(o => o.userId === userId)));
    } catch (error) {
        console.warn('Order service error, using mock orders:', error);
        await delay(400);
        return JSON.parse(JSON.stringify(MOCK_ORDERS.filter(o => o.userId === userId)));
    }
};

export const toggleFavorite = async (userId: string, productId: string, token?: string): Promise<void> => {
    try {
        if (token) {
            // Call user-service to toggle favorite
            const response = await fetch(`${USER_SERVICE_URL}/${userId}/favorites/${productId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Favorite toggled successfully');
                return;
            }
        }

        // Fallback to mock
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
    } catch (error) {
        console.warn('User service error, using mock favorites:', error);
        // Fallback to mock (same as above)
        const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
        if (userIndex === -1) return;
        const user = MOCK_USERS[userIndex];
        const isFavorite = user.favoriteProductIds.includes(productId);
        if (isFavorite) {
            user.favoriteProductIds = user.favoriteProductIds.filter(id => id !== productId);
        } else {
            user.favoriteProductIds.push(productId);
        }
    }
};

export const addOrder = async (orderPayload: OrderPayload, userId: string, token?: string): Promise<Order> => {
    try {
        if (token) {
            // Transform frontend OrderPayload to order-service format
            const orderRequest = {
                items: orderPayload.items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    street: orderPayload.customerDetails.address,
                    city: orderPayload.customerDetails.city,
                    postalCode: orderPayload.customerDetails.postalCode,
                    country: 'Spain',
                },
                billingAddress: {
                    street: orderPayload.customerDetails.address,
                    city: orderPayload.customerDetails.city,
                    postalCode: orderPayload.customerDetails.postalCode,
                    country: 'Spain',
                },
                shippingMethod: 'standard',
                notes: '',
            };

            const response = await fetch(`${ORDER_SERVICE_URL}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderRequest),
            });

            if (response.ok) {
                const order = await response.json();
                return order;
            }
        }

        // Fallback to mock
        console.warn('Order service not available, using mock order creation');
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
    } catch (error) {
        console.warn('Order service error, using mock order creation:', error);
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
    }
};


// --- PRODUCER DASHBOARD API ---

export const getOrdersByProducer = async (producerId: string, token?: string): Promise<Order[]> => {
    try {
        if (token) {
            // Use admin endpoint with artisanId filter
            const response = await fetch(`${ORDER_SERVICE_URL}/admin?artisanId=${producerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.data || data;
            }
        }

        // Fallback to mock
        console.warn('Order service not available, using mock producer orders');
        await delay(400);
        const producerOrders = MOCK_ORDERS.filter(order => order.items.some(item => item.product.producerId === producerId));
        return JSON.parse(JSON.stringify(producerOrders));
    } catch (error) {
        console.warn('Order service error, using mock producer orders:', error);
        await delay(400);
        const producerOrders = MOCK_ORDERS.filter(order => order.items.some(item => item.product.producerId === producerId));
        return JSON.parse(JSON.stringify(producerOrders));
    }
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], token?: string, trackingNumber?: string): Promise<void> => {
    try {
        if (token) {
            const response = await fetch(`${ORDER_SERVICE_URL}/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    trackingNumber: trackingNumber || undefined,
                }),
            });

            if (response.ok) {
                console.log('Order status updated successfully');
                return;
            }
        }

        // Fallback to mock
        console.warn('Order service not available, using mock update');
        await delay(500);
        const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            MOCK_ORDERS[orderIndex].status = status;
        }
        return Promise.resolve();
    } catch (error) {
        console.warn('Order service error, using mock update:', error);
        await delay(500);
        const orderIndex = MOCK_ORDERS.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            MOCK_ORDERS[orderIndex].status = status;
        }
        return Promise.resolve();
    }
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

// --- PAYMENT API ---

export const getPaymentMethods = async (token: string): Promise<any[]> => {
    try {
        const response = await fetch(`${PAYMENT_SERVICE_URL}/methods`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data || data;
        }
        
        // Fallback to mock
        return [];
    } catch (error) {
        console.warn('Payment service error, using mock payment methods:', error);
        return [];
    }
};

export const createPaymentIntent = async (
    orderId: string,
    amount: number,
    currency: string,
    token: string,
    paymentMethodId?: string
): Promise<any> => {
    try {
        const response = await fetch(`${PAYMENT_SERVICE_URL}/intent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId,
                amount,
                currency,
                paymentMethodId,
            }),
        });
        
        if (response.ok) {
            return await response.json();
        }
        
        // Fallback to mock success
        console.warn('Payment service not available, simulating payment intent');
        return {
            id: `pi_mock_${Date.now()}`,
            clientSecret: 'mock_secret',
            status: 'requires_confirmation',
        };
    } catch (error) {
        console.warn('Payment service error, simulating payment intent:', error);
        return {
            id: `pi_mock_${Date.now()}`,
            clientSecret: 'mock_secret',
            status: 'requires_confirmation',
        };
    }
};

export const confirmPayment = async (
    paymentIntentId: string,
    paymentMethodId: string,
    token: string
): Promise<any> => {
    try {
        const response = await fetch(`${PAYMENT_SERVICE_URL}/confirm`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentIntentId,
                paymentMethodId,
            }),
        });
        
        if (response.ok) {
            return await response.json();
        }
        
        // Fallback to mock success
        console.warn('Payment service not available, simulating payment confirmation');
        return {
            id: `pay_mock_${Date.now()}`,
            status: 'succeeded',
        };
    } catch (error) {
        console.warn('Payment service error, simulating payment confirmation:', error);
        return {
            id: `pay_mock_${Date.now()}`,
            status: 'succeeded',
        };
    }
};

// --- INVENTORY API ---

export const checkInventory = async (productId: string): Promise<any> => {
    try {
        const response = await fetch(`${INVENTORY_SERVICE_URL}/check/${productId}`);

        if (response.ok) {
            return await response.json();
        }

        // Fallback to mock stock data
        const product = MOCK_PRODUCTS.find(p => p.id === productId);
        return {
            productId,
            currentStock: product?.stock || 0,
            availableStock: product?.stock || 0,
            stockStatus: (product?.stock || 0) > 10 ? 'in_stock' : (product?.stock || 0) > 0 ? 'low_stock' : 'out_of_stock',
            needsRestock: (product?.stock || 0) < 5,
        };
    } catch (error) {
        console.warn('Inventory service error, using mock data:', error);
        const product = MOCK_PRODUCTS.find(p => p.id === productId);
        return {
            productId,
            currentStock: product?.stock || 0,
            availableStock: product?.stock || 0,
            stockStatus: (product?.stock || 0) > 10 ? 'in_stock' : (product?.stock || 0) > 0 ? 'low_stock' : 'out_of_stock',
            needsRestock: (product?.stock || 0) < 5,
        };
    }
};

export const checkBulkInventory = async (productIds: string[]): Promise<any> => {
    try {
        const response = await fetch(`${INVENTORY_SERVICE_URL}/check/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productIds }),
        });

        if (response.ok) {
            return await response.json();
        }

        // Fallback to mock
        const products = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));
        return {
            products: products.map(p => ({
                productId: p.id,
                currentStock: p.stock,
                availableStock: p.stock,
                stockStatus: p.stock > 10 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock',
            })),
            summary: {
                totalProducts: products.length,
                inStock: products.filter(p => p.stock > 10).length,
                lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
                outOfStock: products.filter(p => p.stock === 0).length,
            },
        };
    } catch (error) {
        console.warn('Inventory service error, using mock data:', error);
        const products = MOCK_PRODUCTS.filter(p => productIds.includes(p.id));
        return {
            products: products.map(p => ({
                productId: p.id,
                currentStock: p.stock,
                availableStock: p.stock,
                stockStatus: p.stock > 10 ? 'in_stock' : p.stock > 0 ? 'low_stock' : 'out_of_stock',
            })),
            summary: {
                totalProducts: products.length,
                inStock: products.filter(p => p.stock > 10).length,
                lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
                outOfStock: products.filter(p => p.stock === 0).length,
            },
        };
    }
};

export const reserveStock = async (
    productId: string,
    quantity: number,
    orderId: string,
    customerId: string,
    token?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 min expiry

        const response = await fetch(`${INVENTORY_SERVICE_URL}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({
                productId,
                quantity,
                orderId,
                customerId,
                expiresAt: expiresAt.toISOString(),
            }),
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        }

        // Fallback to mock success
        return { success: true, message: 'Stock reserved (mock)' };
    } catch (error) {
        console.warn('Inventory service error, using mock reservation:', error);
        return { success: true, message: 'Stock reserved (mock)' };
    }
};

export const getLowStockProducts = async (token?: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${INVENTORY_SERVICE_URL}/products/low-stock`, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        if (response.ok) {
            return await response.json();
        }

        // Fallback to mock
        return MOCK_PRODUCTS.filter(p => p.stock <= 10 && p.stock > 0);
    } catch (error) {
        console.warn('Inventory service error, using mock low stock:', error);
        return MOCK_PRODUCTS.filter(p => p.stock <= 10 && p.stock > 0);
    }
};

// --- NOTIFICATION API ---

export const sendNotification = async (
    type: 'email' | 'sms' | 'push',
    title: string,
    message: string,
    recipients: string[],
    token?: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(`${NOTIFICATION_SERVICE_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({
                type,
                priority: 'medium',
                title,
                message,
                recipients,
                channels: [type],
            }),
        });

        if (response.ok) {
            return { success: true, message: 'Notification sent' };
        }

        // Fallback to mock
        console.warn('Notification service not available, simulating send');
        console.log(`📧 Mock notification: ${title} to ${recipients.join(', ')}`);
        return { success: true, message: 'Notification sent (mock)' };
    } catch (error) {
        console.warn('Notification service error, using mock:', error);
        console.log(`📧 Mock notification: ${title} to ${recipients.join(', ')}`);
        return { success: true, message: 'Notification sent (mock)' };
    }
};

// --- SHIPPING/TRACKING API ---

export const trackShipment = async (trackingNumber: string): Promise<any> => {
    try {
        // For now, transportista-service doesn't have a tracking endpoint
        // This would call a tracking API when implemented
        console.log(`Tracking shipment: ${trackingNumber}`);

        // Mock tracking data
        return {
            trackingNumber,
            status: 'in_transit',
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            currentLocation: 'Centro de distribución - Madrid',
            history: [
                { status: 'picked_up', location: 'Almacén Jaén', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
                { status: 'in_transit', location: 'Centro distribución Madrid', timestamp: new Date().toISOString() },
            ],
        };
    } catch (error) {
        console.warn('Tracking service error, using mock data:', error);
        return {
            trackingNumber,
            status: 'in_transit',
            estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            currentLocation: 'En tránsito',
        };
    }
};

export const getAvailableCarriers = async (token?: string): Promise<any[]> => {
    try {
        const response = await fetch(`${TRANSPORTISTA_SERVICE_URL}/transportistas?activo=true`, {
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
        });

        if (response.ok) {
            return await response.json();
        }

        // Fallback to mock
        return [
            { id: 'carrier-1', nombre: 'Express Jaén', tipo_vehiculo: 'furgon', capacidad_kg: 1000 },
            { id: 'carrier-2', nombre: 'Andalucía Express', tipo_vehiculo: 'camion', capacidad_kg: 5000 },
        ];
    } catch (error) {
        console.warn('Transportista service error, using mock carriers:', error);
        return [
            { id: 'carrier-1', nombre: 'Express Jaén', tipo_vehiculo: 'furgon', capacidad_kg: 1000 },
            { id: 'carrier-2', nombre: 'Andalucía Express', tipo_vehiculo: 'camion', capacidad_kg: 5000 },
        ];
    }
};