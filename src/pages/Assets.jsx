import React, { useState, useEffect } from "react";

function AssetTable() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    departmentScope: "",
    platform: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // داده‌های نمونه
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: "لپ‌تاپ دل مدل XPS",
        type: "hardware",
        status: "available",
        departmentScope: ["security"],
        platforms: ["web", "desktop"],
        brand: "Dell",
        model: "XPS 13",
        serialNumber: "SN123456",
        ipAddress: "192.168.1.101",
        assignedTo: "محمد رضایی",
        purchaseDate: "1402/05/15",
        location: "اتاق سرور"
      },
      {
        id: 2,
        name: "نرم‌افزار آنتی‌ویروس",
        type: "software",
        status: "in-use",
        departmentScope: ["security", "it"],
        platforms: ["desktop"],
        brand: "Kaspersky",
        model: "Internet Security",
        version: "2023",
        licenseKey: "LK789012",
        assignedTo: "فریبا محمدی",
        purchaseDate: "1402/03/22",
        warrantyExpiry: "1403/03/22"
      },
      {
        id: 3,
        name: "روتر سیسکو",
        type: "hardware",
        status: "maintenance",
        departmentScope: ["it"],
        platforms: ["api"],
        brand: "Cisco",
        model: "RV340",
        serialNumber: "SN345678",
        macAddress: "00:1A:2B:3C:4D:5E",
        ipAddress: "192.168.1.1",
        purchaseDate: "1401/11/30",
        maintenanceSchedule: "ماهانه"
      },
      {
        id: 4,
        name: "سیستم مانیتورینگ",
        type: "software",
        status: "available",
        departmentScope: ["quality", "security"],
        platforms: ["web", "mobile"],
        brand: "Zabbix",
        version: "6.0",
        assignedTo: "احمد حسینی",
        purchaseDate: "1402/02/10"
      },
      {
        id: 5,
        name: "پرینتر لیزری",
        type: "hardware",
        status: "in-use",
        departmentScope: ["finance"],
        platforms: ["desktop"],
        brand: "HP",
        model: "LaserJet Pro",
        serialNumber: "SN901234",
        ipAddress: "192.168.1.100",
        assignedTo: "مریم کریمی",
        location: "اتاق مالی",
        purchaseDate: "1402/04/18"
      },
      {
        id: 6,
        name: "دستگاه اسکنر",
        type: "hardware",
        status: "available",
        departmentScope: ["security"],
        platforms: ["desktop"],
        brand: "Fujitsu",
        model: "ScanSnap",
        serialNumber: "SN567890",
        assignedTo: "",
        purchaseDate: "1402/06/05"
      },
      {
        id: 7,
        name: "نرم‌افزار اتوماسیون",
        type: "software",
        status: "in-use",
        departmentScope: ["it", "finance"],
        platforms: ["web"],
        brand: "Oracle",
        model: "NetSuite",
        version: "2022",
        licenseKey: "LK345678",
        assignedTo: "رضا موسوی",
        purchaseDate: "1401/09/12"
      },
      {
        id: 8,
        name: "سرور اچ پی",
        type: "hardware",
        status: "maintenance",
        departmentScope: ["it"],
        platforms: ["api", "web"],
        brand: "HP",
        model: "ProLiant",
        serialNumber: "SN112233",
        ipAddress: "192.168.1.50",
        location: "اتاق سرور",
        purchaseDate: "1400/12/20",
        maintenanceSchedule: "هفتگی"
      },
      {
        id: 9,
        name: "دستگاه پشتیبان‌گیری",
        type: "hardware",
        status: "available",
        departmentScope: ["it"],
        platforms: ["api"],
        brand: "Synology",
        model: "DS920+",
        serialNumber: "SN445566",
        assignedTo: "",
        purchaseDate: "1402/01/25"
      },
      {
        id: 10,
        name: "نرم‌افزار مدیریت پروژه",
        type: "software",
        status: "in-use",
        departmentScope: ["quality"],
        platforms: ["web", "mobile"],
        brand: "Microsoft",
        model: "Project",
        version: "2021",
        licenseKey: "LK778899",
        assignedTo: "سارا احمدی",
        purchaseDate: "1402/05/30"
      },
      {
        id: 11,
        name: "مانیتور السی",
        type: "hardware",
        status: "available",
        departmentScope: ["it"],
        platforms: ["desktop"],
        brand: "LG",
        model: "UltraGear",
        serialNumber: "SN990011",
        assignedTo: "",
        purchaseDate: "1402/07/10"
      },
      {
        id: 12,
        name: "نرم‌افزار گرافیکی",
        type: "software",
        status: "in-use",
        departmentScope: ["quality"],
        platforms: ["desktop"],
        brand: "Adobe",
        model: "Photoshop",
        version: "2023",
        licenseKey: "LK223344",
        assignedTo: "نازیلا محمودی",
        purchaseDate: "1402/04/05"
      }
    ];
    setAssets(sampleData);
    setFilteredAssets(sampleData);
  }, []);

  // فیلتر کردن و جستجو
  useEffect(() => {
    let result = assets.filter(asset => {
      // جستجو در تمام فیلدهای متنی
      const matchesSearch = searchTerm === "" || 
        Object.values(asset).some(value => {
          if (typeof value === 'string') {
            return value.includes(searchTerm);
          } else if (Array.isArray(value)) {
            return value.some(item => item.includes(searchTerm));
          }
          return false;
        });
      
      // فیلتر بر اساس نوع
      const matchesType = filters.type === "" || asset.type === filters.type;
      
      // فیلتر بر اساس وضعیت
      const matchesStatus = filters.status === "" || asset.status === filters.status;
      
      // فیلتر بر اساس بخش مربوطه
      const matchesDepartment = filters.departmentScope === "" || 
        (asset.departmentScope && asset.departmentScope.includes(filters.departmentScope));
      
      // فیلتر بر اساس پلتفرم
      const matchesPlatform = filters.platform === "" || 
        (asset.platforms && asset.platforms.includes(filters.platform));
      
      return matchesSearch && matchesType && matchesStatus && matchesDepartment && matchesPlatform;
    });
    
    setFilteredAssets(result);
    setCurrentPage(1);
  }, [assets, searchTerm, filters]);

  // مرتب‌سازی
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredAssets].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredAssets(sortedData);
  };

  // صفحه‌بندی
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // تغییر وضعیت فیلترها
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
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
  };

  // نمایش وضعیت به فارسی
  const getStatusLabel = (status) => {
    const statusLabels = {
      'available': 'موجود',
      'in-use': 'در حال استفاده',
      'maintenance': 'در حال تعمیر',
      'retired': 'بازنشسته',
      'lost': 'گم‌شده'
    };
    return statusLabels[status] || status;
  };

  // نمایش نوع به فارسی
  const getTypeLabel = (type) => {
    return type === 'hardware' ? 'سخت‌افزار' : 'نرم‌افزار';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <h1 className="text-2xl font-bold">مدیریت دارایی‌ها</h1>
          <p className="mt-2">لیست کامل تمام دارایی‌های سخت‌افزاری و نرم‌افزاری</p>
        </div>

        {/* فیلترها و جستجو */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جستجو</label>
              <input
                type="text"
                placeholder="جستجو در تمام فیلدها..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">همه</option>
                <option value="hardware">سخت‌افزار</option>
                <option value="software">نرم‌افزار</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">همه</option>
                <option value="available">موجود</option>
                <option value="in-use">در حال استفاده</option>
                <option value="maintenance">در حال تعمیر</option>
                <option value="retired">بازنشسته</option>
                <option value="lost">گم‌شده</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">بخش مربوطه</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.departmentScope}
                onChange={(e) => handleFilterChange('departmentScope', e.target.value)}
              >
                <option value="">همه</option>
                <option value="security">امنیت</option>
                <option value="quality">کیفیت</option>
               
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">پلتفرم</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
              >
                <option value="">همه</option>
                <option value="web">وب</option>
                <option value="mobile">موبایل</option>
                <option value="desktop">دسکتاپ</option>
                <option value="api">API</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredAssets.length} مورد یافت شد
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              بازنشانی فیلترها
            </button>
          </div>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  نام ابزار {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  نوع {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  وضعیت {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  بخش مربوطه
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  پلتفرم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مسئول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.brand} {asset.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${asset.type === 'hardware' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {getTypeLabel(asset.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        asset.status === 'available' ? 'bg-green-100 text-green-800' :
                        asset.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                        asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getStatusLabel(asset.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {asset.departmentScope && asset.departmentScope.map(dept => (
                          <span key={dept} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {dept === 'security' ? 'امنیت' : 
                             dept === 'quality' ? 'کیفیت' : 
                             dept === 'it' ? 'فناوری اطلاعات' : 
                             dept === 'finance' ? 'مالی' : dept}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {asset.platforms && asset.platforms.map(platform => (
                          <span key={platform} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {platform === 'web' ? 'وب' : 
                             platform === 'mobile' ? 'موبایل' : 
                             platform === 'desktop' ? 'دسکتاپ' : 
                             platform === 'api' ? 'API' : platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.assignedTo || 'اختصاص نیافته'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 ml-4">ویرایش</button>
                      <button className="text-red-600 hover:text-red-900">حذف</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    موردی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
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
                <option value="50">50</option>
              </select>
              مورد در هر صفحه
            </span>
            <span className="text-sm text-gray-700">
              صفحه {currentPage} از {totalPages}
            </span>
          </div>
          
          <div className="flex">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg mr-1 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              قبلی
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded-lg mx-1 ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg ml-1 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              بعدی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetTable;