import { useState, useEffect } from 'react';
import { getWebSocketInstance } from '../services/websocketService';

/**
 * Custom hook to track online users from WebSocket
 * @returns {Array} Array of online usernames
 */
export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  useEffect(() => {
    const ws = getWebSocketInstance();
    
    const handleWebSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.online_users) {
          setOnlineUsers(data.online_users);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    if (ws) {
      ws.addEventListener('message', handleWebSocketMessage);
    }
    
    return () => {
      if (ws) {
        ws.removeEventListener('message', handleWebSocketMessage);
      }
    };
  }, []);
  
  return onlineUsers;
};

/**
 * Check if a specific user is online
 * @param {string} username - The username to check
 * @returns {boolean} True if the user is online
 */
export const useIsUserOnline = (username) => {
  const onlineUsers = useOnlineUsers();
  return onlineUsers.includes(username);
};
