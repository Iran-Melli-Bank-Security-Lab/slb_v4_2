import React from 'react';
import { useNavigate } from 'react-router';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const TicketList = () => {
  const navigate = useNavigate();

  // Sample ticket data
  const tickets = [
    {
      _id: 't1',
      ticketNumber: 'TKT-1001',
      title: 'مشکل ورود به سیستم در نسخه موبایل',
      status: 'in-progress',
      priority: 'high',
      createdAt: '۱۴۰۲/۰۵/۱۵',
      updatedAt: '۱۴۰۲/۰۵/۱۶',
      reporter: { _id: 'u1', name: 'علی احمدی', avatar: 'https://i.pravatar.cc/150?img=5' },
      assignedTo: { _id: 'u3', name: 'توسعه دهنده موبایل', avatar: 'https://i.pravatar.cc/150?img=7' }
    },
    {
      _id: 't2',
      ticketNumber: 'TKT-1002',
      title: 'بهبود رابط کاربری صفحه داشبورد',
      status: 'pending',
      priority: 'medium',
      createdAt: '۱۴۰۲/۰۵/۱۰',
      updatedAt: '۱۴۰۲/۰۵/۱۲',
      reporter: { _id: 'u4', name: 'مریم نظری', avatar: 'https://i.pravatar.cc/150?img=11' },
      assignedTo: null
    },
    {
      _id: 't3',
      ticketNumber: 'TKT-1003',
      title: 'خطای ۵۰۴ در API پرداخت',
      status: 'closed',
      priority: 'urgent',
      createdAt: '۱۴۰۲/۰۵/۰۵',
      updatedAt: '۱۴۰۲/۰۵/۰۸',
      reporter: { _id: 'u5', name: 'حسن میرزایی', avatar: 'https://i.pravatar.cc/150?img=12' },
      assignedTo: { _id: 'u6', name: 'سارا محمدی', avatar: 'https://i.pravatar.cc/150?img=13' }
    },
    {
      _id: 't4',
      ticketNumber: 'TKT-1004',
      title: 'اضافه کردن قابلیت جستجوی پیشرفته',
      status: 'in-progress',
      priority: 'low',
      createdAt: '۱۴۰۲/۰۵/۰۱',
      updatedAt: '۱۴۰۲/۰۵/۰۳',
      reporter: { _id: 'u7', name: 'رضا کریمی', avatar: 'https://i.pravatar.cc/150?img=14' },
      assignedTo: { _id: 'u2', name: 'مدیر پروژه', avatar: 'https://i.pravatar.cc/150?img=9' }
    }
  ];

  // Status translation
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'در انتظار';
      case 'in-progress': return 'در حال بررسی';
      case 'closed': return 'بسته شده';
      default: return status;
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Priority dot colors
  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'urgent': return 'text-red-700';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  // Priority text
  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'بالا';
      case 'urgent': return 'فوری';
      case 'medium': return 'متوسط';
      case 'low': return 'پایین';
      default: return priority;
    }
  };

  // View ticket handler
  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">مدیریت تیکت‌ها</h1>
            <p className="text-gray-500 mt-1">لیست تمام تیکت‌های سیستم</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="جستجوی تیکت..."
                className="block w-full pr-3 pl-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
              <AddIcon className="ml-2" />
              تیکت جدید
            </button>
          </div>
        </div>

        {/* Tickets card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">لیست تیکت‌ها</h2>
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-sm text-gray-500">4 تیکت</span>
                <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-sm">
                  فعال
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
                    افراد
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
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{ticket.ticketNumber}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm font-semibold text-gray-900 truncate">{ticket.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiberManualRecordIcon className={`mr-2 ${getPriorityDot(ticket.priority)}`} style={{ fontSize: 10 }} />
                        <span className="text-sm text-gray-700">
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        <img 
                          className="w-8 h-8 rounded-full border-2 border-white" 
                          src={ticket.reporter.avatar} 
                          alt={ticket.reporter.name} 
                          title={ticket.reporter.name}
                        />
                        {ticket.assignedTo && (
                          <img 
                            className="w-8 h-8 rounded-full border-2 border-white" 
                            src={ticket.assignedTo.avatar} 
                            alt={ticket.assignedTo.name} 
                            title={ticket.assignedTo.name}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div>آخرین بروزرسانی</div>
                        <div className="font-medium">{ticket.updatedAt}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewTicket(ticket._id)}
                        className="text-blue-600 hover:text-blue-900 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition"
                      >
                        مشاهده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-700">
                نمایش <span className="font-medium">1</span> تا <span className="font-medium">4</span> از{' '}
                <span className="font-medium">4</span> تیکت
              </p>
            </div>
            
            <nav className="flex items-center space-x-3 space-x-reverse">
              <button className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              
              <button className="px-3 py-1 rounded-md border border-blue-500 bg-blue-50 text-blue-600 font-medium">
                1
              </button>
              
              <button className="px-3 py-1 rounded-md border border-transparent text-gray-500 hover:bg-gray-100">
                2
              </button>
              
              <button className="px-3 py-1 rounded-md border border-transparent text-gray-500 hover:bg-gray-100">
                3
              </button>
              
              <button className="p-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketList;