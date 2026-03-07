import React, { useState } from 'react';

interface OrderChatProps {
    orderId: string;
    onBack: () => void;
}

const OrderChat: React.FC<OrderChatProps> = ({ orderId, onBack }) => {
    const [messages, setMessages] = useState([
        { sender: 'fisherman', text: 'Namaste! I have confirmed your 2kg Seer Fish order.', time: '10:46 AM' },
        { sender: 'fisherman', text: 'It is fresh catch from this morning. I am leaving for delivery now.', time: '11:16 AM' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: 'customer', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInput('');

        // Mock reply
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'fisherman', text: 'Got it! I am near the harbor signal now.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1500);
    };

    return (
        <div className="order-chat animate-fade-in" style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                    ← Back
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h3>Chat with Muthu (Order {orderId})</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● Online</p>
                </div>
            </div>

            <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', padding: '1.5rem', background: '#f8fafc' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.sender === 'customer' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: msg.sender === 'customer' ? 'var(--primary)' : 'white',
                        color: msg.sender === 'customer' ? 'white' : 'var(--text)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        <p>{msg.text}</p>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '0.5rem', display: 'block', textAlign: 'right' }}>{msg.time}</span>
                    </div>
                ))}
            </div>

            <div style={{ padding: '1.5rem 0', display: 'flex', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}
                />
                <button className="btn btn-primary" onClick={handleSend} style={{ padding: '0 2rem' }}>Send</button>
            </div>
        </div>
    );
};

export default OrderChat;
