import React from 'react';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import PersianDateWithTooltip from '../dateTime/PersainDate';

const CommentList = React.memo(({ comments, currentUser, getUserById, getFileIcon }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const commentUser = getUserById(comment.user);
        const isCurrentUser = comment.user === currentUser._id;
        const isRead = comment.readBy && comment.readBy.length > 0;

        return (
          <div key={comment._id} className={`flex ${isCurrentUser ? "justify-start" : "justify-end"}`}>
            <div className={`flex max-w-2xl ${isCurrentUser ? "flex-row" : "flex-row-reverse"}`}>
              <img
                src={commentUser.avatar}
                alt={commentUser.name}
                className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
              />
              <div className={`pr-3 pb-2 p-4 rounded-2xl ${
                isCurrentUser ? "bg-blue-50 rounded-tl-none ml-3" : "bg-gray-100 rounded-tr-none mr-3"
              }`}>
                <div className="flex flex-col mb-2">
                  <h5 className="font-semibold">
                    {commentUser.firstName} {commentUser.lastName}
                  </h5>
                  <span className="text-xs text-gray-500">
                    <PersianDateWithTooltip date={comment.createdAt} />
                  </span>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap text-right">{comment.text}</p>
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
                        <span className="text-lg mr-2">{getFileIcon(file.type)}</span>
                        <span className="text-sm truncate">{file.filename}</span>
                      </a>
                    ))}
                  </div>
                )}
                {isCurrentUser && (
                  <div className="pb-0 text-xs flex items-center">
                    {isRead ? (
                      <FaCheckDouble className="text-blue-500 ml-1" size={12} />
                    ) : (
                      <FaCheck className="mt-3 mb-0 pb-0 text-gray-400 ml-1" size={12} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default CommentList;