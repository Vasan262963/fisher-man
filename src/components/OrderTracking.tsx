import React from 'react';

interface OrderTrackingProps {
    orderId: string;
    onBack: () => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, onBack }) => {
    const steps = [
        { status: 'Order Placed', time: '10:30 AM', completed: true, icon: '📅' },
        { status: 'Confirmed by Fisherman', time: '10:45 AM', completed: true, icon: '✅' },
        { status: 'Out for Delivery', time: '11:15 AM', completed: true, icon: '🚚' },
        { status: 'Arriving Soon', time: 'In 15 mins', completed: false, icon: '📍' },
    ];

    return (
        <div className="order-tracking animate-fade-in" style={{ padding: '2rem' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '2rem' }}>
                ← Back to Orders
            </button>

            <h1 style={{ marginBottom: '2rem' }}>Track Order {orderId}</h1>

            <div className="grid-container" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr' }}>
                <div className="premium-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Status Updates</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                        {steps.map((step, index) => (
                            <div key={index} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    zIndex: 2,
                                    background: 'white',
                                    borderRadius: '50%',
                                    padding: '5px'
                                }}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, color: step.completed ? 'var(--text)' : 'var(--text-light)' }}>{step.status}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{step.time}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '18px',
                                        top: '30px',
                                        width: '2px',
                                        height: '40px',
                                        background: step.completed ? 'var(--success)' : '#e2e8f0',
                                        zIndex: 1
                                    }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="premium-card bg-ocean" style={{ height: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚤</div>
                    <p style={{ fontWeight: 700 }}>Real-time Map tracking coming soon!</p>
                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Fisherman: Muthu • Vehicle: TVS XL (TN 01 AB 1234)</p>

                    {/* Mock map elements */}
                    <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1, background: 'radial-gradient(circle, #fff 10%, transparent 10%)', backgroundSize: '30px 30px' }} />
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
