import React from 'react';

const CommentForm = React.memo(({ currentUser, commentText, setCommentText, commentFiles, setCommentFiles, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 p-4 rounded-xl space-y-3 max-w-4xl mx-auto">
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
              onChange={(e) => setCommentFiles(Array.from(e.target.files))}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
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
  );
});

export default CommentForm;