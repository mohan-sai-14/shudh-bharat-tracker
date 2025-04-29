import { io, Socket } from 'socket.io-client';
import { AQIData } from '@/types';

class RealtimeService {
  private socket: Socket | null = null;
  private static instance: RealtimeService;
  private callbacks: Map<string, (data: AQIData) => void> = new Map();

  private constructor() {
    try {
      this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false // Don't connect automatically
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to realtime service');
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from realtime service');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  connect() {
    if (this.socket && !this.socket.connected) {
      try {
        this.socket.connect();
      } catch (error) {
        console.error('Failed to connect to socket:', error);
      }
    }
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      try {
        this.socket.disconnect();
      } catch (error) {
        console.error('Failed to disconnect socket:', error);
      }
    }
  }

  subscribeToAQIUpdates(city: string, callback: (data: AQIData) => void) {
    try {
      if (!this.socket) return;
      
      // Store the callback
      this.callbacks.set(city, callback);
      
      // Subscribe to updates
      this.socket.emit('subscribe:aqi', { city });
      this.socket.on(`aqi:${city}`, (data: AQIData) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in AQI callback for ${city}:`, error);
        }
      });
    } catch (error) {
      console.error(`Failed to subscribe to AQI updates for ${city}:`, error);
    }
  }

  unsubscribeFromAQIUpdates(city: string) {
    try {
      if (!this.socket) return;
      
      // Remove the callback
      this.callbacks.delete(city);
      
      // Unsubscribe from updates
      this.socket.emit('unsubscribe:aqi', { city });
      this.socket.off(`aqi:${city}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from AQI updates for ${city}:`, error);
    }
  }
}

export const realtimeService = RealtimeService.getInstance();
