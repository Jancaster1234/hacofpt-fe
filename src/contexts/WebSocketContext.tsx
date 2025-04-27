import React, { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '@/hooks/useAuth_v0';
import { toast } from 'sonner';

interface WebSocketContextType {
    client: Client | null;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
    client: null,
    isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [client, setClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const socket = new SockJS('http://localhost:8083/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
                toast.error('WebSocket connection error');
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                toast.error('WebSocket connection error');
            },
            onDisconnect: () => {
                setIsConnected(false);
                toast.error('Disconnected from WebSocket');
            }
        });

        stompClient.onConnect = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        };

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, [user?.id]);

    return (
        <WebSocketContext.Provider value={{ client, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}; 