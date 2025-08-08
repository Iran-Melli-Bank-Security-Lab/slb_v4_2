import React from 'react';

const TicketParticipants = React.memo(({ participants, canInviteParticipants, getUserById, onRemove }) => {
  if (!participants || participants.length === 0) {
    return <p className="text-gray-500 text-center py-4">هنوز مشارکت‌کننده‌ای اضافه نشده است</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {participants.map((p) => {
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
              <p className="font-medium text-sm">{participantInfo.name}</p>
              <p className="text-xs text-gray-500">{participantInfo.role}</p>
            </div>
            {canInviteParticipants && (
              <button
                className="text-red-500 hover:text-red-700 mr-2"
                onClick={() => onRemove(participantInfo)}
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default TicketParticipants;