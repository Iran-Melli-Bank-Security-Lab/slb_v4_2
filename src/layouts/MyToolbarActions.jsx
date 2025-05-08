import { ToolbarActions } from "@toolpad/core/DashboardLayout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  Button,
  Fade,
  Slide,
} from "@mui/material";
import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Close as CloseIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  ArrowForward as LinkIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "../SessionContext";
import { userNotif } from "../api/notif/userNotif";
import { setSeenNotif } from "../api/notif/setSeenNotif";
const MyToolbarActions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  const { user } = useSession().session;
  // Calculate unread count based on notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    async function getNotif() {
      try {
        const notifs = await userNotif(user.id);
        console.log("Notifs : ", notifs.notifications);

        const formattedNotifs = notifs.notifications.map((n) => ({
          ...n,
          id: n._id,
          timestamp: new Date(n.createdAt || Date.now()),
        }));

        setNotifications(formattedNotifs);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    }

    getNotif();
  }, []);

  useEffect(() => {
    if (!socket) {
      console.log("socket is null");
      return;
    }

    socket.on("notification:new", (notif) => {
      const newNotification = {
        ...notif,
        id: notif._id,
        read: false,
        timestamp: new Date(notif.createdAt || Date.now()),
      };

      setNotifications((prev) => [newNotification, ...prev]);

      toast.info(
        <div
          className="cursor-pointer"
          onClick={() => notif.link && (window.location.href = notif.link)}
        >
          <Typography variant="subtitle2" className="font-semibold">
            {notif.title || "New Notification"}
          </Typography>
          <Typography variant="body2">{notif.message}</Typography>
        </div>,
        {
          autoClose: 5000,
          closeOnClick: false,
          className: "cursor-pointer",
        }
      );
    });

    socket.on("notification:removed", ({ notificationId }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:removed");
    };
  }, [socket]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read when clicked

    console.log("notfications click : " , notification)

     setSeenNotif(notification._id); 

    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    if (notification.link) {
      window.location.href = notification.link;
    }
    handleClose();
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const open = Boolean(anchorEl);

  return (
    <div className="flex gap-2 items-center">
      <ToolbarActions />
      <IconButton
        size="large"
        color="inherit"
        onClick={handleOpen}
        aria-controls={open ? "notification-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        className="relative hover:bg-blue-50 transition-colors"
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          overlap="circular"
          invisible={unreadCount === 0}
          className={unreadCount > 0 ? "animate-pulse" : ""}
        >
          <NotificationsIcon className="text-gray-600 hover:text-blue-600" />
        </Badge>
      </IconButton>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slots={{
          transition: Fade,
        }}
        slotProps={{
          list: {
            className: "p-0",
          },
          paper: {
            className: "w-96 max-h-[calc(100vh-100px)] shadow-xl rounded-lg",
          },
        }}
      >
        <Box className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <Typography variant="h6" className="font-bold text-gray-800">
            {/* Notifications {unreadCount > 0 && `(${unreadCount} new)`} */}
            Notifications
          </Typography>
          <div className="flex gap-2">
            <Button
              size="small"
              onClick={markAllAsRead}
              disabled={notifications.length === 0 || unreadCount === 0}
              className="text-xs"
            >
              Mark all read
            </Button>
            <Button
              size="small"
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="text-xs text-red-500"
            >
              Clear all
            </Button>
          </div>
        </Box>

        {notifications.length === 0 ? (
          <Box className="p-6 text-center">
            <NotificationsIcon className="text-gray-300 text-4xl mb-2" />
            <Typography variant="body2" className="text-gray-500">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box className="overflow-y-auto max-h-96">
            {notifications.map((notif) => (
              <Slide
                key={notif._id}
                direction="right"
                in
                mountOnEnter
                unmountOnExit
              >
                <MenuItem
                  onClick={() => handleNotificationClick(notif)}
                  className={`py-3 px-4 hover:bg-blue-50 transition-colors ${!notif.read ? "bg-blue-50" : ""}`}
                >
                  <ListItemIcon className="min-w-0 mr-3">
                    {notif.read ? (
                      <ReadIcon className="text-gray-400 text-sm" />
                    ) : (
                      <UnreadIcon className="text-blue-500 text-xs" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="flex justify-between items-start">
                        <Typography
                          variant="subtitle2"
                          className={`font-medium ${!notif.read ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {notif.title || "New Notification"}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="text-gray-400 whitespace-nowrap ml-2"
                        >
                          {formatDistanceToNow(notif.timestamp, {
                            addSuffix: true,
                          })}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          className={`${!notif.read ? "text-gray-700" : "text-gray-500"}`}
                        >
                          {notif.message}
                        </Typography>
                        {notif.link && (
                          <Box className="mt-1 flex items-center text-blue-500">
                            <LinkIcon className="text-xs mr-1" />
                            <Typography
                              variant="caption"
                              className="font-medium"
                            >
                              View details
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                    disableTypography
                  />
                </MenuItem>
              </Slide>
            ))}
          </Box>
        )}

        {notifications.length > 0 && (
          <Box className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 text-center">
            <Button
              size="small"
              onClick={handleClose}
              className="text-blue-600"
            >
              Close
            </Button>
          </Box>
        )}
      </Menu>
    </div>
  );
};

export default MyToolbarActions;
