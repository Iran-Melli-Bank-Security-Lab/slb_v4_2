// src/components/Chat.js
import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

export default function Chat() {
  const socket = useSocket();
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    socket.on('message', m => setMsgs(prev => [...prev, m]));
    return () => void socket.off('message');
  }, [socket]);

  const send = () => socket.emit('message', 'hello!');
  return (
    <>
      <button onClick={send}>Send</button>
      <ul>{msgs.map((m,i)=><li key={i}>{m}</li>)}</ul>
    </>
  );
}
