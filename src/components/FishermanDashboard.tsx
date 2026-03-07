import React, { useState, useEffect, useRef } from "react";
import { isSeasonalRegulationActive } from "../utils/dateUtils";

// ---------- PREMIUM STYLES ----------
const styles = {
    appContainer: {
        backgroundColor: "#f0f9ff",
        minHeight: "100vh",
        paddingBottom: "80px", // space for bottom nav
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    header: {
        backgroundColor: "#0ea5e9",
        padding: "1.5rem 1rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "0 0 20px 20px",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    },
    adviceBanner: {
        background: "white",
        margin: "1rem",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        borderLeft: "4px solid #0ea5e9",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1rem",
        padding: "1rem",
    },
    card: {
        backgroundColor: "white",
        padding: "1.5rem 1rem",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        cursor: "pointer",
        transition: "transform 0.2s",
    },
    bottomNav: {
        position: "fixed" as const,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        height: "70px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #e2e8f0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
    },
    navItem: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        fontSize: "0.75rem",
        color: "#64748b",
        gap: "0.25rem",
        cursor: "pointer",
    },
    activeNavItem: {
        color: "#0ea5e9",
    }
};

const FishermanDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<"home" | "upload" | "orders" | "income" | "schemes" | "advice" | "profile" | "net-monitor">("home");
    const [lang, setLang] = useState<"en" | "ta">("en");
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);
    const [expenses, setExpenses] = useState({ fuel: 0, ice: 0, wages: 0, repairs: 0, other: 0 });
    const [revenue, setRevenue] = useState(15400);
    const [weather, setWeather] = useState<"Sunny" | "Cloudy" | "Stormy">("Sunny");
    const [orders, setOrders] = useState([
        { id: "ORD-9921", customer: "The Grand Marina", items: "Seer Fish (5kg)", amount: 2500, status: "Pending", time: "10:30 AM" },
        { id: "ORD-9920", customer: "Coastline Bistro", items: "Mackerel (12kg)", amount: 3600, status: "Completed", time: "Yesterday" },
        { id: "ORD-9919", customer: "Annai Seafoods", items: "Tuna (8kg)", amount: 4000, status: "Completed", time: "Yesterday" },
    ]);

    // ---------- NET MONITOR STATE ----------
    const [netLoad, setNetLoad] = useState(0);
    const [netStatus, setNetStatus] = useState<'SAFE' | 'STOP'>('SAFE');
    const [isManualMode, setIsManualMode] = useState(false);
    const [lastAlertSent, setLastAlertSent] = useState<number>(0);
    const [activeIssue, setActiveIssue] = useState<'NONE' | 'OVERLOAD' | 'TANGLE' | 'TEAR'>('NONE');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Simulation logic
    useEffect(() => {
        if (isManualMode) return; // Stop updates if manual

        const interval = setInterval(() => {
            const newLoad = Math.floor(Math.random() * 80);
            setNetLoad(newLoad);
            setNetStatus(newLoad >= 50 ? 'STOP' : 'SAFE');
        }, 3000);

        return () => clearInterval(interval);
    }, [isManualMode]);

    const updateManualLoad = (val: number) => {
        setNetLoad(val);
        setNetStatus(val >= 50 ? 'STOP' : 'SAFE');
    };

    const getStressLevel = (load: number) => {
        if (load < 20) return "LOW";
        if (load < 50) return "MEDIUM";
        return "HIGH";
    };

    // ---------- EMAIL ALERT TRIGGER ----------
    useEffect(() => {
        const triggerEmailAlert = async () => {
            const now = Date.now();

            // Determine the issue type
            let currentIssue: 'NONE' | 'OVERLOAD' | 'TANGLE' | 'TEAR' = 'NONE';
            if (netStatus === 'STOP') currentIssue = 'OVERLOAD';
            if (activeIssue !== 'NONE') currentIssue = activeIssue;

            // 5 minute cooldown (300000ms)
            if (currentIssue !== 'NONE' && (now - lastAlertSent > 300000)) {
                try {
                    console.log(`Triggering ${currentIssue} alert...`);
                    const response = await fetch('http://localhost:3001/api/alert', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            load: netLoad,
                            status: netStatus,
                            fisherman: 'Captain Viswanathan',
                            issueType: currentIssue
                        })
                    });
                    if (response.ok) {
                        setLastAlertSent(now);
                        console.log(`${currentIssue} alert triggered successfully`);
                    }
                } catch (error) {
                    console.error("Failed to trigger alert email:", error);
                }
            }

            // Dispatch custom event for AI Chatbot
            if (currentIssue !== 'NONE') {
                window.dispatchEvent(new CustomEvent('custom:net-alert', {
                    detail: { issueType: currentIssue, load: netLoad }
                }));
            }
        };

        triggerEmailAlert();
    }, [netStatus, netLoad, lastAlertSent, activeIssue]);

    const isRegulationActive = isSeasonalRegulationActive();
    const totalExpenses = expenses.fuel + expenses.ice + expenses.wages + expenses.repairs + expenses.other;
    const profit = revenue - totalExpenses;
    const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0";

    // ---------- SYNC LOGIC ----------
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // ---------- UI HELPERS ----------
    const t = {
        en: {
            title: "FisherDirect",
            welcome: "Captain's Dashboard",
            advice_title: "TODAY'S SMART ADVICE",
            upload: "Upload Fish",
            orders: "Orders",
            income: "Income Insights",
            schemes: "Govt Schemes",
            advice: "Today's Advice",
            profile: "Profile",
            net_monitor: "Net Monitor 📡",
            switch: "தமிழ்",
        },
        ta: {
            title: "ஃபிஷர்டைரக்ட்",
            welcome: "கேப்டன் டாஷ்போர்டு",
            advice_title: "இன்றைய ஸ்மார்ட் அறிவுரை",
            upload: "மீன் பதிவேற்றம்",
            orders: "ஆர்டர்கள்",
            income: "வருமான விவரம்",
            schemes: "அரசு திட்டங்கள்",
            advice: "இன்றைய அறிவுரை",
            profile: "சுயவிவரம்",
            net_monitor: "வலை கண்காணிப்பு",
            switch: "English",
        }
    };

    const currentT = t[lang];

    const getAdviceSummary = () => {
        if (isRegulationActive) return lang === 'en' ? "Ban active. Avoid sea. Apply for relief." : "மீன்பிடி தடைக்காலம். நிவாரணத்திற்கு விண்ணப்பிக்கவும்.";
        if (weather === 'Stormy') return lang === 'en' ? "Storm alert. High risk category." : "புயல் எச்சரிக்கை. அதிக ஆபத்து.";
        return lang === 'en' ? "Strong currents today. Focus on dried fish." : "இன்று நீரோட்டம் அதிகம். கருவாட்டுக்கு முக்கியத்துவம் கொடுங்கள்.";
    };

    return (
        <div style={styles.appContainer}>
            {/* ---------- HEADER ---------- */}
            <header style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🚢</span>
                    <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>{currentT.title}</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: isOnline ? '#22c55e' : '#ef4444',
                        boxShadow: `0 0 8px ${isOnline ? '#22c55e' : '#ef4444'}`
                    }}></div>
                    <button
                        onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}
                    >
                        {currentT.switch}
                    </button>
                    <div style={{ fontSize: '1.25rem' }}>🔔</div>
                </div>
            </header>

            {/* ---------- CONTENT ---------- */}
            <main>
                {activeView === "home" && (
                    <div className="animate-fade-in">
                        <div style={styles.adviceBanner}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#0ea5e9' }}>🌊</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', letterSpacing: '1px' }}>{currentT.advice_title}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
                                {getAdviceSummary()}
                            </p>
                            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.4rem' }}>• Risk: Moderate</div>
                        </div>

                        {/* LIVE NET STATUS ON HOME PAGE */}
                        <div style={{
                            background: netStatus === 'STOP' ? '#fee2e2' : '#dcfce7',
                            margin: '1rem',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: `2px solid ${netStatus === 'STOP' ? '#ef4444' : '#22c55e'}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            animation: netStatus === 'STOP' ? 'pulse 1.5s infinite' : 'none'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>SMART NET MONITOR</span>
                                <div style={{
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '12px',
                                    backgroundColor: netStatus === 'STOP' ? '#ef4444' : '#22c55e',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 800
                                }}>
                                    {netStatus}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>LOAD VALUE</div>
                                    {isManualMode ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                value={netLoad}
                                                onChange={(e) => updateManualLoad(Number(e.target.value))}
                                                style={{ width: '80px', fontSize: '1.5rem', padding: '0.2rem', borderRadius: '8px', border: '1px solid #0ea5e9' }}
                                            />
                                            <span style={{ fontSize: '1rem', fontWeight: 700 }}>kg</span>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>
                                            {netLoad} <span style={{ fontSize: '1rem' }}>kg</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>STRESS</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: netLoad >= 50 ? '#ef4444' : '#1e293b' }}>
                                        {getStressLevel(netLoad)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                    onClick={() => setIsManualMode(!isManualMode)}
                                    style={{
                                        flex: 2,
                                        padding: '0.6rem',
                                        borderRadius: '10px',
                                        border: '1px solid #0ea5e9',
                                        backgroundColor: isManualMode ? '#0ea5e9' : 'white',
                                        color: isManualMode ? 'white' : '#0ea5e9',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isManualMode ? 'RESUME LIVE' : 'MANUAL INPUT'}
                                </button>
                                {netStatus === 'STOP' && (
                                    <div style={{ flex: 3, color: '#b91c1c', fontWeight: 700, fontSize: '0.8rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ⚠ PULL NET NOW!
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={styles.grid}>
                            <div style={styles.card} onClick={() => setActiveView("upload")}>
                                <div style={{ background: '#e0f2fe', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🐟</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.upload}</span>
                            </div>
                            <div style={styles.card} onClick={() => setActiveView("orders")}>
                                <div style={{ background: '#fef3c7', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📋</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.orders}</span>
                            </div>
                            <div style={styles.card} onClick={() => setActiveView("income")}>
                                <div style={{ background: '#dcfce7', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📈</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.income}</span>
                            </div>
                            <div style={styles.card} onClick={() => setActiveView("schemes")}>
                                <div style={{ background: '#ede9fe', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📜</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.schemes}</span>
                            </div>
                            <div style={styles.card} onClick={() => setActiveView("advice")}>
                                <div style={{ background: '#fce7f3', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💡</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.advice}</span>
                            </div>
                            <div style={styles.card} onClick={() => setActiveView("net-monitor")}>
                                <div style={{ background: '#fef2f2', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⚓</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.net_monitor}</span>
                            </div>
                            <div style={styles.card} onClick={() => setActiveView("profile")}>
                                <div style={{ background: '#f1f5f9', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👤</div>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{currentT.profile}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === "upload" && (
                    <div style={{ padding: '1rem' }} className="animate-fade-in">
                        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button onClick={() => setActiveView('home')} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>←</button>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>UPLOAD FISH</h2>
                        </header>

                        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: selectedImage ? '0.5rem' : '2rem',
                                    border: '2px dashed #0ea5e9',
                                    borderRadius: '12px',
                                    marginBottom: '1.5rem',
                                    backgroundColor: '#f0f9ff',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {selectedImage ? (
                                    <>
                                        <img src={selectedImage} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div style={{ position: 'absolute', bottom: '10px', background: 'rgba(14, 165, 233, 0.8)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>CHANGE PHOTO</div>
                                    </>
                                ) : (
                                    <>
                                        <span style={{ fontSize: '2rem' }}>📷</span>
                                        <span style={{ fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 600, marginTop: '0.5rem' }}>UPLOAD FISH IMAGE</span>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>🐟 FISH TYPE</label>
                                    <select style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.4rem' }}>
                                        <option>Seer Fish</option>
                                        <option>Mackerel</option>
                                        <option>Tuna</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>⚖️ (kg)</label>
                                        <input type="number" placeholder="10" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.4rem' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>₹ PER KG</label>
                                        <input type="number" placeholder="500" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.4rem' }} />
                                    </div>
                                </div>
                            </div>

                            <button style={{ width: '100%', backgroundColor: '#0ea5e9', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 700, marginTop: '2rem', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}>
                                SUBMIT LISTING
                            </button>
                        </div>
                    </div>
                )}

                {activeView === "orders" && (
                    <div style={{ padding: '1rem' }} className="animate-fade-in">
                        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button onClick={() => setActiveView('home')} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>←</button>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>MY ORDERS</h2>
                        </header>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {orders.map((order) => (
                                <div key={order.id} style={{
                                    background: 'white',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                                    borderLeft: `5px solid ${order.status === 'Completed' ? '#22c55e' : '#eab308'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{order.customer}</span>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '8px',
                                            background: order.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                                            color: order.status === 'Completed' ? '#166534' : '#92400e',
                                            fontWeight: 800
                                        }}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '10px', fontSize: '1.2rem' }}>🐟</div>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{order.items}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Order ID: {order.id} • {order.time}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Total Amount:</span>
                                        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0ea5e9' }}>₹{order.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === "income" && (
                    <div style={{ padding: '1rem' }} className="animate-fade-in">
                        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button onClick={() => setActiveView('home')} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>←</button>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>INCOME INSIGHTS</h2>
                        </header>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>MONTHLY INCOME</div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '100px', marginTop: '1rem' }}>
                                <div style={{ backgroundColor: '#0ea5e9', width: '20px', height: '60%' }}></div>
                                <div style={{ backgroundColor: '#0ea5e9', width: '20px', height: '80%' }}></div>
                                <div style={{ backgroundColor: '#0ea5e9', width: '20px', height: '40%' }}></div>
                                <div style={{ backgroundColor: '#0ea5e9', width: '20px', height: '90%' }}></div>
                                <div style={{ backgroundColor: '#0ea5e9', width: '20px', height: '70%' }}></div>
                            </div>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Total Revenue</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{revenue.toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Profit Metric</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e' }}>{margin}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === "schemes" && (
                    <div style={{ padding: '1rem' }} className="animate-fade-in">
                        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button onClick={() => setActiveView('home')} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>←</button>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>GOVT SCHEMES</h2>
                        </header>
                        <div style={styles.grid}>
                            <div style={{ ...styles.card, background: '#3b82f6', color: 'white' }}>
                                <span style={{ fontSize: '1.5rem' }}>🏛️</span>
                                <span style={{ textAlign: 'center', fontWeight: 600 }}>PMMSY</span>
                                <button style={{ background: 'white', color: '#3b82f6', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem' }}>APPLY</button>
                            </div>
                            <div style={{ ...styles.card, background: '#22c55e', color: 'white' }}>
                                <span style={{ fontSize: '1.5rem' }}>💳</span>
                                <span style={{ textAlign: 'center', fontWeight: 600 }}>KCC</span>
                                <button style={{ background: 'white', color: '#22c55e', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem' }}>APPLY</button>
                            </div>
                            {/* Add more as needed */}
                        </div>
                    </div>
                )}

                {activeView === "net-monitor" && (
                    <div style={{ padding: '1rem' }} className="animate-fade-in">
                        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button onClick={() => setActiveView('home')} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>←</button>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>SMART NET MONITOR 📡</h2>
                        </header>

                        <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '16px', color: 'white', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ARDUINO SYSTEM ACTIVE</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: NET-PRO-X1</span>
                        </div>

                        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, letterSpacing: '1px' }}>CURRENT NET LOAD</div>

                            {isManualMode ? (
                                <div style={{ margin: '1rem 0' }}>
                                    <input
                                        type="number"
                                        value={netLoad}
                                        onChange={(e) => updateManualLoad(Number(e.target.value))}
                                        style={{ fontSize: '4rem', width: '200px', textAlign: 'center', border: '2px solid #0ea5e9', borderRadius: '16px', fontWeight: 900 }}
                                    />
                                    <span style={{ fontSize: '2rem' }}> kg</span>
                                </div>
                            ) : (
                                <div style={{ fontSize: '5rem', fontWeight: 900, color: netStatus === 'STOP' ? '#ef4444' : '#0ea5e9', margin: '1rem 0' }}>
                                    {netLoad}<span style={{ fontSize: '1.5rem' }}> kg</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <button
                                    onClick={() => setIsManualMode(!isManualMode)}
                                    style={{
                                        padding: '0.8rem 2rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: isManualMode ? '#0ea5e9' : '#f1f5f9',
                                        color: isManualMode ? 'white' : '#64748b',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isManualMode ? 'RESUME LIVE STREAM' : 'MANUAL INPUT OVERRIDE'}
                                </button>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>STRESS INTENSITY</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: netLoad >= 50 ? '#ef4444' : '#eab308' }}>{getStressLevel(netLoad)}</span>
                                </div>
                                <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(netLoad / 80) * 100}%`, height: '100%', background: netLoad >= 50 ? '#ef4444' : netLoad >= 30 ? '#f59e0b' : '#22c55e', transition: 'width 0.5s ease-out' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                                <button
                                    onClick={() => setActiveIssue('TANGLE')}
                                    style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: activeIssue === 'TANGLE' ? '#f59e0b' : '#f1f5f9', color: activeIssue === 'TANGLE' ? 'white' : '#64748b', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    🌀 TANGLE
                                </button>
                                <button
                                    onClick={() => setActiveIssue('TEAR')}
                                    style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: activeIssue === 'TEAR' ? '#ef4444' : '#f1f5f9', color: activeIssue === 'TEAR' ? 'white' : '#64748b', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    ❌ TEAR
                                </button>
                                <button
                                    onClick={() => setActiveIssue('NONE')}
                                    style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', background: '#e2e8f0', color: '#64748b', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    RESET
                                </button>
                            </div>

                            <div style={{
                                background: (netStatus === 'STOP' || activeIssue !== 'NONE') ? '#fee2e2' : '#dcfce7',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                border: `2px solid ${(netStatus === 'STOP' || activeIssue !== 'NONE') ? '#ef4444' : '#22c55e'}`,
                                animation: (netStatus === 'STOP' || activeIssue !== 'NONE') ? 'pulse 1s infinite' : 'none'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: (netStatus === 'STOP' || activeIssue !== 'NONE') ? '#991b1b' : '#166534' }}>
                                    {(netStatus === 'STOP' || activeIssue !== 'NONE') ? `⛔ ${activeIssue !== 'NONE' ? activeIssue : 'STOP - OVERLOAD'}` : '✅ SAFE TO PULL'}
                                </div>
                                {(netStatus === 'STOP' || activeIssue !== 'NONE') && (
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#b91c1c', fontWeight: 600 }}>
                                        {activeIssue === 'TANGLE' ? '⚠️ NET ENTAGLEMENT DETECTED - BACK DOWN VESSEL!' :
                                            activeIssue === 'TEAR' ? '⚠️ NET TEARING DETECTED - HAUL IN IMMEDIATELY!' :
                                                '⚠️ LOAD EXCEEDS 50KG - STOP MOTOR IMMEDIATELY!'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Peak Load Today</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>54 kg</div>
                            </div>
                            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Pulling Duration</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>12 min</div>
                            </div>
                        </div>
                    </div>
                )}
                {activeView === "advice" && (
                    <div style={{ padding: '1rem' }} className="animate-fade-in">
                        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button onClick={() => setActiveView('home')} style={{ background: 'none', border: 'none', fontSize: '1.25rem' }}>←</button>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>TODAY'S ADVICE</h2>
                        </header>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗼</div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
                                {getAdviceSummary()}
                            </p>
                            <div style={{ height: '10px', background: 'linear-gradient(to right, #22c55e, #eab308, #ef4444)', borderRadius: '5px', margin: '2rem 0', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: -10, left: weather === 'Stormy' ? '90%' : '20%', fontSize: '1.5rem' }}>📍</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                <span>LOW RISK</span>
                                <span>HIGH RISK</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ---------- BOTTOM NAV ---------- */}
            <nav style={styles.bottomNav}>
                <div style={{ ...styles.navItem, ...(activeView === 'home' ? styles.activeNavItem : {}) }} onClick={() => setActiveView('home')}>
                    <span style={{ fontSize: '1.5rem' }}>🏠</span>
                    <span>Home</span>
                </div>
                <div style={{ ...styles.navItem, ...(activeView === 'upload' ? styles.activeNavItem : {}) }} onClick={() => setActiveView('upload')}>
                    <span style={{ fontSize: '1.5rem' }}>➕</span>
                    <span>Upload</span>
                </div>
                <div style={{ ...styles.navItem, ...(activeView === 'orders' ? styles.activeNavItem : {}) }} onClick={() => setActiveView('orders')}>
                    <span style={{ fontSize: '1.5rem' }}>📋</span>
                    <span>Orders</span>
                </div>
                <div style={{ ...styles.navItem, ...(activeView === 'income' ? styles.activeNavItem : {}) }} onClick={() => setActiveView('income')}>
                    <span style={{ fontSize: '1.5rem' }}>📊</span>
                    <span>Income</span>
                </div>
                <div style={{ ...styles.navItem, ...(activeView === 'schemes' ? styles.activeNavItem : {}) }} onClick={() => setActiveView('schemes')}>
                    <span style={{ fontSize: '1.5rem' }}>⚖️</span>
                    <span>Schemes</span>
                </div>
            </nav>
        </div>
    );
};

export default FishermanDashboard;
