import React, { useState, useEffect } from 'react';

interface Message {
    sender: 'ai' | 'user';
    text: string;
}

interface AIChatbotProps {
    role: string;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const welcomeMessage = role === 'fisherman'
            ? "Namaste Captain! 🚢 I'm your AI Catch Assistant. Need advice on pricing, weather, or net maintenance?"
            : role === 'customer'
                ? "Hello! 🌊 I'm your Fresh Guide. Looking for the best catch today or need a recipe for Seer Fish?"
                : "Welcome to FisherDirect! 🛥️ How can I help you today?";

        setMessages([{ sender: 'ai', text: welcomeMessage }]);
    }, [role]);

    // Handle Proactive Alerts
    useEffect(() => {
        const handleAlert = (e: any) => {
            const { issueType, load } = e.detail;
            setIsOpen(true);

            let alertMsg = "";
            switch (issueType) {
                case 'OVERLOAD':
                    alertMsg = `🚨 Captain, I've detected an OVERLOAD (${load}kg)! Stop the motor immediately to avoid net damage. I can guide you through manual recovery if needed.`;
                    break;
                case 'TANGLE':
                    alertMsg = `🌀 WARNING: Net Tangle detected! I recommend backing down the vessel and checking line tension. Would you like instructions on clearing an entanglement?`;
                    break;
                case 'TEAR':
                    alertMsg = `❌ CRITICAL: Net Tearing detected! Haul in what you can immediately. I'm checking nearby repair shops for you.`;
                    break;
            }

            if (alertMsg) {
                setMessages(prev => [...prev, { sender: 'ai', text: alertMsg }]);
            }
        };

        window.addEventListener('custom:net-alert', handleAlert);
        return () => window.removeEventListener('custom:net-alert', handleAlert);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { sender: 'user', text: input } as Message;
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, role })
            });
            const data = await response.json();
            setMessages([...newMessages, { sender: 'ai', text: data.text }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages([...newMessages, { sender: 'ai', text: "Sorry, I lost my connection to the sea. Check if the server is running!" }]);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 2000,
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'none'
                }}
            >
                {isOpen ? '✕' : '🤖'}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="glass-morphism animate-fade-in"
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '350px',
                        height: '500px',
                        zIndex: 2000,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Header */}
                    <div style={{ background: 'var(--primary)', padding: '1.5rem', color: 'white' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>FisherDirect AI Assistant</h3>
                        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Helping you navigate the digital ocean</p>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '1rem',
                                borderRadius: '16px',
                                background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                                color: msg.sender === 'user' ? 'white' : 'var(--text)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                fontSize: '0.9rem',
                                border: msg.sender === 'ai' ? '1px solid #f1f5f9' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                        />
                        <button
                            onClick={handleSend}
                            style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 1rem', cursor: 'pointer' }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
