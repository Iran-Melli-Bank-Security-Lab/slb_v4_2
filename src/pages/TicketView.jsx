import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getUsers } from "../api/users/getUsers";
import { useParams } from "react-router";
import { getTicket } from "../api/ticket/getTicket";
import { useUserId } from "../hooks/useUserId";
import { useSession } from "../SessionContext";
import { postComment } from "../api/ticket/postComment";
import { getComments } from "../api/ticket/getComments";
import { useSocket } from "../context/SocketContext";
import PersianDateWithTooltip from "../components/dateTime/PersainDate";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const TicketView = () => {
  const { ticketId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [ticket, setTicket] = useState([]);
  // const [currentUser , setCurrentUser ] = useState({})
  const [comments, setComments] = useState([]);
  const userId = useUserId();
  const { user } = useSession().session;

  const [commentText, setCommentText] = useState("");
  const [commentFiles, setCommentFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("comments");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const socket = useSocket();

  const currentUser = useMemo(
    () => ({
      _id: userId,
      name: user.firstName + " " + user.lastName,
      avatar: BASE_URL + "/" + user.image,
    }),
    [userId, user]
  );

 const userMap = useMemo(() => {
  const map = new Map();
  allUsers?.forEach(user => map.set(user._id, user));
  return map;
}, [allUsers]);

const getUserById = useCallback((userId) => {
  const user = userMap.get(userId);
  if (!user) return {
    _id: userId,
    name: "کاربر ناشناس",
    avatar: "https://i.pravatar.cc/150?img=0",
    role: "نقش نامشخص",
  };

  return {
    ...user,
    avatar: user.profileImageUrl
      ? `${BASE_URL}/${user.profileImageUrl}`
      : "https://i.pravatar.cc/150?img=0",
  };
}, [userMap]);


  const getNotificationRecipients = () => {
    const recipients = new Set();

    // اضافه کردن گزارش‌دهنده (reporter)
    if (ticket.reporter) recipients.add(ticket.reporter);

    // اضافه کردن کاربر هدف (targetUser)
    if (ticket.targetUser) recipients.add(ticket.targetUser);

    // اضافه کردن کاربران اختصاص داده شده (assignedTo)
    if (ticket.assignedTo) recipients.add(ticket.assignedTo);

    // اضافه کردن مشارکت‌کنندگان
    ticket.participants?.forEach((p) => recipients.add(p.user));

    // حذف کاربر فعلی از لیست (چون خودش کامنت را ارسال کرده)
    recipients.delete(currentUser._id);

    return Array.from(recipients);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const formData = new FormData();
    formData.append("uploadContext", "comments");
    formData.append("ticketId", ticket.ticketId);
    formData.append("text", commentText);
    formData.append("ticket", ticket._id);
    formData.append("user", currentUser._id);
    commentFiles.forEach((file) => formData.append("comments", file));

    try {
      const newComment = await postComment(formData);

      socket.emit("newComment", {
        comment: newComment,
        ticket: ticket._id,
        ticketId: ticket.ticketId,
        recipients: getNotificationRecipients(),
      });

      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      setCommentFiles([]);
    } catch (error) {
      console.error("خطا در ارسال کامنت:", error);
    }
  };

  const handleToggleStatus = (action) => {
    alert(action === "close" ? "تیکت بسته شد" : "تیکت باز شد مجدد");
  };

  const isUserParticipant =
    ticket?.reporter === currentUser._id ||
    ticket?.targetUser === currentUser._id ||
    ticket?.assignedTo === currentUser._id ||
    ticket?.participants?.some((p) => p.user === currentUser._id);

  const canInviteParticipants =
    currentUser._id === ticket?.reporter ||
    currentUser._id === ticket?.targetUser;

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎬";
      case "document":
      default:
        return "📄";
    }
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;
    alert(`کاربران دعوت شدند: ${selectedUsers.map((u) => u.name).join(", ")}`);
    setSelectedUsers([]);
    setSearchTerm("");
    setShowInviteForm(false);
  };

  const toggleUserSelection = (user) => {
    console.log("re-render ######################################## ")
    setSelectedUsers((prev) => {
      const isSelected = prev?.some((u) => u._id === user._id);
      if (isSelected) {
        return prev?.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  // const filteredUsers = allUsers?.filter(
  //   (user) =>
  //     user._id !== currentUser._id &&
  //     user._id !== ticket?.reporter &&
  //     user._id !== ticket?.targetUser &&
  //     user._id !== ticket?.assignedTo &&
  //     !ticket?.participants?.some((p) => String(p.user) === String(user._id)) &&
  //     (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       user.role?.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  // Get reporter info
  // const reporterInfo = getUserById(ticket?.reporter);

  const filteredUsers = useMemo(
    () =>
      allUsers?.filter(
        (user) =>
          user._id !== currentUser._id &&
          user._id !== ticket?.reporter &&
          user._id !== ticket?.targetUser &&
          user._id !== ticket?.assignedTo &&
          !ticket?.participants?.some(
            (p) => String(p.user) === String(user._id)
          ) &&
          (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [ticket, allUsers, searchTerm, currentUser._id]
  );

  const reporterInfo = useMemo(
    () => getUserById(ticket?.reporter),
    [ticket?.reporter, allUsers]
  );

  // Get target user info
  // const targetUserInfo = getUserById(ticket?.targetUser);
  const targetUserInfo = useMemo(
    () => getUserById(ticket?.targetUser),
    [ticket?.targetUser, allUsers]
  );

  // Get assigned user info
  // const assignedToInfo = ticket?.assignedTo
  //   ? getUserById(ticket?.assignedTo)
  //   : null;

  const assignedToInfo = useMemo(
    () => (ticket?.assignedTo ? getUserById(ticket?.assignedTo) : null),
    [ticket?.assignedTo, allUsers]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();

      setAllUsers(result?.users);
    };
    const fetchTicket = async () => {
      const result = await getTicket(ticketId);
      setTicket(result);
    };
    const fetchComments = async () => {
      const result = await getComments(ticketId);

      setComments(result.comments);
    };
    fetchUsers();
    fetchTicket();
    fetchComments();
  }, [ticketId]);

  useEffect(() => {
    if (!socket) return;

    // Join ticket room when component mounts

    const handleNewComment = (newComment) => {
      setComments((prev) => {
        // Check if comment already exists to prevent duplicates
        if (!prev.some((c) => c._id === newComment._id)) {
          return [...prev, newComment];
        }
        return prev;
      });
    };

    socket.on("newComment", handleNewComment);

    return () => {
      // Clean up listener and leave room when component unmounts
      socket.off("newComment", handleNewComment);
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("ticket:join", { ticketId });

    return () => {
      socket.emit("ticket:leave", { ticketId });
    };
  }, [ticketId]);

  return (
    <div
      dir="rtl"
      className="max-w-[900px] mx-50 p-4 md:p-6 bg-white rounded-xl shadow-lg space-y-6"
    >
      {/* Ticket Header */}
      <div className="border-b pb-4 border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {ticket?.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                ایجاد شده در:{" "}
                <PersianDateWithTooltip
                  date={ticket.createdAt}
                  shortFormat="jD jMMMM jYYYY ساعت HH:mm"
                />
              </span>
              {/* <span>•</span>
              <span>آخرین بروزرسانی:<PersianDateWithTooltip date={ticket.updatedAt} /> </span> */}
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              ticket.status === "in-progress"
                ? "bg-yellow-100 text-yellow-800"
                : ticket.status === "closed"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {ticket.status === "in-progress"
              ? "در حال بررسی"
              : ticket.status === "closed"
                ? "بسته شده"
                : ticket.status}
          </div>
        </div>
      </div>

      {/* Ticket Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              توضیحات
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {ticket.description}
            </p>
          </div>

          {/* Attachments */}
          {ticket.attachments?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                پیوست‌ها
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {ticket.attachments.map((file, i) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center p-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <span className="text-xl mr-2">
                      {getFileIcon(file.type)}
                    </span>
                    <span className="text-sm truncate text-right">
                      {file.filename}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Related People */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                افراد مرتبط
              </h3>
              {canInviteParticipants && (
                <button
                  onClick={() => setShowInviteForm(!showInviteForm)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showInviteForm ? "انصراف" : "+ دعوت همکار"}
                </button>
              )}
            </div>

            {showInviteForm && (
              <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200">
                <form onSubmit={handleInviteSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="جستجوی کاربران..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto mb-3 space-y-2">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className={`flex items-center p-2 rounded-lg cursor-pointer ${selectedUsers?.some((u) => u._id === user._id) ? "bg-blue-50" : "hover:bg-gray-100"}`}
                          onClick={() => toggleUserSelection(user)}
                        >
                          <img
                            src={BASE_URL + "/" + user.profileImageUrl}
                            alt={user.firstName}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {user.firstName}
                            </p>
                            {/* <p className="text-xs text-gray-500">{user.role}</p> */}
                          </div>
                          {selectedUsers?.some((u) => u._id === user._id) && (
                            <span className="text-blue-500">✓</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-2">
                        کاربری یافت نشد
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={selectedUsers.length === 0}
                      className={`px-4 py-2 rounded-lg text-sm ${selectedUsers.length > 0 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                      ارسال دعوت ({selectedUsers.length})
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={BASE_URL + "/" + reporterInfo.profileImageUrl}
                  alt={reporterInfo.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-right">{reporterInfo.name}</p>
                  <p className="text-sm text-gray-500 text-right">
                    گزارش دهنده
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src={BASE_URL + "/" + targetUserInfo.profileImageUrl}
                  alt={targetUserInfo.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-right">
                    {targetUserInfo.name}
                  </p>
                  <p className="text-sm text-gray-500 text-right">
                    ارجاع شده به
                  </p>
                </div>
              </div>
              {assignedToInfo && (
                <div className="flex items-center">
                  <img
                    src={assignedToInfo.avatar}
                    alt={assignedToInfo.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-right">
                      {assignedToInfo.name}
                    </p>
                    <p className="text-sm text-gray-500 text-right">
                      تکلیف شده به
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              جزئیات تیکت
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">پلتفرم</p>
                <p className="font-medium">
                  {ticket.platform === "mobile"
                    ? "موبایل"
                    : ticket.platform === "web"
                      ? "وب"
                      : "دسکتاپ"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">دسته‌بندی</p>
                <p className="font-medium">
                  {ticket.category === "security" ? "امنیتی" : "کیفیت"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">نوع</p>
                <p className="font-medium">
                  {ticket.type === "bug"
                    ? "باگ"
                    : ticket.type === "suggestion"
                      ? "پیشنهاد"
                      : ticket.type === "improvement"
                        ? "بهبود"
                        : ticket.type === "question"
                          ? "سوال"
                          : "تغییر تاریخ"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">اولویت</p>
                <p className="font-medium">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ml-1 ${
                      ticket.priority === "high" || ticket.priority === "urgent"
                        ? "bg-red-500"
                        : ticket.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  ></span>
                  {ticket.priority === "high"
                    ? "بالا"
                    : ticket.priority === "medium"
                      ? "متوسط"
                      : ticket.priority === "urgent"
                        ? "فوری"
                        : "پایین"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          مشارکت‌کنندگان
        </h3>
        {ticket.participants?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {ticket.participants.map((p) => {
              const participantInfo = getUserById(p.user);
              return (
                <div
                  key={p.user}
                  className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm"
                >
                  <img
                    src={participantInfo.avatar}
                    alt={participantInfo.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {participantInfo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {participantInfo.role}
                    </p>
                  </div>
                  {canInviteParticipants && (
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() =>
                        alert(`حذف ${participantInfo.name} از مشارکت‌کنندگان`)
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            هنوز مشارکت‌کننده‌ای اضافه نشده است
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "comments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            نظرات ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "activity"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            فعالیت‌ها
          </button>
        </nav>
      </div>

      {/* Comments */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {comments?.map((comment) => {
            const commentUser = getUserById(comment.user);
            const isCurrentUser = comment.user === currentUser._id;
            const isRead = comment.readBy && comment.readBy.length > 0; // فرض می‌کنیم یک فیلد readBy در کامنت وجود دارد

            return (
              <div
                key={comment._id}
                className={`flex ${isCurrentUser ? "justify-start" : "justify-end"}`} // تغییر این خط
              >
                <div
                  className={`flex max-w-2xl ${isCurrentUser ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* تصویر کاربر */}
                  <img
                    src={commentUser.avatar}
                    alt={commentUser.name}
                    className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                  />

                  {/* محتوای کامنت */}
                  <div
                    className={`pr-3 pb-2 p-4 rounded-2xl ${
                      isCurrentUser
                        ? "bg-blue-50 rounded-tl-none ml-3"
                        : "bg-gray-100 rounded-tr-none mr-3"
                    }`}
                  >
                    {/* اطلاعات کاربر و تاریخ */}
                    <div className="flex flex-col mb-2">
                      <h5 className="font-semibold">
                        {commentUser.firstName} {commentUser.lastName}{" "}
                      </h5>
                      <span className="text-xs text-gray-500">
                        <PersianDateWithTooltip date={comment.createdAt} />
                      </span>
                    </div>

                    {/* متن کامنت */}
                    <p className="text-gray-800 whitespace-pre-wrap text-right">
                      {comment.text}
                    </p>

                    {/* پیوست‌ها */}
                    {comment.attachments?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {comment.attachments.map((file, j) => (
                          <a
                            key={j}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center p-2 bg-white rounded-lg border hover:bg-gray-50 transition"
                          >
                            <span className="text-lg mr-2">
                              {getFileIcon(file.type)}
                            </span>
                            <span className="text-sm truncate">
                              {file.filename}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}

                    {/* تیک‌های وضعیت */}
                    {isCurrentUser && (
                      <div className="pb-0 text-xs flex items-center">
                        {isRead ? (
                          <FaCheckDouble
                            className="text-blue-500 ml-1"
                            size={12}
                          />
                        ) : (
                          <FaCheck
                            className=" mt-3 mb-0 pb-0  text-gray-400 ml-1"
                            size={12}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Comment Form */}
          {isUserParticipant && (
            <form
              onSubmit={handleCommentSubmit}
              className="bg-gray-50 p-4 rounded-xl space-y-3 max-w-4xl mx-auto"
            >
              <div className="flex items-start">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="نظر خود را بنویسید..."
                    rows="3"
                    className="min-w-full w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <span className="mr-2">افزودن فایل</span>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setCommentFiles(Array.from(e.target.files))
                      }
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </label>
                  {commentFiles.length > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      {commentFiles.length} فایل انتخاب شده
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    commentText.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ارسال نظر
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Activity Log */}
      {activeTab === "activity" && (
        <div className="space-y-4">
          {ticket.statusHistory?.map((activity, index) => {
            const activityUser = getUserById(activity.changedBy);
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg text-right">
                <p className="text-gray-800">
                  وضعیت از{" "}
                  <span className="font-semibold">
                    {activity.status === "pending"
                      ? "جدید"
                      : activity.status === "in-progress"
                        ? "در حال بررسی"
                        : activity.status === "closed"
                          ? "بسته شده"
                          : activity.status}
                  </span>{" "}
                  توسط{" "}
                  <span className="font-semibold">{activityUser.name}</span>
                </p>
                {activity.comment && (
                  <p className="text-gray-600 mt-1">{activity.comment}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Controls */}
      {currentUser._id === ticket?.targetUser && (
        <div className="flex justify-start gap-3">
          <button
            onClick={() =>
              handleToggleStatus(
                ticket.status === "closed" ? "reopen" : "close"
              )
            }
            className={`px-6 py-2 rounded-lg font-medium transition ${
              ticket.status === "closed"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {ticket.status === "closed" ? "باز کردن تیکت" : "بستن تیکت"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketView;
