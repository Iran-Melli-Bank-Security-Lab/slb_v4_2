import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

export default function NotificationBar() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('notification:new', (notif) => {
      setNotifications(prev => [notif, ...prev]);

      toast.info(`${notif.title}: ${notif.message}`, {
        onClick: () => window.location.href = notif.link
      });
    });

    return () => socket.off('notification:new');
  }, [socket]);

  return (
    <div className="notification-list">
      {notifications.map(n => (
        <div key={n._id} className="notif-item">
          <span>{n.icon}</span>
          <div>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
