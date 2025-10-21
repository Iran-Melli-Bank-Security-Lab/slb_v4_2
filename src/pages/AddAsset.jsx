import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { addAsset } from "../api/asset/addAsset";
import { useUserId } from "../hooks/useUserId";

const VALID_TYPES = ["hardware", "software"];
const VALID_OWNER_TYPES = ["bank", "user"];
const VALID_DEPARTMENTS = ["security", "quality"];
const VALID_PLATFORMS = ["web", "mobile", "desktop", "api"];

function AddAsset() {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const  userId  = useUserId();
  console.log("userID : " , useUserId()  )

  const [formData, setFormData] = useState({
    // --- Required defaults
    name: "",
    type: "hardware",
    ownerType: "bank",
    departmentScope: ["security"],
    platforms: ["web"],

    // --- Optional defaults
    owner: "",
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

  // Edit mode loader
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetch(`http://localhost:5000/api/assets/${id}`)
        .then((res) => res.json())
        .then((data) => {
          // اگر API شما data را داخل data.data برمی‌گرداند، این خط را به setFormData(data.data) تغییر دهید
          setFormData(data);
        })
        .catch((err) => console.error("❌ خطا در دریافت دارایی:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // تبدیل "" به null برای فیلدهای تاریخ/عدد و نرمال‌سازی owner/assignedTo
  const normalizeFormData = (raw) => {
    const copy = { ...raw };

    // ObjectId ها
    copy.owner = userId || null;
    copy.assignedTo = userId || null;

    // تاریخ‌ها
    [
      "assignedDate",
      "purchaseDate",
      "warrantyExpiry",
      "maintenanceSchedule",
      "licenseExpiry",
      "installDate",
    ].forEach((k) => {
      if (copy[k] === "") copy[k] = null;
    });

    // اعداد
    ["cost", "allowedInstallations"].forEach((k) => {
      if (copy[k] === "") copy[k] = null;
      else if (copy[k] !== null && copy[k] !== undefined) {
        const n = Number(copy[k]);
        copy[k] = Number.isNaN(n) ? null : n;
      }
    });

    // رشته‌ها trim
    [
      "name",
      "description",
      "brand",
      "model",
      "version",
      "serialNumber",
      "licenseKey",
      "macAddress",
      "ipAddress",
      "location",
      "vendor",
    ].forEach((k) => {
      if (typeof copy[k] === "string") copy[k] = copy[k].trim();
    });

    return copy;
  };

  const validateRequired = (data) => {
    const errors = [];

    if (!data.name?.trim()) errors.push("• نام ابزار (name) الزامی است.");
    if (!VALID_TYPES.includes(data.type))
      errors.push("• نوع (type) نامعتبر/الزامی است.");
    if (!VALID_OWNER_TYPES.includes(data.ownerType))
      errors.push("• مالکیت (ownerType) نامعتبر/الزامی است.");

    if (!Array.isArray(data.departmentScope) || data.departmentScope.length === 0)
      errors.push("• حداقل یک مورد برای بخش مربوطه (departmentScope) لازم است.");
    else if (!data.departmentScope.every((d) => VALID_DEPARTMENTS.includes(d)))
      errors.push("• مقادیر بخش مربوطه نامعتبر است.");

    if (!Array.isArray(data.platforms) || data.platforms.length === 0)
      errors.push("• حداقل یک پلتفرم (platforms) لازم است.");
    else if (!data.platforms.every((p) => VALID_PLATFORMS.includes(p)))
      errors.push("• مقادیر پلتفرم نامعتبر است.");

    // شرطی: اگر ownerType = user
    if (data.ownerType === "user" && !userId)
      errors.push("• تعیین مالک (owner) ضروری است؛ کاربر لاگین‌ شده شناسایی نشد.");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // نرمال‌سازی قبل از ارسال
      const payload = normalizeFormData({ ...formData });

      // اعتبارسنجی Required
      const errors = validateRequired(payload);
      if (errors.length > 0) {
        alert(`لطفاً موارد زیر را تکمیل/اصلاح کنید:\n\n${errors.join("\n")}`);
        return;
      }

      const data = await addAsset(payload);

      if (data?.success) {
        // reset form (required defaults remain)
        setFormData({
          name: "",
          type: "hardware",
          ownerType: "bank",
          departmentScope: ["security"],
          platforms: ["web"],

          owner: "",
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
        alert("❌ خطا در ثبت دارایی: " + (data?.message || "نامشخص"));
      }
    } catch (err) {
      console.error("❌ خطا در ارسال:", err);
      alert("⚠️ خطا در اتصال به سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-3xl font-bold text-center">
            {isEditMode ? "ویرایش دارایی" : "ثبت دارایی جدید"}
          </h2>
          <p className="text-center mt-2 opacity-90">
            ابتدا فیلدهای اجباری را تکمیل کنید؛ سپس فیلدهای اختیاری را در ادامه ببینید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* ===== Required Fields (Top) ===== */}
          <div className="space-y-6 p-5 rounded-2xl border border-blue-200 bg-blue-50">
            <h3 className="text-xl font-bold text-blue-800">فیلدهای اجباری</h3>

            {/* نام ابزار ★ */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                نام ابزار <span className="text-red-600">★</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثلاً Dell Latitude 5520"
                required
              />
            </div>

            {/* نوع ★ */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                نوع <span className="text-red-600">★</span>
              </label>
              <select
                name="type"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="hardware">سخت‌افزار</option>
                <option value="software">نرم‌افزار</option>
              </select>
            </div>

            {/* مالکیت ★ */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                مالکیت <span className="text-red-600">★</span>
              </label>
              <select
                name="ownerType"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.ownerType}
                onChange={handleChange}
                required
              >
                <option value="bank">بانک</option>
                <option value="user">کاربر</option>
              </select>
              {formData.ownerType === "user" && (
                <p className="text-sm text-gray-600">
                  مالک به‌صورت خودکار کاربر فعلی تنظیم می‌شود.
                </p>
              )}
            </div>

            {/* بخش مربوطه ★ */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">
                بخش مربوطه <span className="text-red-600">★</span>
              </label>
              <div className="flex flex-wrap gap-3">
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
              <p className="text-xs text-gray-500">حداقل یک مورد لازم است.</p>
            </div>

            {/* پلتفرم‌ها ★ */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium">
                پلتفرم‌ها <span className="text-red-600">★</span>
              </label>
              <div className="flex flex-wrap gap-3">
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
              <p className="text-xs text-gray-500">حداقل یک مورد لازم است.</p>
            </div>
          </div>

          {/* ===== Optional Sections (Bottom) ===== */}

          {/* وضعیت (اختیاری) */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">وضعیت</label>
            <select
              name="status"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* توضیحات (اختیاری) */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">توضیحات</label>
            <textarea
              name="description"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
              placeholder="توضیحات کامل درباره ابزار..."
            />
          </div>

          {/* جزئیات نرم‌افزار (اختیاری، اگر نوع = نرم‌افزار) */}
          {formData.type === "software" && (
            <div className="bg-blue-50 p-4 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">جزئیات نرم‌افزار</h3>

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

              {formData.softwareType === "paid" && (
                <div className="space-y-4">
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

          {/* اطلاعات تکمیلی (اختیاری) */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">اطلاعات تکمیلی (اختیاری)</h3>
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
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">آدرس MAC</label>
                <input
                  type="text"
                  name="macAddress"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.macAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">مکان/لوکیشن</label>
                <input
                  type="text"
                  name="location"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* تاریخ‌ها، انتساب و فروشنده/هزینه (اختیاری) */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">تاریخ تخصیص</label>
                <input
                  type="date"
                  name="assignedDate"
                  value={formData.assignedDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">تاریخ خرید</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">انقضا گارانتی</label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">زمان‌بندی نگهداری</label>
                <input
                  type="date"
                  name="maintenanceSchedule"
                  value={formData.maintenanceSchedule}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">هزینه/قیمت</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-600 text-sm">فروشنده</label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* تگ‌ها (اختیاری) */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">تگ‌ها (با کاما جدا کنید)</label>
            <input
              type="text"
              name="tags"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="example, security, bank"
            />
          </div>

          {/* Submit */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              } text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت ابزار"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAsset;
