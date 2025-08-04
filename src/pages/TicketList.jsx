import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Tooltip from "@mui/material/Tooltip";
import { getTickets } from "../api/ticket/getTicket";
import { useUserId } from "../hooks/useUserId";
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const TicketList = () => {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("received"); // ['received', 'sent', 'participated', 'assigned']
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    limit: 5,
  });

  const userId = useUserId();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const result = await getTickets(
          userId,
          pagination.currentPage,
          pagination.limit
        );
        setAllTickets(result.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: result.pages,
          totalTickets: result.total,
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [pagination.currentPage, pagination.limit, userId]);

  // فیلتر کردن تیکت‌ها بر اساس تب فعال
  const getFilteredTickets = () => {
    return allTickets.filter(ticket => {
      switch(activeTab) {
        case 'sent':
          return ticket.reporter._id === userId;
        case 'received':
          return ticket.targetUser?._id === userId;
        case 'participated':
          return ticket.participants.some(p => p.user._id === userId) && 
                 ticket.reporter._id !== userId && 
                 ticket.targetUser?._id !== userId;
        case 'assigned':
          return ticket.assignedTo?._id === userId;
        default:
          return true;
      }
    });
  };

  const filteredTickets = getFilteredTickets();

  // Status translation
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "در انتظار";
      case "in-progress":
        return "در حال بررسی";
      case "closed":
        return "بسته شده";
      default:
        return status;
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Priority dot colors
  const getPriorityDot = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "urgent":
        return "text-red-700";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-emerald-500";
      default:
        return "text-gray-500";
    }
  };

  // Priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "بالا";
      case "urgent":
        return "فوری";
      case "medium":
        return "متوسط";
      case "low":
        return "پایین";
      default:
        return priority;
    }
  };

  // View ticket handler
  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/view/${ticketId}`);
  };

  // Create ticket handler
  const handleCreateTicket = () => {
    navigate("/tickets");
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  const goToPrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  const goToPage = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));
  };

  // PeopleDisplay component
  const PeopleDisplay = ({ ticket }) => {
    const allPeople = [
      { 
        user: ticket.reporter, 
        role: 'ارسال کننده',
        meta: null
      },
      ticket.targetUser && { 
        user: ticket.targetUser, 
        role: 'گیرنده',
        meta: null
      },
      ticket.assignedTo && { 
        user: ticket.assignedTo, 
        role: 'مسئول',
        meta: null
      },
      ...ticket.participants.map(p => ({
        user: p.user,
        role: p.role === 'participant' ? 'مشارکت کننده' : p.role,
        meta: `دعوت شده توسط: ${p.invitedBy?.firstName || 'سیستم'}`
      }))
    ].filter(Boolean);

    return (
      <div className="flex items-center">
        {allPeople.slice(0, 3).map((person, index) => (
          <Tooltip 
            key={index} 
            title={
              <div>
                <div>{person.role}: {person.user.firstName}</div>
                {person.meta && <div className="text-xs text-gray-400">{person.meta}</div>}
              </div>
            } 
            arrow
          >
            <img 
              className={`w-6 h-6 rounded-full border-2 border-white ${index > 0 ? '-mr-2' : ''}`}
              src={BASE_URL+"/"+person.user.profileImageUrl} 
              alt={person.user.firstName}
            />
          </Tooltip>
        ))}
        
        {allPeople.length > 3 && (
          <Tooltip 
            title={
              <div className="space-y-2">
                {allPeople.map((person, index) => (
                  <div key={index}>
                    <div className="font-medium">{person.role}: {person.user.name}</div>
                    {person.meta && (
                      <div className="text-xs text-gray-400">{person.meta}</div>
                    )}
                  </div>
                ))}
              </div>
            }
            arrow
          >
            <span className="bg-gray-100 text-xs text-gray-800 rounded-full h-6 w-6 flex items-center justify-center -mr-2 border-2 border-white">
              +{allPeople.length - 3}
            </span>
          </Tooltip>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مدیریت تیکت‌ها</h1>
            <p className="text-gray-500 mt-1">لیست تیکت‌ها بر اساس نقش شما</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCreateTicket}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <AddIcon className="ml-2" />
              تیکت جدید
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'received' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              دریافتی‌ها
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {allTickets.filter(t => t.targetUser?._id === userId).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'sent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ارسالی‌ها
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {allTickets.filter(t => t.reporter._id === userId).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('participated')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'participated' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              مشارکتی‌ها
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {allTickets.filter(t => 
                  t.participants.some(p => p.user._id === userId) && 
                  t.reporter._id !== userId && 
                  t.targetUser?._id !== userId
                ).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'assigned' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              مسئولیت‌ها
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {allTickets.filter(t => t.assignedTo?._id === userId).length}
              </span>
            </button>
          </div>
        </div>

        {/* Tickets card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === 'received' && 'تیکت‌های دریافتی'}
                {activeTab === 'sent' && 'تیکت‌های ارسالی'}
                {activeTab === 'participated' && 'تیکت‌های مشارکتی'}
                {activeTab === 'assigned' && 'تیکت‌های تحت مسئولیت'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {filteredTickets.length} تیکت
                </span>
                <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-sm">
                  {activeTab === 'received' && 'دریافتی'}
                  {activeTab === 'sent' && 'ارسالی'}
                  {activeTab === 'participated' && 'مشارکتی'}
                  {activeTab === 'assigned' && 'مسئولیت'}
                </div>
              </div>
            </div>
          </div>

          {/* Tickets table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    شماره تیکت
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اولویت
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    افراد مرتبط
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          {ticket.ticketId}
                        </div>
                      </td>
                        <td className="px-6 py-4 max-w-[200px]">
                        <Tooltip title={ticket.title} arrow>
                          <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {ticket.title}
                          </div>
                        </Tooltip>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}
                        >
                          {getStatusText(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiberManualRecordIcon
                            className={`ml-2 ${getPriorityDot(ticket.priority)}`}
                            style={{ fontSize: 10 }}
                          />
                          <span className="text-sm text-gray-700">
                            {getPriorityText(ticket.priority)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PeopleDisplay ticket={ticket} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div className="font-medium">{ticket.updatedAt}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button
                          onClick={() => handleViewTicket(ticket.ticketId)}
                          className="text-blue-600 hover:text-blue-900 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition"
                        >
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      {activeTab === 'received' && 'تیکت دریافتی وجود ندارد'}
                      {activeTab === 'sent' && 'تیکت ارسالی وجود ندارد'}
                      {activeTab === 'participated' && 'در هیچ تیکتی مشارکت ندارید'}
                      {activeTab === 'assigned' && 'مسئول هیچ تیکتی نیستید'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTickets.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-700">
                  نمایش <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.limit + 1}
                  </span> تا{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalTickets)}
                  </span> از{' '}
                  <span className="font-medium">{pagination.totalTickets}</span> تیکت
                </p>
              </div>
              
              <nav className="flex items-center gap-3">
                <button 
                  onClick={goToPrevPage}
                  disabled={pagination.currentPage === 1}
                  className={`p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 ${
                    pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-md border ${
                      pagination.currentPage === page 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:bg-gray-100'
                    } font-medium`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={goToNextPage}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 ${
                    pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketList;