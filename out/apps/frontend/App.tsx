
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// FIX: Add file extensions to all imports to resolve modules.
import type { Region, User, Category, Product, Producer, CartItem, Order, OrderPayload } from './types.ts';
import * as api from './api.ts';
import { REGIONS } from './constants.ts';

import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Categories from './components/Categories.tsx';
import Catalogue from './components/Catalogue.tsx';
import GeolocationBanner from './components/GeolocationBanner.tsx';
import Footer from './components/Footer.tsx';
import ProductPage from './components/ProductPage.tsx';
import CartSidebar from './components/CartSidebar.tsx';
import CheckoutPage from './components/checkout/CheckoutPage.tsx';
import OrderConfirmationPage from './components/checkout/OrderConfirmationPage.tsx';
import Onboarding from './components/Onboarding.tsx';
import MissionPage from './components/MissionPage.tsx';
import UserDashboard from './components/user/UserDashboard.tsx';
import LoginModal from './components/auth/LoginModal.tsx';
import ProducerAuthPage from './components/auth/ProducerAuthPage.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import ProducerProfilePage from './components/ProducerProfilePage.tsx';
import ExpansionMap from './components/ExpansionMap.tsx';


type View =
    | { name: 'home' }
    | { name: 'product'; productId: string }
    | { name: 'producer'; producerId: string }
    | { name: 'checkout' }
    | { name: 'confirmation'; order: Order }
    | { name: 'userDashboard' }
    | { name: 'producerDashboard' }
    | { name: 'producerAuth' }
    | { name: 'mission' };

