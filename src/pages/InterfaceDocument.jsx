import React from 'react';
import '../components/afta/InterfaceDocument.css'; // فایل استایل رو در ادامه اضافه می‌کنم

const InterfaceDocument = () => {
  return (
    <div className="document-container" dir="rtl">
      {/* هدر سند */}
      <div className="header-section">
        <div className="bismillah">به نام خدا</div>
        <div className="document-title">
          <h1>سند معرفی واسط‌ها</h1>
          <h2>اپلیکیشن PWA تارا</h2>
          <h3>شرکت توسعه تجارت و فناوری تارا</h3>
        </div>
        <div className="version-info">
          <div className="year">1404</div>
          <div className="version">نسخه 1.3</div>
        </div>
      </div>

      {/* فهرست مطالب */}
      <div className="toc-section">
        <h2>فهرست</h2>
        <div className="toc-items">
          <div className="toc-item">
            <span>2 مقدمه 3</span>
          </div>
          <div className="toc-item">
            <span>3 شرح کارکردهای امنیتی محصول 3</span>
          </div>
          <div className="toc-item indent">
            <span>3.1 نام واسط 3</span>
          </div>
          <div className="toc-item indent">
            <span>3.2 نمونه 1: واسط کاربری بین هدف ارزیابی و کاربر 3</span>
          </div>
          <div className="toc-item indent">
            <span>3.3 نمونه 2: واسط کاربری بین هدف ارزیابی و پایگاه داده 4</span>
          </div>
          <div className="toc-item">
            <span>4 نگاشت بین واسطهای کاربری کارکردهای امنیتی محصول و الزامات کارکرد امنیتی 6</span>
          </div>
        </div>
      </div>

      {/* مقدمه */}
      <div className="section" id="مقدمه">
        <h2>مقدمه</h2>
        <p>
          هدف از تدوین این سند، معرفی واسط‌های کاربری محصول <strong>اپلیکیشن PWA تارا</strong> به‌منظور برآورده‌سازی الزامات خانواده «مشخصات کارکردی» از کلاس «توسعه» در سطح <strong>EAL1</strong> می‌باشد.
        </p>
        <p>
          این سند، توصیف سطح بالایی از واسط‌های کاربری محصول ارائه می‌دهد، محدوده این سند تنها به واسط‌های «کارکردهای امنیتی هدف ارزیابی» با موجودیت‌های خارجی می‌باشد، همانند واسط بین هدف ارزیابی و پایگاه داده.
        </p>
      </div>

      {/* شرح کارکردهای امنیتی محصول */}
      <div className="section" id="شرح-کارکردهای-امنیتی-محصول">
        <h2>شرح کارکردهای امنیتی محصول</h2>
        
        {/* واسط کاربری بین محصول و کاربر */}
        <div className="subsection">
          <h3>واسط کاربری بین محصول و کاربر</h3>
          
          <table className="interface-table">
            <tbody>
              <tr>
                <td className="label-cell">نام واسط كاربري 1:</td>
                <td className="value-cell" colSpan="2">واسط کاربری بین اپلیکیشن PWA تارا و کاربر نهایی</td>
              </tr>
              <tr>
                <td className="label-cell"></td>
                <td className="label-cell">شرح</td>
                <td className="value-cell"></td>
              </tr>
              <tr>
                <td rowSpan="3" className="label-cell">توصيف واسط</td>
                <td className="sub-label-cell">هدف</td>
                <td className="value-cell">این واسط، ارتباط مستقیم کاربر نهایی با محصول را فراهم می‌نماید و از طریق آن، کاربران قادر به ثبت‌نام، ورود به سامانه و استفاده از خدمات خرید اعتباری می‌باشند.</td>
              </tr>
              <tr>
                <td className="sub-label-cell">متد استفاده شده</td>
                <td className="value-cell">ثبت‌نام کاربر - ورود کاربر با شماره همراه و OTP</td>
              </tr>
              <tr>
                <td className="sub-label-cell">پارامترها</td>
                <td className="value-cell"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* نمونه 1: واسط کاربری بین هدف ارزیابی و کاربر */}
        <div className="subsection">
          <h3>نمونه 1: واسط کاربری بین هدف ارزیابی و کاربر</h3>
          
          <table className="interface-table">
            <tbody>
              <tr>
                <td className="label-cell">نام واسط كاربري 1:</td>
                <td className="value-cell" colSpan="2">واسط کاربری بین محصول و کاربر</td>
              </tr>
              <tr>
                <td className="label-cell"></td>
                <td className="label-cell">شرح</td>
                <td className="value-cell"></td>
              </tr>
              <tr>
                <td rowSpan="3" className="label-cell">توصيف واسط</td>
                <td className="sub-label-cell">هدف</td>
                <td className="value-cell">
                  <div>ثبت کاربر جدید</div>
                  <div>شناسایی و احرازهویت کاربر پیش از انجام هر اقدامی بر روی هدف ارزیابی</div>
                  <div>قفل نمودن حساب کاربری پس از سه بار تلاش ناموفق</div>
                </td>
              </tr>
              <tr>
                <td className="sub-label-cell">متد استفاده شده</td>
                <td className="value-cell">
                  <div>ثبت اطلاعات کاربر جدید</div>
                  <div>اعلان نام کاربری/کلمه عبور کاربر</div>
                  <div>شمارش تعداد تلاش‌های احرازهویت ناموفق</div>
                </td>
              </tr>
              <tr>
                <td className="sub-label-cell">پارامترها</td>
                <td className="value-cell">
                  <div>نام کاربری و کلمه عبور</div>
                  <div>تعداد تلاش‌های ناموفق</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* نمونه 2: واسط کاربری بین هدف ارزیابی و پایگاه داده */}
        <div className="subsection">
          <h3>نمونه 2: واسط کاربری بین هدف ارزیابی و پایگاه داده</h3>
          
          <table className="interface-table">
            <tbody>
              <tr>
                <td className="label-cell">نام واسط كاربري 1:</td>
                <td className="value-cell" colSpan="2">واسط کاربری بین محصول و کاربر</td>
              </tr>
              <tr>
                <td className="label-cell"></td>
                <td className="label-cell">شرح</td>
                <td className="value-cell"></td>
              </tr>
              <tr>
                <td rowSpan="3" className="label-cell">توصيف واسط</td>
                <td className="sub-label-cell">هدف</td>
                <td className="value-cell">
                  <div>ثبت کاربر جدید</div>
                  <div>شناسایی و احرازهویت کاربر پیش از انجام هر اقدامی بر روی هدف ارزیابی</div>
                  <div>قفل نمودن حساب کاربری پس از سه بار تلاش ناموفق</div>
                </td>
              </tr>
              <tr>
                <td className="sub-label-cell">متد استفاده شده</td>
                <td className="value-cell">
                  <div>ثبت اطلاعات کاربر جدید</div>
                  <div>اعلان نام کاربری/کلمه عبور کاربر</div>
                  <div>شمارش تعداد تلاش‌های احرازهویت ناموفق</div>
                </td>
              </tr>
              <tr>
                <td className="sub-label-cell">پارامترها</td>
                <td className="value-cell">
                  <div>نام کاربری و کلمه عبور</div>
                  <div>تعداد تلاش‌های ناموفق</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterfaceDocument;