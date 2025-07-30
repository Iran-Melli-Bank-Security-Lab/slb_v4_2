import React, { useState } from 'react';

const Tickets = ({ users, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'bug',
    priority: 'medium',
    targetUser: '',
    attachments: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, attachments: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // گزینه‌های رادیو باتن‌ها
  const typeOptions = [
    { value: 'bug', label: 'باگ', icon: '🐞' },
    { value: 'suggestion', label: 'پیشنهاد', icon: '💡' },
    { value: 'improvement', label: 'بهبود', icon: '🔧' },
    { value: 'question', label: 'سوال', icon: '❓' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'کم', icon: '🐢', color: 'text-green-500' },
    { value: 'medium', label: 'متوسط', icon: '🚶‍♂️', color: 'text-yellow-500' },
    { value: 'high', label: 'زیاد', icon: '🏃‍♂️', color: 'text-orange-500' },
    { value: 'urgent', label: 'فوری', icon: '🚨', color: 'text-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            سیستم پشتیبانی تیکت
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            فرم زیر را برای ثبت درخواست پشتیبانی تکمیل کنید
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">ثبت تیکت جدید</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* عنوان تیکت */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                عنوان تیکت <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="مثال: مشکل در لاگین کاربران"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            {/* توضیحات */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                توضیحات کامل
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="شرح دقیق مشکل یا درخواست خود را بنویسید..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              ></textarea>
            </div>

            {/* نوع تیکت - رادیو باتن */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                نوع تیکت
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {typeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.type === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={formData.type === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xl ml-2">{option.icon}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* اولویت - رادیو باتن */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                اولویت
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.priority === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={formData.priority === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`text-xl ml-2 ${option.color}`}>{option.icon}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ارسال به (دراپ‌داون باقی می‌ماند) */}
            <div className="space-y-2">
              <label htmlFor="targetUser" className="block text-sm font-medium text-gray-700">
                ارسال به <span className="text-red-500">*</span>
              </label>
              <select
                id="targetUser"
                name="targetUser"
                value={formData.targetUser}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              >
                <option value="">انتخاب کاربر</option>
                {users?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            {/* آپلود فایل */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                فایل‌های پیوست
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>آپلود فایل</span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pr-1">یا کشیدن و رها کردن</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF تا 10MB</p>
                </div>
              </div>
            </div>

            {/* دکمه ارسال */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                ارسال تیکت
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tickets;