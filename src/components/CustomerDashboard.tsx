import React, { useState, useEffect } from 'react';
import { isSeasonalRegulationActive } from '../utils/dateUtils';
import ProductDetails from './ProductDetails';
import OrderTracking from './OrderTracking';
import OrderChat from './OrderChat';

const CustomerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('listings');
    const [viewMode, setViewMode] = useState<'fresh' | 'value-added'>('fresh');
    const [filters, setFilters] = useState({ type: '', price: '', location: '' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [activeOrderView, setActiveOrderView] = useState<{ type: 'track' | 'chat', orderId: string } | null>(null);

    const isRegulationActive = isSeasonalRegulationActive();

    useEffect(() => {
        if (isRegulationActive) {
            setViewMode('value-added');
        }
    }, [isRegulationActive]);

    const handleSubscribe = () => {
        alert("Success! You will be notified when new seasonal products arrive.");
    };

    const handleAddToCart = (product: any) => {
        setCart([...cart, product]);
    };

    const listings = [
        { id: 1, type: 'Seer Fish', price: 450, location: 'Marina', freshness: '1h ago', weight: '10kg available', image: '🌊' },
        { id: 2, type: 'Pomfret', price: 600, location: 'Kasimedu', freshness: '2h ago', weight: '5kg available', image: '🐟' },
        { id: 3, type: 'Snapper', price: 380, location: 'Besant Nagar', freshness: '30m ago', weight: '15kg available', image: '🦐' },
        { id: 4, type: 'Prawns', price: 550, location: 'Neelankarai', freshness: 'Fresh upload', weight: '8kg available', image: '🦀' },
    ];

    const specialListings = [
        { id: 101, type: 'Dried Seer Fish', price: 300, location: 'Marina', shelfLife: '6 months', weight: '500g', image: '🐠', bulk: true, prep: '10 Nov 2025' },
        { id: 102, type: 'Prawn Pickle', price: 250, location: 'Kasimedu', shelfLife: '3 months', weight: '250g', image: '🏺', bulk: false, prep: '12 Nov 2025' },
        { id: 103, type: 'Fish Powder', price: 150, location: 'Neelankarai', shelfLife: '4 months', weight: '200g', image: '🧂', bulk: true, prep: '05 Nov 2025' },
        { id: 104, type: 'Salted Mackerel', price: 200, location: 'Besant Nagar', shelfLife: '5 months', weight: '1kg', image: '🐟', bulk: true, prep: '01 Nov 2025' },
    ];

    return (
        <div className="customer-dash animate-fade-in" style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>Fresh Market</h1>
                    <p style={{ color: 'var(--text-light)' }}>Direct from the boats to your doorstep</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {isRegulationActive && (
                        <div style={{ background: '#ecfccb', color: '#365314', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '1rem', border: '1px solid #bef264', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✨ Off-Season Mode</span>
                            <button onClick={handleSubscribe} style={{ background: '#365314', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>🔔</button>
                        </div>
                    )}
                    <button className={`btn ${activeTab === 'listings' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('listings')}>Browse Listings</button>
                    <button className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('orders')}>My Orders</button>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => alert(`Your cart has ${cart.length} items.`)}>
                        <span style={{ fontSize: '1.5rem' }}>🛒</span>
                        {cart.length > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--error)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {cart.length}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {activeTab === 'listings' && (
                <div className="marketplace">
                    {isRegulationActive && (
                        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className={`btn ${viewMode === 'fresh' ? 'btn-primary' : ''}`}
                                style={{ borderRadius: '20px', padding: '0.5rem 2rem' }}
                                onClick={() => setViewMode('fresh')}
                            >
                                Fresh Fish 🐟
                            </button>
                            <button
                                className={`btn ${viewMode === 'value-added' ? 'btn-primary' : ''}`}
                                style={{ borderRadius: '20px', padding: '0.5rem 2rem', background: viewMode === 'value-added' ? 'var(--accent)' : 'white', borderColor: 'var(--accent)' }}
                                onClick={() => setViewMode('value-added')}
                            >
                                Special Products ✨
                            </button>
                        </div>
                    )}
                    <section className="glass-morphism" style={{ padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                {viewMode === 'fresh' ? 'Fish Type' : 'Product Type'}
                            </label>
                            <select
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Types</option>
                                {viewMode === 'fresh' ? (
                                    <>
                                        <option>Seer Fish</option>
                                        <option>Pomfret</option>
                                        <option>Snapper</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Dried fish">Dried Fish</option>
                                        <option value="Fish pickle">Fish Pickle</option>
                                        <option value="Fish powder">Fish Powder</option>
                                        <option value="Salted fish">Salted Fish</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Price Range</label>
                            <select style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                <option>Any Price</option>
                                <option>Below ₹400</option>
                                <option>₹400 - ₹600</option>
                                <option>Above ₹600</option>
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Location</label>
                            <select style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                <option>All Locations</option>
                                <option>Marina</option>
                                <option>Kasimedu</option>
                                <option>Besant Nagar</option>
                            </select>
                        </div>
                    </section>

                    <div className="grid-container">
                        {viewMode === 'fresh' ? (
                            listings.map((item) => (
                                <div key={item.id} className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ height: '180px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                                        {item.image}
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem' }}>{item.type}</h3>
                                            <span className="badge badge-success" style={{ background: '#f0fdf4' }}>{item.freshness}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.weight} • {item.location}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-light)' }}>/kg</span></span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-secondary" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedProduct(item)}>Buy</button>
                                                <button className="btn btn-primary" style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleAddToCart(item)}>Add to Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            specialListings
                                .filter(item => selectedCategory === 'All' || item.type.includes(selectedCategory.replace('fish', '').trim())) // Simple mock filter logic
                                .map((item) => (
                                    <div key={item.id} className="premium-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                                        <div style={{ height: '180px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                                            {item.image}
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', color: '#c2410c' }}>{item.type}</h3>
                                                <span className="badge" style={{ background: '#ffedd5', color: '#c2410c' }}>Shelf Life: {item.shelfLife}</span>
                                            </div>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Weight:</strong> {item.weight}</p>
                                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}><strong>Prep Date:</strong> {item.prep}</p>
                                            {item.bulk && (
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <span className="badge" style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.8rem' }}>Available for Bulk Order</span>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c2410c' }}>₹{item.price}</span>
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', background: 'var(--accent)', borderColor: 'var(--accent)' }}
                                                    onClick={() => setSelectedProduct(item)}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-section animate-fade-in">
                    <h2 style={{ marginBottom: '1.5rem' }}>Your Orders</h2>
                    <div className="premium-card" style={{ padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ marginBottom: '0.25rem' }}>Order #FD-9231</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>2kg Seer Fish • Marina Harbor</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', marginBottom: '0.5rem', display: 'inline-block' }}>Out for Delivery</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setActiveOrderView({ type: 'track', orderId: 'FD-9231' })}>Track</button>
                                <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--border)' }} onClick={() => setActiveOrderView({ type: 'chat', orderId: 'FD-9231' })}>Chat</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {selectedProduct && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'white', zIndex: 1000, overflowY: 'auto' }}>
                    <ProductDetails
                        product={selectedProduct}
                        onBack={() => setSelectedProduct(null)}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            )}

            {activeOrderView && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'white', zIndex: 1000, overflowY: 'auto' }}>
                    {activeOrderView.type === 'track' ? (
                        <OrderTracking orderId={activeOrderView.orderId} onBack={() => setActiveOrderView(null)} />
                    ) : (
                        <OrderChat orderId={activeOrderView.orderId} onBack={() => setActiveOrderView(null)} />
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
