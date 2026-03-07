import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div className="admin-dash animate-fade-in" style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Admin Control Center</h1>
                <p style={{ color: 'var(--text-light)' }}>Platform metrics and regulation oversight</p>
            </header>

            <div className="grid-container" style={{ marginBottom: '2rem' }}>
                <div className="premium-card" style={{ padding: '1.5rem' }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>1,240</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>840 Fishermen</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>400 Customers</span>
                    </div>
                </div>
                <div className="premium-card" style={{ padding: '1.5rem' }}>
                    <h3>Revenue Flow</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹4.2 Lakhs</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '1rem' }}>Current Month GMV</p>
                </div>
                <div className="premium-card" style={{ padding: '1.5rem' }}>
                    <h3>Active Bans</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--error)' }}>2 Regions</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '1rem' }}>Seasonal Regulation Active</p>
                </div>
            </div>

            <div className="premium-card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Regulation & Scheme Management</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>PMMSY Subsidy Update</strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Last updated: 2 days ago</p>
                        </div>
                        <button className="btn btn-secondary">Edit Details</button>
                    </div>
                    <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>Seasonal Fishing Ban (Marina Harbor)</strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Scheduled for June 1st</p>
                        </div>
                        <button className="btn btn-secondary">Manage</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
