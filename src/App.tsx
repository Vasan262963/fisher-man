import React, { useState } from 'react';
import './index.css';
import FishermanDashboard from './components/FishermanDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import GovernmentSchemes from './components/GovernmentSchemes';
import AIChatbot from './components/AIChatbot';

type Role = 'fisherman' | 'customer' | 'admin' | 'guest';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('guest');
  const [activeTab, setActiveTab] = useState<'home' | 'schemes'>('home');

  const renderDashboard = () => {
    if (activeTab === 'schemes') {
      return <GovernmentSchemes onBack={() => setActiveTab('home')} />;
    }

    switch (role) {
      case 'fisherman':
        return <FishermanDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="landing-page animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="bg-ocean" style={{ height: '300px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>FisherDirect</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Connecting the Ocean Directly to Your Kitchen</p>
              </div>
            </div>

            <div className="grid-container">
              <div className="premium-card p-4" onClick={() => setRole('customer')} style={{ cursor: 'pointer', padding: '2rem' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>I am a Buyer</h2>
                <p>Browse fresh catch, filter by location, and order directly from fishermen.</p>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Start Shopping</button>
              </div>

              <div className="premium-card p-4" onClick={() => setRole('fisherman')} style={{ cursor: 'pointer', padding: '2rem' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>I am a Fisherman</h2>
                <p>Eliminate middlemen. List your daily catch and earn more from your hard work.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Sell My Catch</button>
              </div>

              <div className="premium-card p-4" onClick={() => setActiveTab('schemes')} style={{ cursor: 'pointer', padding: '2rem' }}>
                <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Govt Schemes</h2>
                <p>Access PMMSY, KCC, and welfare funds in one dedicated platform.</p>
                <button className="btn" style={{ background: '#fef3c7', color: '#92400e', marginTop: '1.5rem' }}>View Schemes</button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <nav className="glass-morphism" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => { setRole('guest'); setActiveTab('home'); }}>
          FisherDirect
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'transparent' }} onClick={() => setActiveTab('schemes')}>Schemes</button>
          {role !== 'guest' && (
            <button className="btn btn-secondary" onClick={() => setRole('guest')}>Logout</button>
          )}
        </div>
      </nav>

      <main>
        {renderDashboard()}
      </main>

      <footer style={{ padding: '3rem 2rem', background: 'var(--secondary)', color: 'white', textAlign: 'center', marginTop: '4rem' }}>
        <p>© 2026 FisherDirect. Empowering small-scale fishermen across India.</p>
      </footer>

      <AIChatbot role={role} />
    </div>
  );
}

export default App;
