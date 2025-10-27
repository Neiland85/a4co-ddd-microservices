export interface Region {
    id: string;
    name: string;
}

export interface Province {
    id: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    favoriteProductIds: string[];
    isProducer: boolean;
    producerId?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    longDescription: string;
    price: number;
    imageUrl: string;
    galleryImageUrls: string[];
    categoryId: string;
    producerId: string;
    rating: number;
    reviewCount: number;
    stock: number;
    reviews: Review[];
}

export interface Producer {
    id:string;
    name: string;
    description: string;
    province: string;
    logoUrl: string;
    bannerUrl: string;
    videoUrl?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CustomerDetails {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    customerDetails: CustomerDetails;
    date: string;
    status: 'Pendiente' | 'Enviado' | 'Entregado';
}

export interface OrderPayload {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    customerDetails: CustomerDetails;
}

export interface DashboardStats {
    totalRevenue: number;
    pendingOrders: number;
    lowStockItems: number;
}

export interface Business {
    id: string;
    name: string;
    description: string;
    cta: {
        text: string;
        url: string;
    };
}

export interface DeliveryOption {
    id: string;
    name: string;
    description: string;
    price: number;
}