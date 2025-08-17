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
import {
  FaCheck,
  FaCheckDouble,
  FaPaperclip,
  FaUserPlus,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { updateStatus } from "../api/ticket/updateStatus";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const TicketView = () => {
  const { ticketId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [ticket, setTicket] = useState([]);
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
    allUsers?.forEach((user) => map.set(user._id, user));
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

    // Extract role name
    let roleName = "کاربر";
    if (user.roles) {
      if (user.roles.Admin === 5150) {
        roleName = "مدیر";
      } else if (user.roles.User === 2001) {
        roleName = "نفوذگر"; // Pentester
      }
      // Add more role checks if needed
    }

    return {
      ...user,
      firstName: user.firstName || "کاربر",
      lastName: user.lastName || "",
      avatar: user.profileImageUrl
        ? `${BASE_URL}/${user.profileImageUrl}`
        : "https://i.pravatar.cc/150?img=0",
      role: roleName,
    };
  }, [userMap]);

  const getNotificationRecipients = () => {
    const recipients = new Set();
    if (ticket.reporter) recipients.add(ticket.reporter);
    if (ticket.targetUser) recipients.add(ticket.targetUser);
    if (ticket.assignedTo) recipients.add(ticket.assignedTo);
    ticket.participants?.forEach((p) => recipients.add(p.user));
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
    setSelectedUsers((prev) => {
      const isSelected = prev?.some((u) => u._id === user._id);
      if (isSelected) {
        return prev?.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

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
  const targetUserInfo = useMemo(
    () => getUserById(ticket?.targetUser),
    [ticket?.targetUser, allUsers]
  );
  const assignedToInfo = useMemo(
    () => (ticket?.assignedTo ? getUserById(ticket?.assignedTo) : null),
    [ticket?.assignedTo, allUsers]
  );

  useEffect(() => {
    const changeToInProgress = async () => {
      try {
        await updateStatus(userId, ticketId, "pending")
      } catch (error) {

        console.log("error : ", error.message)
      }
    }
    const fetchUsers = async () => {
      const result = await getUsers();
      setAllUsers(result?.users);
    };

    const fetchTicket = async () => {
      const result = await getTicket(ticketId);
      console.log("result in line 226 : ", result)
      setTicket(result);

      if (result.status === "pending") {

        const res = await changeToInProgress()
        console.log("res line 229 : ", res)
      }


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

    const handleNewComment = (newComment) => {
      setComments((prev) => {
        if (!prev.some((c) => c._id === newComment._id)) {
          return [...prev, newComment];
        }
        return prev;
      });
    };

    socket.on("newComment", handleNewComment);

    return () => {
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
    <div dir="rtl" className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span className="hover:text-blue-600 cursor-pointer">تیکت‌ها</span>
        <IoIosArrowForward className="mx-2 text-gray-400" />
        <span className="text-gray-700 font-medium">
          مشاهده تیکت #{ticketId}
        </span>
      </div>

      {/* Main ticket card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Ticket Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${ticket.status === "in-progress"
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

        {/* Ticket Content */}
        <div className="p-6">
          {/* Ticket Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Description and Attachments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                  توضیحات تیکت
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              {/* Attachments */}
              {ticket.attachments?.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                    پیوست‌ها ({ticket.attachments.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ticket.attachments.map((file, i) => (
                      <a
                        key={i}
                        href={`${BASE_URL}` + "/" + file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center p-3 border rounded-lg hover:bg-white transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-2">
                          <span className="text-2xl">
                            {getFileIcon(file.type)}
                          </span>
                        </div>
                        <span className="text-xs text-center text-gray-700 truncate w-full">
                          {file.filename}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Ticket Details */}
            <div className="space-y-6">
              {/* Related People */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    افراد مرتبط
                  </h3>
                  {canInviteParticipants && (
                    <button
                      onClick={() => setShowInviteForm(!showInviteForm)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showInviteForm ? (
                        <>
                          <FaTimes size={12} /> انصراف
                        </>
                      ) : (
                        <>
                          <FaUserPlus size={12} /> دعوت همکار
                        </>
                      )}
                    </button>
                  )}
                </div>

                {showInviteForm && (
                  <div className="mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <form onSubmit={handleInviteSubmit}>
                      <div className="mb-3 relative">
                        <input
                          type="text"
                          placeholder="جستجوی نام یا نقش کاربر..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full p-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <FaChevronDown
                          className="absolute left-3 top-3 text-gray-400"
                          size={14}
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto mb-3 space-y-2 border border-gray-200 rounded-lg">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div
                              key={user._id}
                              className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${selectedUsers?.some((u) => u._id === user._id)
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                                }`}
                              onClick={() => toggleUserSelection(user)}
                            >
                              <img
                                src={BASE_URL + "/" + user.profileImageUrl}
                                alt={user.firstName}
                                className="w-8 h-8 rounded-full mr-2 object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.role}
                                </p>
                              </div>
                              {selectedUsers?.some(
                                (u) => u._id === user._id
                              ) && (
                                  <span className="text-blue-500">
                                    <FaCheck size={14} />
                                  </span>
                                )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-4 text-sm">
                            کاربری با این مشخصات یافت نشد
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={selectedUsers.length === 0}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${selectedUsers.length > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        ارسال دعوت ({selectedUsers.length})
                      </button>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Reporter */}
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <img
                      src={reporterInfo.avatar}
                      alt={reporterInfo.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {reporterInfo.firstName} {reporterInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-500">گزارش دهنده</p>
                    </div>
                  </div>

                  {/* Target User */}
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                    <img
                      src={targetUserInfo.avatar}
                      alt={targetUserInfo.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-purple-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {targetUserInfo.firstName} {targetUserInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-500">ارجاع شده به</p>
                    </div>
                  </div>

                  {/* Assigned To */}
                  {assignedToInfo && (
                    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                      <img
                        src={assignedToInfo.avatar}
                        alt={assignedToInfo.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-green-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {assignedToInfo.firstName} {assignedToInfo.lastName}
                        </p>
                        <p className="text-xs text-gray-500">تکلیف شده به</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Details */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                  جزئیات تیکت
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">پلتفرم</p>
                    <p className="font-medium text-sm">
                      {ticket.platform === "mobile"
                        ? "موبایل"
                        : ticket.platform === "web"
                          ? "وب"
                          : "دسکتاپ"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">دسته‌بندی</p>
                    <p className="font-medium text-sm">
                      {ticket.category === "security" ? "امنیتی" : "کیفیت"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">نوع</p>
                    <p className="font-medium text-sm">
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
                    <p className="text-xs text-gray-500 mb-1">اولویت</p>
                    <p className="font-medium text-sm flex items-center justify-end">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ml-1 ${ticket.priority === "high" ||
                          ticket.priority === "urgent"
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
          <div className="mt-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              مشارکت‌کنندگان ({ticket.participants?.length || 0})
            </h3>
            {ticket.participants?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {ticket.participants.map((p) => {
                  const participantInfo = getUserById(p.user);
                  return (
                    <div
                      key={p.user}
                      className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={participantInfo.avatar}
                        alt={participantInfo.name}
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                      <div className="text-right min-w-0">
                        <p className="font-medium text-sm truncate">
                          {participantInfo.firstName} {participantInfo.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {participantInfo.role}
                        </p>
                      </div>
                      {canInviteParticipants && (
                        <button
                          className="text-red-500 hover:text-red-700 mr-2 text-sm"
                          onClick={() =>
                            alert(
                              `حذف ${participantInfo.name} از مشارکت‌کنندگان`
                            )
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
              <p className="text-gray-500 text-center py-4 text-sm">
                هنوز مشارکت‌کننده‌ای اضافه نشده است
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab("comments")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-1 ${activeTab === "comments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                نظرات
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {comments.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === "activity"
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
            <div className="mt-4 space-y-6">
              {comments?.length > 0 ? (
                comments.map((comment) => {
                  const commentUser = getUserById(comment.user);
                  const isCurrentUser = comment.user === currentUser._id;
                  const isRead = comment.readBy && comment.readBy.length > 0;

                  return (
                    <div
                      key={comment._id}
                      className={`flex ${isCurrentUser ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`flex max-w-2xl ${isCurrentUser ? "flex-row" : "flex-row-reverse"}`}
                      >
                        <img
                          src={commentUser.avatar}
                          alt={commentUser.name}
                          className="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover border-2 border-white shadow-sm"
                        />

                        <div
                          className={`relative p-4 rounded-2xl shadow-sm ${isCurrentUser
                            ? "bg-blue-50 rounded-tl-none ml-3"
                            : "bg-gray-50 rounded-tr-none mr-3"
                            }`}
                        >
                          {/* User info and timestamp */}
                          <div className="flex flex-col mb-2">
                            <div className="flex items-center gap-4">

                              {/* تغییر این خط */}
                              <h5 className="font-semibold text-sm">
                                {commentUser.firstName} {commentUser.lastName}
                              </h5>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {" "}
                                {/* اضافه کردن whitespace-nowrap */}
                                <PersianDateWithTooltip
                                  date={comment.createdAt}
                                />
                              </span>
                            </div> {console.log("commentUser : ", commentUser)}
                            {commentUser.role && (
                              <p className="text-xs text-gray-500 ">
                                {commentUser.role}
                              </p>
                            )}
                          </div>

                          {/* Comment text */}
                          <p className="text-gray-800 whitespace-pre-wrap text-right text-sm leading-relaxed">
                            {comment.text}
                          </p>

                          {/* Attachments */}
                          {comment.attachments?.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {comment.attachments.map((file, j) => (
                                <a
                                  key={j}
                                  href={BASE_URL + "/" + file.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center p-2 bg-white rounded-lg border hover:bg-gray-50 transition text-sm"
                                >
                                  <span className="text-lg mr-2">
                                    {getFileIcon(file.type)}
                                  </span>
                                  <span className="truncate flex-1">
                                    {file.filename}
                                  </span>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Read status */}
                          {isCurrentUser && (
                            <div className="absolute left-3 bottom-2 text-xs">
                              {isRead ? (
                                <FaCheckDouble
                                  className="text-blue-500"
                                  size={12}
                                />
                              ) : (
                                <FaCheck className="text-gray-400" size={12} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>هنوز نظری ثبت نشده است</p>
                </div>
              )}

              {/* Comment Form */}
              {isUserParticipant && (
                <form
                  onSubmit={handleCommentSubmit}
                  className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="نظر خود را بنویسید..."
                        rows="3"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm placeholder-gray-400"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 text-sm">
                        <FaPaperclip className="ml-1 text-gray-500" size={14} />
                        <span>افزودن فایل</span>
                        <input
                          type="file"
                          multiple
                          onChange={(e) =>
                            setCommentFiles(Array.from(e.target.files))
                          }
                          className="hidden"
                        />
                      </label>
                      {commentFiles.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {commentFiles.length} فایل انتخاب شده
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className={`px-5 py-2 rounded-lg font-medium text-sm ${commentText.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
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
            <div className="mt-4 space-y-4">
              {ticket.statusHistory?.length > 0 ? (
                ticket.statusHistory.map((activity, index) => {
                  const activityUser = getUserById(activity.changedBy);
                  return (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-right"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          src={activityUser.avatar}
                          alt={activityUser.name}
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {activityUser.firstName} {activityUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            <PersianDateWithTooltip date={activity.date} />
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-800 text-sm">
                        وضعیت به{" "}
                        <span className="font-semibold">
                          {activity.status === "pending"
                            ? "جدید"
                            : activity.status === "in-progress"
                              ? "در حال بررسی"
                              : activity.status === "closed"
                                ? "بسته شده"
                                : activity.status}
                        </span>{" "}
                        تغییر یافت
                      </p>
                      {activity.comment && (
                        <p className="text-gray-600 mt-2 text-sm bg-white p-2 rounded border border-gray-100">
                          {activity.comment}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>هیچ فعالیتی ثبت نشده است</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Controls */}
        {currentUser._id === ticket?.targetUser && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-start gap-3">
              <button
                onClick={() =>
                  handleToggleStatus(
                    ticket.status === "closed" ? "reopen" : "close"
                  )
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm transition ${ticket.status === "closed"
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                  : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                  }`}
              >
                {ticket.status === "closed" ? "باز کردن تیکت" : "بستن تیکت"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketView;
