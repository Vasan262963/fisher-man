import React from 'react';

interface Product {
    id: number;
    type: string;
    price: number;
    location: string;
    freshness?: string;
    shelfLife?: string;
    weight: string;
    image: string;
    prep?: string;
}

interface ProductDetailsProps {
    product: Product;
    onBack: () => void;
    onAddToCart: (product: Product) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onAddToCart }) => {
    const handlePayNow = () => {
        alert(`Payment successful for ${product.type}! Your order is being processed.`);
        onBack();
    };

    return (
        <div className="product-details animate-fade-in" style={{ padding: '2rem' }}>
            <button
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                ← Back to Marketplace
            </button>

            <div className="premium-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', padding: '0', overflow: 'hidden' }}>
                <div style={{ background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', height: '400px' }}>
                    {product.image}
                </div>
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{product.type}</h1>
                            {product.freshness && (
                                <span className="badge badge-success" style={{ background: '#f0fdf4' }}>{product.freshness}</span>
                            )}
                            {product.shelfLife && (
                                <span className="badge" style={{ background: '#ffedd5', color: '#c2410c' }}>Shelf Life: {product.shelfLife}</span>
                            )}
                        </div>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</span>
                    </div>

                    <div style={{ margin: '2rem 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass-morphism" style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Location</p>
                            <p style={{ fontWeight: 600 }}>{product.location}</p>
                        </div>
                        <div className="glass-morphism" style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Available Quantity</p>
                            <p style={{ fontWeight: 600 }}>{product.weight}</p>
                        </div>
                        {product.prep && (
                            <div className="glass-morphism" style={{ padding: '1rem' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Preparation Date</p>
                                <p style={{ fontWeight: 600 }}>{product.prep}</p>
                            </div>
                        )}
                    </div>

                    <p style={{ color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
                        This {product.type.toLowerCase()} is sourced directly from local fishermen in {product.location}.
                        Experience the premium quality and freshness that FisherDirect brings from the ocean to your home.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '1rem' }}
                            onClick={() => {
                                onAddToCart(product);
                                alert(`${product.type} added to cart!`);
                            }}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1, padding: '1rem' }}
                            onClick={handlePayNow}
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
