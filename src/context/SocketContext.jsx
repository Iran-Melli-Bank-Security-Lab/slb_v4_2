// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { socket } from '../socket';
import { useSession } from '../SessionContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const user = useSession().session
  console.log("useSession ( ) " , user )
  // Memoize the socket value to prevent unnecessary re-renders
  const socketValue = useMemo(() => socket, []);

  useEffect(() => {

    if (!user) {
      console.log('🔒 User not authenticated. Socket will not connect.', user);
      return;
    }
    if (!isConnected && !socket.connected) {
       socket.connect();
    }
    const onConnect = () => {
      console.log('Socket connected!');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected!');
      setIsConnected(false);
    };

    const onConnectError = (err) => {
      console.error('Socket connection error:', err);
    };



    // Attach event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      // Only disconnect if socket is actually connected
      if (isConnected) {
        socket.disconnect();
      }

      // Clean up all event listeners
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [ isConnected , user ]);

  return (
    <SocketContext value={socketValue}>
      {children}
    </SocketContext>
  );
}

export const useSocket = () => useContext(SocketContext);