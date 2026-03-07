import { useState, useEffect, useRef } from 'react';

interface HardwareData {
    weight: number;
    temperature: number;
    salinity: number;
    timestamp: string | number;
}

export const useHardwareData = () => {
    const [data, setData] = useState<HardwareData | null>(null);
    const [isOffline, setIsOffline] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<any>(null);

    const connect = () => {
        // Port 5001 with /hardware path
        const wsUrl = 'ws://localhost:5001/hardware';

        console.log('Connecting to Hardware Data WebSocket...');
        if (socketRef.current) {
            socketRef.current.close();
        }

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Hardware Data Connected');
            setIsOffline(false);
            setError(null);
        };

        ws.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                // Standardize weight if it comes in "value" format
                const normalized = {
                    weight: parsedData.weight ?? parsedData.value ?? 0,
                    temperature: parsedData.temperature ?? 0,
                    salinity: parsedData.salinity ?? 0,
                    timestamp: parsedData.timestamp ?? Date.now()
                };
                setData(normalized);
            } catch (err) {
                console.error('Error parsing hardware data:', err);
            }
        };

        ws.onclose = () => {
            console.log('Hardware Data Stream Closed. Retrying in 3s...');
            setIsOffline(true);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
            console.error('Hardware WebSocket Error');
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

    return { data, isOffline, error };
};
