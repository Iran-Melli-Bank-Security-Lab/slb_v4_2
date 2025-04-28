// src/components/Chat.js
import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

export default function Chat() {
  const socket = useSocket();
  const [msgs, setMsgs] = useState([]);
  const [input , setInput ] = useState("")

  const handleInput = (event)=>{
    console.log(event.target.value ) 
    setInput(event.target.value)

  }
  useEffect(() => {
    socket.on('message', m => setMsgs(prev => [...prev, m]));
    return () => void socket.off('message');
  }, [socket]);

  const send = () => socket.emit('message', input );
  return (
    <>
    <input value={input} onChange={handleInput} />
      <button onClick={send}>Send</button>
  
     { console.log("msg : " , msgs )}
      <ul>{msgs.map((m,i)=><li key={i}> {m.id } : {m.user} : {m.content} </li>)}</ul>
    </>
  );
}
