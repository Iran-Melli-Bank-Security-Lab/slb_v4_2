import React from 'react';
import PersianDateWithTooltip from '../dateTime/PersainDate';

const TicketHeader = React.memo(({ ticket }) => {
  return (
    <div className="border-b pb-4 border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {ticket?.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              ایجاد شده در: 
              <PersianDateWithTooltip
                date={ticket.createdAt}
                shortFormat="jD jMMMM jYYYY ساعت HH:mm"
              />
            </span>
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
  );
});

export default TicketHeader;