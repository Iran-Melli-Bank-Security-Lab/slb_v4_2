// src/socket.js
import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const socket = io(URL, {
  autoConnect: false,        // manual connect()
  transports: ['websocket'], // optional: skip polling
 method:["GET" , "POST"], 
  withCredentials: true,     // ← send cookies on handshake
  
});
 