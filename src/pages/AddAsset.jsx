import  { useState , useEffect } from "react";
import { useParams } from "react-router";
import { addAsset } from "../api/asset/addAsset";

function AddAsset() {
  
  const { id } = useParams(); // اگر آیدی در آدرس وجود داشت یعنی در حالت ویرایش هستیم
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ وضعیت در حال ارسال

  const [formData, setFormData] = useState({
    name: "",
    type: "hardware",
    ownerType: "bank",
    owner: "",
    departmentScope: ["security"], // مقدار پیش‌فرض
    platforms: ["web"], // مقدار پیش‌فرض
    description: "",
    brand: "",
    model: "",
    version: "",
    serialNumber: "",
    licenseKey: "",
    macAddress: "",
    ipAddress: "",
    status: "available",
    location: "",
    assignedTo: "",
    assignedDate: "",
    purchaseDate: "",
    warrantyExpiry: "",
    maintenanceSchedule: "",
    cost: "",
    vendor: "",
    tags: [],
    // 🆕 فیلدهای جدید نرم‌افزار
    softwareType: "free",
    licenseStatus: "licensed",
    licenseExpiry: "",
    installDate: "",
    allowedInstallations: "",
  });

    // ✅ اگر id وجود داشت، حالت ویرایش فعال می‌شود
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetch(`http://localhost:5000/api/assets/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data);
        })
        .catch((err) => console.error("❌ خطا در دریافت دارایی:", err));
    }
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const exists = prev[name].includes(value);
      return {
        ...prev,
        [name]: exists
          ? prev[name].filter((v) => v !== value)
          : [...prev[name], value],
      };
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
    setIsSubmitting(true); // ✅ شروع حالت لودینگ

  try {
    const data = await addAsset(formData)
    

    if (data) {
      // alert("✅ دارایی با موفقیت ثبت شد!");
      console.log("📦 Asset Saved:", data.asset);
      setFormData({
        name: "",
        type: "hardware",
        ownerType: "bank",
        owner: "",
        departmentScope: ["security"],
        platforms: ["web"],
        description: "",
        brand: "",
        model: "",
        version: "",
        serialNumber: "",
        licenseKey: "",
        macAddress: "",
        ipAddress: "",
        status: "available",
        location: "",
        assignedTo: "",
        assignedDate: "",
        purchaseDate: "",
        warrantyExpiry: "",
        maintenanceSchedule: "",
        cost: "",
        vendor: "",
        tags: [],
        softwareType: "free",
        licenseStatus: "licensed",
        licenseExpiry: "",
        installDate: "",
        allowedInstallations: "",
      });
    } else {
      alert("❌ خطا در ثبت دارایی: " + data.message);
    }
  } catch (err) {
    console.error("❌ خطا در ارسال:", err);
    // alert("⚠️ خطا در اتصال به سرور");
  }finally{
    setIsSubmitting(false)
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* هدر */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
           <h2 className="text-3xl font-bold text-center">
            {isEditMode ? "ویرایش دارایی" : "ثبت دارایی جدید"}
          </h2>
          <p className="text-center mt-2 opacity-90">
            فرم جامع ثبت و مدیریت دارایی‌های سخت‌افزاری و نرم‌افزاری
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* اطلاعات پایه */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* نام ابزار */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نام ابزار</label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثلاً Dell Latitude 5520"
                required
              />
            </div>

            {/* نوع */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">نوع</label>
              <select
                name="type"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="hardware">سخت‌افزار</option>
                <option value="software">نرم‌افزار</option>
              </select>
            </div>

            {/* مالکیت */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">مالکیت</label>
              <select
                name="ownerType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.ownerType}
                onChange={handleChange}
              >
                <option value="bank">بانک</option>
                <option value="user">کاربر</option>
              </select>
            </div>

            {/* وضعیت */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">وضعیت</label>
              <select
                name="status"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="available">موجود</option>
                <option value="in-use">در حال استفاده</option>
                <option value="maintenance">در حال تعمیر</option>
                <option value="retired">بازنشسته</option>
                <option value="lost">گم‌شده</option>
              </select>
            </div>
          </div>

          {/* بخش مربوطه */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
            <label className="block text-gray-700 font-medium">بخش مربوطه</label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "security", label: "امنیت" },
                { id: "quality", label: "کیفیت" },
              ].map((dep) => (
                <label
                  key={dep.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 transition-all cursor-pointer ${
                    formData.departmentScope.includes(dep.id)
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="text-blue-600 focus:ring-blue-500"
                    checked={formData.departmentScope.includes(dep.id)}
                    onChange={() => handleMultiSelect("departmentScope", dep.id)}
                  />
                  {dep.label}
                </label>
              ))}
            </div>
          </div>

          {/* پلتفرم‌ها */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
            <label className="block text-gray-700 font-medium">پلتفرم‌ها</label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: "web", label: "وب" },
                { id: "mobile", label: "موبایل" },
                { id: "desktop", label: "دسکتاپ" },
                { id: "api", label: "API" },
              ].map((platform) => (
                <label
                  key={platform.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 transition-all cursor-pointer ${
                    formData.platforms.includes(platform.id)
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="text-blue-600 focus:ring-blue-500"
                    checked={formData.platforms.includes(platform.id)}
                    onChange={() => handleMultiSelect("platforms", platform.id)}
                  />
                  {platform.label}
                </label>
              ))}
            </div>
          </div>

          {/* توضیحات */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">توضیحات</label>
            <textarea
              name="description"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات کامل درباره ابزار..."
            ></textarea>
          </div>

          {/* 🆕 جزئیات نرم‌افزار (نمایش شرطی) */}
          {formData.type === "software" && (
            <div className="bg-blue-50 p-4 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">جزئیات نرم‌افزار</h3>

              {/* نوع نرم‌افزار */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">نوع نرم‌افزار</label>
                <select
                  name="softwareType"
                  value={formData.softwareType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">رایگان (Free)</option>
                  <option value="paid">پولی (Paid)</option>
                </select>
              </div>

              {/* اگر نرم‌افزار پولی بود */}
              {formData.softwareType === "paid" && (
                <div className="space-y-4">
                  {/* وضعیت لایسنس */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">وضعیت لایسنس</label>
                    <select
                      name="licenseStatus"
                      value={formData.licenseStatus}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="licensed">دارای لایسنس رسمی</option>
                      <option value="cracked">نسخه کرک‌شده</option>
                      <option value="trial">نسخه آزمایشی (Trial)</option>
                    </select>
                  </div>

                  {/* اگر لایسنس رسمی بود */}
                  {formData.licenseStatus === "licensed" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-gray-600 text-sm">کلید لایسنس</label>
                        <input
                          type="text"
                          name="licenseKey"
                          value={formData.licenseKey}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-gray-600 text-sm">تاریخ انقضا</label>
                        <input
                          type="date"
                          name="licenseExpiry"
                          value={formData.licenseExpiry}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* سایر اطلاعات نرم‌افزار */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-gray-600 text-sm">تاریخ نصب</label>
                      <input
                        type="date"
                        name="installDate"
                        value={formData.installDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-gray-600 text-sm">تعداد نصب مجاز</label>
                      <input
                        type="number"
                        name="allowedInstallations"
                        value={formData.allowedInstallations}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* اطلاعات تکمیلی */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              اطلاعات تکمیلی (اختیاری)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">برند</label>
                <input
                  type="text"
                  name="brand"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">مدل</label>
                <input
                  type="text"
                  name="model"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.model}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">شماره سریال</label>
                <input
                  type="text"
                  name="serialNumber"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">آدرس IP</label>
                <input
                  type="text"
                  name="ipAddress"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.ipAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ✅ دکمه ثبت */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              disabled={isSubmitting} // جلوگیری از کلیک دوباره
              className={`${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              } text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت ابزار"} {/* ✅ متن پویا */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAsset;
