// src/context/SocketContext.jsx
// import { createContext, useContext, useEffect, useState, useMemo } from 'react';
// import { socket } from '../socket';
// import { useSession } from '../SessionContext';

// const SocketContext = createContext(null);

// export function SocketProvider({ children }) {
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   const user = useSession().session
//   console.log("useSession ( ) " , user )
//   // Memoize the socket value to prevent unnecessary re-renders
//   const socketValue = useMemo(() => socket, []);

//   useEffect(() => {

//     if (!user) {
//       console.log('🔒 User not authenticated. Socket will not connect.', user);
//       return;
//     }
//     if (!isConnected && !socket.connected) {
//        socket.connect();
//     }
//     const onConnect = () => {
//       console.log('Socket connected!');
//       setIsConnected(true);
//     };

//     const onDisconnect = () => {
//       console.log('Socket disconnected!');
//       setIsConnected(false);
//     };

//     const onConnectError = (err) => {
//       console.error('Socket connection error:', err);
//     };



//     // Attach event listeners
//     socket.on('connect', onConnect);
//     socket.on('disconnect', onDisconnect);
//     socket.on('connect_error', onConnectError);

//     return () => {
//       // Only disconnect if socket is actually connected
//       if (isConnected) {
//         socket.disconnect();
//       }

//       // Clean up all event listeners
//       socket.off('connect', onConnect);
//       socket.off('disconnect', onDisconnect);
//       socket.off('connect_error', onConnectError);
//     };
//   }, [ isConnected , user ]);

//   return (
//     <SocketContext value={socketValue}>
//       {children}
//     </SocketContext>
//   );
// }

// export const useSocket = () => useContext(SocketContext);


// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { socket } from '../socket';
import { useSession } from '../SessionContext';
import { toast } from 'react-toastify';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [reconnecting, setReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 5;
  const RETRY_INTERVAL = 5000;

  const user = useSession().session;

  const socketValue = useMemo(() => socket, []);

  useEffect(() => {
    if (!user) {
      console.log('🔒 User not authenticated. Socket will not connect.');
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log('✅ Socket connected!');
      setIsConnected(true);
      setReconnecting(false);
      setRetryCount(0);
      toast.dismiss('socket-error');
    };

    const onDisconnect = () => {
      console.log('❌ Socket disconnected!');
      setIsConnected(false);
      setReconnecting(true);
      handleReconnect();
    };

    const handleReconnect = () => {
      if (retryCount >= MAX_RETRIES) {
        setReconnecting(false);
        toast.update('socket-error', {
          render: '🚨 اتصال با سرور برقرار نشد. لطفاً صفحه را رفرش کنید.',
          type: 'error',
          isLoading: false,
          autoClose: false,
        });
        return;
      }

      toast.loading(`در حال تلاش برای اتصال مجدد... (${retryCount + 1}/${MAX_RETRIES})`, {
        toastId: 'socket-error',
      });

      const timer = setTimeout(() => {
        if (!socket.connected) {
          console.log(`🔁 Attempting reconnect #${retryCount + 1}`);
          socket.connect();
          setRetryCount(prev => prev + 1);
          handleReconnect();
        }
      }, RETRY_INTERVAL);

      return () => clearTimeout(timer);
    };

    const onConnectError = (err) => {
      console.error('⚠️ Socket connection error:', err.message);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [user, retryCount]);

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
