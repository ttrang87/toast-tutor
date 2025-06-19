import { toast } from 'react-hot-toast';

let websocket = null;
let reconnectInterval = null;
const WS_URL = 'ws://127.0.0.1:8000/ws/status/';

const setupWebSocket = () => {
  if (websocket && websocket.readyState === WebSocket.OPEN) return;

  // Clear any existing reconnect intervals
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }

  websocket = new WebSocket(WS_URL);

  websocket.onopen = () => {
    console.log('WebSocket connection established');
    // Clear reconnect interval if it was set
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket message received:', data);
    // The backend sends online_users list, which components can use
  };

  websocket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
    
    // Only try to reconnect if it wasn't closed intentionally
    if (!event.wasClean) {
      // Setup reconnect interval
      reconnectInterval = setInterval(() => {
        console.log('Attempting to reconnect WebSocket...');
        setupWebSocket();
      }, 5000); // Try to reconnect every 5 seconds
    }
  };

  websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
    toast.error('WebSocket connection error. Try refreshing the page.');
  };

  return websocket;
};

export const initializeWebSocket = () => {
  return setupWebSocket();
};

export const closeWebSocket = () => {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
  }
};

export const getWebSocketInstance = () => {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    return setupWebSocket();
  }
  return websocket;
};
