import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserId } from "../hooks/useUserId";
import {getAssets} from "../api/asset/getAssets" 
import Swal from "sweetalert2";
import {deleteAsset} from "../api/asset/deleteAsset"

function AssetTable() {
  const navigate = useNavigate();

  // حالت‌ها
  const [assets, setAssets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = useUserId()
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    departmentScope: "",
    platform: ""
  });
  const [isLoading, setIsLoading] = useState(false);

 
  const fetchAssets = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = {
        userId, 
        page,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        type: filters.type || undefined,
        status: filters.status || undefined,
        departmentScope: filters.departmentScope || undefined,
        platform: filters.platform || undefined
      };

      const data = await getAssets(params);
    console.log("✅ API Response:", data );
      setAssets(data.data  || []);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalDocs);
      setCurrentPage(data.page);
    } catch (err) {
      console.error("❌ خطا در گرفتن داده‌ها:", err);
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  // هر بار که یکی از موارد زیر تغییر کند، از صفحه 1 شروع کن
  setCurrentPage(1);
  fetchAssets(1);
}, [itemsPerPage, filters, searchTerm]);

// و فقط برای رفتن بین صفحات:
useEffect(() => {
  fetchAssets(currentPage);
}, [currentPage]);

  // تغییر فیلتر
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // بازنشانی صفحه
  };

  // بازنشانی فیلترها
  const resetFilters = () => {
    setFilters({
      type: "",
      status: "",
      departmentScope: "",
      platform: ""
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // صفحه‌بندی
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // حذف دارایی

const handleDelete = async (assetId, assetName) => {
  const result = await Swal.fire({
    title: "آیا از حذف اطمینان دارید؟",
    html: `<b>${assetName}</b> حذف خواهد شد و قابل بازگردانی نیست.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "لغو",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#4f46e5",
    customClass: {
      popup: "swal-rtl",
      confirmButton: "swal-btn",
      cancelButton: "swal-btn",
      title: "text-right",
      htmlContainer: "text-right",
    },
  });

  if (result.isConfirmed) {
    try {
      const data = await deleteAsset(assetId);

      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "حذف انجام شد ✅",
          text: `دارایی "${assetName}" با موفقیت حذف شد.`,
          confirmButtonText: "باشه",
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: "swal-rtl",
            confirmButton: "swal-btn",
            title: "text-right",
            htmlContainer: "text-right",
          },
        });

        // مثلاً دوباره لیست رو رفرش کن
         fetchAssets();
      } else {
        await Swal.fire({
          icon: "error",
          title: "خطا!",
          text: data.message || "در حذف دارایی مشکلی رخ داد.",
          confirmButtonText: "باشه",
          confirmButtonColor: "#4f46e5",
          customClass: {
            popup: "swal-rtl",
            confirmButton: "swal-btn",
            title: "text-right",
            htmlContainer: "text-right",
          },
        }); 
      }
    } catch (error) {
      console.error("❌ Error deleting asset:", error);
      await Swal.fire({
        icon: "error",
        title: "خطا در اتصال به سرور!",
        text: "لطفاً اتصال اینترنت را بررسی کنید.",
        confirmButtonText: "باشه",
        confirmButtonColor: "#4f46e5",
        customClass: {
          popup: "swal-rtl",
          confirmButton: "swal-btn",
          title: "text-right",
          htmlContainer: "text-right",
        },
      });
    }
  }
};


  // نمایش وضعیت به فارسی
  const getStatusLabel = (status) => {
    const labels = {
      available: "موجود",
      "in-use": "در حال استفاده",
      maintenance: "در حال تعمیر",
      retired: "بازنشسته",
      lost: "گم‌شده"
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type) => (type === "hardware" ? "سخت‌افزار" : "نرم‌افزار");

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">مدیریت دارایی‌ها</h1>
            <p className="mt-1 text-sm opacity-80">نمایش، ویرایش و حذف دارایی‌ها</p>
          </div>
          <button
            onClick={() => navigate("/assets/add_asset")}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            + افزودن دارایی جدید
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="جستجو در نام، مدل یا برند..."
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">نوع</option>
              <option value="hardware">سخت‌افزار</option>
              <option value="software">نرم‌افزار</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">وضعیت</option>
              <option value="available">موجود</option>
              <option value="in-use">در حال استفاده</option>
              <option value="maintenance">در حال تعمیر</option>
              <option value="retired">بازنشسته</option>
              <option value="lost">گم‌شده</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={filters.departmentScope}
              onChange={(e) => handleFilterChange("departmentScope", e.target.value)}
            >
              <option value="">بخش</option>
              <option value="security">امنیت</option>
              <option value="quality">کیفیت</option>
              <option value="it">فناوری اطلاعات</option>
              <option value="finance">مالی</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={filters.platform}
              onChange={(e) => handleFilterChange("platform", e.target.value)}
            >
              <option value="">پلتفرم</option>
              <option value="web">وب</option>
              <option value="mobile">موبایل</option>
              <option value="desktop">دسکتاپ</option>
              <option value="api">API</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{totalItems} مورد یافت شد</span>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              بازنشانی
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">در حال بارگذاری...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">نام</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">نوع</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">برند / مدل</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">سریال / لایسنس</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr
                      key={asset._id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate(`/assets/details/${asset._id}`)}
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">{asset.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{getTypeLabel(asset.type)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            asset.status === "available"
                              ? "bg-green-100 text-green-700"
                              : asset.status === "in-use"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {getStatusLabel(asset.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {asset.brand} {asset.model}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {asset.serialNumber || asset.licenseKey || "-"}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => navigate(`/assets/edit/${asset._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 ml-3"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(asset._id, asset.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      هیچ موردی یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-700 ml-3">
                نمایش{" "}
                <select
                  className="mx-1 border border-gray-300 rounded py-1 px-2"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
                مورد در هر صفحه
              </span>
            </div>
          <div className="flex">
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage <= 1}
    className={`px-3 py-1 rounded-lg mx-1 ${
      currentPage <= 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
  >
    قبلی
  </button>

  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages))
    .map((page) => (
      <button
        key={page}
        onClick={() => paginate(page)}
        className={`px-3 py-1 rounded-lg mx-1 ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {page}
      </button>
    ))}

  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage >= totalPages}
    className={`px-3 py-1 rounded-lg mx-1 ${
      currentPage >= totalPages
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
  >
    بعدی
  </button>
</div>


          

          </div>
        )}
      </div>
        {/* استایل RTL برای SweetAlert */}
      <style>{`
        .swal-rtl {
          direction: rtl !important;
          text-align: right !important;
          font-family: 'Vazirmatn', sans-serif;
        }
        .swal-btn {
          font-family: 'Vazirmatn', sans-serif;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default AssetTable;
