import React from 'react';

const TicketDetails = React.memo(({ ticket }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">جزئیات تیکت</h3>
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
  );
});

export default TicketDetails;