const App: React.FC = () => {
    // View state
    const [view, setView] = useState<View>({ name: 'home' });

    // Data state
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter/Search state
    const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI state
    const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('a4co-onboarded'));
    const [showGeolocationBanner, setShowGeolocationBanner] = useState(false);
    const [detectedProvince, setDetectedProvince] = useState<Region | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);
    
    // User/Auth state
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Cart state
    const [cart, setCart] = useState<CartItem[]>([]);

    // Data fetching
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [productsData, categoriesData, producersData] = await Promise.all([
                api.getProducts(),
                api.getCategories(),
                api.getProducers(),
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setProducers(producersData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Mock geolocation
        setTimeout(() => {
             const jaen = REGIONS.find(r => r.id === 'jaen');
             if(jaen) {
                setDetectedProvince(jaen);
                setShowGeolocationBanner(true);
             }
        }, 2000);
    }, [fetchData]);

     useEffect(() => {
        if (currentUser && !currentUser.isProducer) {
            api.getOrdersByUser(currentUser.id).then(setUserOrders);
        } else {
            setUserOrders([]);
        }
    }, [currentUser]);
    
    // Session persistence
    useEffect(() => {
        const token = localStorage.getItem('a4co-token');
        if (token) {
            const user = api.getMe(token);
            if (user) {
                setCurrentUser(user);
                 if(user.isProducer) {
                    setView({ name: 'producerDashboard' });
                }
            }
        }
    }, []);

    // Handlers
    const handleRegionChange = (region: Region) => {
        setSelectedRegion(region);
        setShowGeolocationBanner(false);
    };

    const handleConfirmGeolocation = () => {
        if (detectedProvince) {
            setSelectedRegion(detectedProvince);
        }
        setShowGeolocationBanner(false);
    };

    const handleSelectCategory = (categoryId: string | null) => {
        setSelectedCategoryId(categoryId);
    };

    const handleProductSelect = (product: Product) => {
        setView({ name: 'product', productId: product.id });
        window.scrollTo(0, 0);
    };
    
    const handleProducerSelect = (producerId: string) => {
        setView({ name: 'producer', producerId: producerId });
        window.scrollTo(0, 0);
    }
    
    const handleOnboardingComplete = () => {
        localStorage.setItem('a4co-onboarded', 'true');
        setShowOnboarding(false);
    };
    
    const handleLoginSuccess = (user: User, token: string) => {
        localStorage.setItem('a4co-token', token);
        setCurrentUser(user);
        setIsLoginModalOpen(false);
        if (postLoginAction) {
            postLoginAction();
            setPostLoginAction(null);
        }
        if (user.isProducer) {
            setView({ name: 'producerDashboard' });
        }
    };
    
    const handleLogout = () => {
        // Ensure the authentication token is removed on logout
        localStorage.removeItem('a4co-token');
        setCurrentUser(null);
        setView({ name: 'home' });
    }

    const handleToggleFavorite = (productId: string) => {
        if (!currentUser) {
            setPostLoginAction(() => () => handleToggleFavorite(productId));
            setIsLoginModalOpen(true);
            return;
        }

        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const isFavorite = prevUser.favoriteProductIds.includes(productId);
            const newFavorites = isFavorite
                ? prevUser.favoriteProductIds.filter(id => id !== productId)
                : [...prevUser.favoriteProductIds, productId];
            
            api.toggleFavorite(prevUser.id, productId);

            return { ...prevUser, favoriteProductIds: newFavorites };
        });
    };
    
    const handleUpdateCart = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(prev => prev.filter(item => item.product.id !== productId));
            return;
        }
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === productId);
            if (existingItem) {
                return prevCart.map(item => item.product.id === productId ? { ...item, quantity } : item);
            }
            return [...prevCart, { product, quantity }];
        });
    };
    
    const handleCheckout = () => {
        setIsCartOpen(false);
        if (currentUser) {
            setView({ name: 'checkout' });
            window.scrollTo(0, 0);
        } else {
            setPostLoginAction(() => () => {
                setView({ name: 'checkout' });
                window.scrollTo(0, 0);
            });
            setIsLoginModalOpen(true);
        }
    };

    const handleSubmitOrder = async (orderPayload: OrderPayload) => {
        if (!currentUser) {
            console.error("User must be logged in to submit an order.");
            setIsLoginModalOpen(true);
            return;
        }
        const newOrder = await api.addOrder(orderPayload, currentUser.id);
        setCart([]);
        setView({ name: 'confirmation', order: newOrder });
    };

    // Memoized filtered products
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const producer = producers.find(p => p.id === product.producerId);
                const regionMatch = selectedRegion.id === 'all' || producer?.province.toLowerCase() === selectedRegion.name.toLowerCase();
                const categoryMatch = !selectedCategoryId || product.categoryId === selectedCategoryId;
                const searchMatch = searchQuery.length === 0 || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || producer?.name.toLowerCase().includes(searchQuery.toLowerCase());
                return regionMatch && categoryMatch && searchMatch;
            });
    }, [products, producers, selectedRegion, selectedCategoryId, searchQuery]);

    const renderView = () => {
        switch (view.name) {
            case 'product': {
                const product = products.find(p => p.id === view.productId);
                const producer = producers.find(p => p.id === product?.producerId);
                if (!product || !producer) return <div>Producto no encontrado</div>;
                return <ProductPage 
                            product={product} 
                            producer={producer}
                            onBack={() => setView({name: 'home'})}
                            onAddToCart={(id, qty) => { handleUpdateCart(id, qty); setIsCartOpen(true); }}
                            onProducerSelect={handleProducerSelect}
                            currentUser={currentUser}
                            isFavorite={currentUser?.favoriteProductIds.includes(product.id) ?? false}
                            onToggleFavorite={handleToggleFavorite}
                        />;
            }
            case 'producer': {
                const producer = producers.find(p => p.id === view.producerId);
                if (!producer) return <div>Productor no encontrado</div>;
                const producerProducts = products.filter(p => p.producerId === producer.id);
                 return <ProducerProfilePage
                            producer={producer}
                            products={producerProducts}
                            producers={producers}
                            onBack={() => setView({name: 'home'})}
                            onProductSelect={handleProductSelect}
                            onProducerSelect={handleProducerSelect}
                            currentUser={currentUser}
                            onToggleFavorite={handleToggleFavorite}
                        />;
            }
            case 'checkout':
                if (!currentUser) {
                    // This is a safeguard, the main handler should prevent this
                    return <div>Debes iniciar sesión para finalizar la compra.</div>;
                }
                return <CheckoutPage items={cart} onSubmitOrder={handleSubmitOrder} onBackToHome={() => setView({name: 'home'})} />;
            case 'confirmation':
                return <OrderConfirmationPage order={view.order} onContinueShopping={() => setView({ name: 'home' })} />;
            case 'mission':
                return <MissionPage onBack={() => setView({name: 'home'})} />;
            case 'userDashboard':
                 if (!currentUser) { setView({ name: 'home' }); return null; }
                return <UserDashboard 
                            currentUser={currentUser}
                            orders={userOrders}
                            products={products}
                            producers={producers}
                            onBack={() => setView({name: 'home'})}
                            onProductSelect={handleProductSelect}
                            onProducerSelect={handleProducerSelect}
                            onToggleFavorite={handleToggleFavorite}
                            onLogout={handleLogout}
                        />;
            case 'producerAuth':
                return <ProducerAuthPage onBack={() => setView({ name: 'home' })} onLoginSuccess={handleLoginSuccess} />;
            case 'producerDashboard':
                 if (!currentUser || !currentUser.isProducer) { setView({ name: 'home' }); return null; }
                return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero onNavigate={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })} />
                        <Categories 
                            categories={categories} 
                            onSelectCategory={handleSelectCategory} 
                            isLoading={isLoading}
                        />
                        <Catalogue
                            products={filteredProducts}
                            producers={producers}
                            isLoading={isLoading}
                            onProductSelect={handleProductSelect}
                            onProducerSelect={handleProducerSelect}
                            currentUser={currentUser}
                            onToggleFavorite={handleToggleFavorite}
                        />
                        <ExpansionMap />
                    </>
                );
        }
    };
    
    if (showOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    return (
        <div className="bg-white">
            {view.name !== 'producerDashboard' && view.name !== 'producerAuth' && (
                <Header
                    selectedRegion={selectedRegion}
                    onRegionChange={handleRegionChange}
                    onSearch={setSearchQuery}
                    cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                    onCartClick={() => setIsCartOpen(true)}
                    currentUser={currentUser}
                    // FIX: Replaced onUserIconClick with onUserDashboardClick and onLoginClick to match HeaderProps.
                    onUserDashboardClick={() => setView({ name: 'userDashboard' })}
                    onLoginClick={() => setIsLoginModalOpen(true)}
                    onProducerZoneClick={() => setView({ name: 'producerAuth' })}
                />
            )}
            
            <main>
                {renderView()}
            </main>

            {view.name !== 'producerDashboard' && view.name !== 'producerAuth' && <Footer onMissionClick={() => setView({name: 'mission'})} onProducerAuthClick={() => setView({name: 'producerAuth'})} />}

            {showGeolocationBanner && detectedProvince && (
                <GeolocationBanner
                    province={detectedProvince}
                    onConfirm={handleConfirmGeolocation}
                    onDismiss={() => setShowGeolocationBanner(false)}
                />
            )}
            
            <CartSidebar 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)}
                items={cart}
                producers={producers}
                onUpdateQuantity={handleUpdateCart}
                onRemoveFromCart={(productId) => handleUpdateCart(productId, 0)}
                onCheckout={handleCheckout}
            />
            
            {isLoginModalOpen && (
                <LoginModal 
                    onClose={() => setIsLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToProducerAuth={() => { setIsLoginModalOpen(false); setView({name: 'producerAuth'}) }}
                />
            )}
        </div>
    );
};

export default App;