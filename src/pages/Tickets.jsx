import React, { useEffect, useState } from "react";
import { getUsers } from "../api/users/getUsers";
import { useUserId } from "../hooks/useUserId";
import {
  MenuItem,
  Select,
  Avatar,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { getRoleInfo } from "../utils/getRoleInfo";
import { creatTicket } from "../api/ticket/craateTicket";
import { newTicketId } from "../api/ticket/newTicketId";
const Tickets = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "bug",
    targetUser: "",
    attachments: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [users, setUsers] = useState([]);

  const userId = useUserId();

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      console.log("result user line 21 : ", result.users);
      setUsers(result?.users);
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    try {
      const files = Array.from(e.target.files);

      // Validate file types and sizes
      const validFiles = files.filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
        ];
        const maxSize = 100 * 1024 * 1024; // 100MB

        if (!validTypes.includes(file.type)) {
          setErrors({
            ...errors,
            attachments: "فقط فایل‌های JPG, PNG, GIF یا PDF مجاز هستند",
          });
          return false;
        }

        if (file.size > maxSize) {
          setErrors({
            ...errors,
            attachments: "حجم هر فایل باید کمتر از 10MB باشد",
          });
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        setFormData({
          ...formData,
          attachments: [...formData.attachments, ...validFiles],
        });
        setErrors({ ...errors, attachments: "" });
      }
    } catch (error) {
      setErrors({ ...errors, attachments: "خطا در پردازش فایل‌ها" });
    }
  };

  const removeFile = (index) => {
    const newAttachments = [...formData.attachments];
    newAttachments.splice(index, 1);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان تیکت الزامی است";
    }

    if (!formData.targetUser) {
      newErrors.targetUser = "انتخاب کاربر دریافت کننده الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }



    setIsSubmitting(true);

    try {

        const {ticketId} = await newTicketId()
        console.log("ticket Id : " , ticketId) 

const form = new FormData();
form.append("title", formData.title);
form.append("description", formData.description);
form.append("type", formData.type);
form.append("targetUser", formData.targetUser);
form.append("reporter" , userId)
form.append("ticketId", ticketId);
form.append("uploadContext", "attachments");

formData.attachments.forEach(file => {
  form.append("attachments", file); // must match multer field name
});



await creatTicket(form);
      // Reset form on successful submission
      setFormData({
        title: "",
        description: "",
        type: "bug",
        targetUser: "",
        attachments: [],
      });
    } catch (error) {
      setSubmitError("خطا در ارسال تیکت. لطفا دوباره تلاش کنید.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

 const typeOptions = [
  { value: "bug", label: "باگ", icon: "🐞" },
  { value: "suggestion", label: "پیشنهاد", icon: "💡" },
  { value: "improvement", label: "بهبود", icon: "🔧" },
  { value: "question", label: "سوال", icon: "❓" },
  { value: "changeDate", label: "تغییر زمان کاری", icon: "📅" },
  { value: "request", label: "درخواست", icon: "📩" },
  { value: "project", label: "مربوط به پروژه", icon: "📁" },
  { value: "problem", label: "مشکل فنی", icon: "🛠️" }
];

  // Function to display file size in readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            ایجاد تیکت جدید
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            لطفا فرم زیر را برای ثبت درخواست تکمیل کنید
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error message for form submission */}
            {submitError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {submitError}
              </div>
            )}

            {/* عنوان تیکت */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                عنوان تیکت <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="مشکل در سیستم لاگین"
                className={`w-full px-3 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400`}
                dir="rtl"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* توضیحات */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                توضیحات
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="شرح کامل مشکل یا درخواست خود را بنویسید..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                dir="rtl"
              ></textarea>
            </div>

            {/* نوع تیکت */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع تیکت
              </label>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm cursor-pointer ${
                      formData.type === option.value
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                    <span className="ml-1">{option.icon}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ارسال به */}

            <FormControl fullWidth>
              <label
                htmlFor="targetUser"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ارسال به <span className="text-red-500">*</span>
              </label>
              <Select
                size="small"
                className={`w-full border ${errors.targetUser ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                labelId="targetUser-label"
                id="targetUser"
                name="targetUser"
                value={formData.targetUser}
                onChange={handleChange}
                error={!!errors.targetUser}
                dir="rtl"
              >
                <MenuItem value="">انتخاب کاربر</MenuItem>
                {users
                  ?.filter((user) => user?._id !== userId)
                  .map((user) => {
                    const { label: roleLabel, color } = getRoleInfo(user.roles);
                    return (
                      <MenuItem key={user._id} value={user._id}>
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={`/${user.profileImageUrl}`}
                            alt={user.firstName}
                            sx={{ width: 28, height: 28 }}
                          />
                          <div className="flex flex-col">
                            <Typography variant="body2">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" style={{ color }}>
                              {roleLabel}
                            </Typography>
                          </div>
                        </div>
                      </MenuItem>
                    );
                  })}
              </Select>
              {errors.targetUser && (
                <p className="mt-1 text-sm text-red-600">{errors.targetUser}</p>
              )}
            </FormControl>

            {/* آپلود فایل با پیش‌نمایش */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                فایل‌های پیوست (اختیاری)
              </label>

              {/* File previews */}
              {formData.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {/* Preview for images */}
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-200 rounded">
                            <svg
                              className="h-6 w-6 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="text-xs text-gray-600">
                          <p className="font-medium truncate max-w-xs">
                            {file.name}
                          </p>
                          <p>{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label="حذف فایل"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File upload area */}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-8 w-8 text-gray-400"
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
                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>انتخاب فایل‌ها</span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                        accept="image/jpeg, image/png, image/gif, application/pdf"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, GIF یا PDF (حداکثر 10MB)
                  </p>
                  {errors.attachments && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.attachments}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* دکمه ارسال */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    ارسال تیکت
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
