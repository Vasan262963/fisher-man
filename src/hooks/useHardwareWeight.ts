import { useState, useEffect, useRef } from 'react';

export const useHardwareWeight = () => {
    const [weight, setWeight] = useState<number | null>(null);
    const [isOffline, setIsOffline] = useState(true);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<any>(null);

    const connect = () => {
        // Port 5001 with /hardware path
        const wsUrl = 'ws://localhost:5001/hardware';
        console.log('Connecting to Hardware Weight Stream...');

        if (socketRef.current) {
            socketRef.current.close();
        }

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Hardware Weight Stream Connected');
            setIsOffline(false);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Standardize weight if it comes in "value" or "weight" format
                const weightVal = data.weight ?? data.value;
                if (weightVal !== undefined) {
                    setWeight(weightVal);
                    setIsOffline(false);
                }
            } catch (err) {
                console.error('Error parsing weight data:', err);
            }
        };

        ws.onclose = () => {
            console.log('Hardware Weight Stream Closed. Retrying in 3s...');
            setIsOffline(true);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
            setIsOffline(true);
            ws.close();
        };
    };

    useEffect(() => {
        connect();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    return { weight, isOffline };
};
