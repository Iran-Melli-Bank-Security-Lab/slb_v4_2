import React from 'react';
import '../components/afta/ConfigurationDocument.css'; // فایل استایل جداگانه

const ConfigurationDocument = () => {
  return (
    <div className="document-container" dir="rtl">
      {/* هدر سند */}
      <div className="document-header">
        <h1 className="title-bismillah">به نام خدا</h1>
        <h2 className="title-main">سند پيکربندي</h2>
        <div className="app-info">
          <span className="app-name">اپلیکیشن PWA تارا - نسخه 1.3</span>
          <span className="company-name">توسعه تجارت و فناوری تارا</span>
          <span className="year">1404</span>
          <span className="version">v1.3</span>
        </div>
      </div>

      {/* بخش برچسب گذاری محصول */}
      <section className="product-tagging-section">
        <h3 className="section-title">برچسب گذاری محصول</h3>
        
        <table className="product-table">
          <thead>
            <tr>
              <th colSpan="5" className="company-header">نام شرکت:</th>
            </tr>
          </thead>
          <tbody>
            <tr className="product-row">
              <td>نام محصول اپلیکیشن</td>
              <td>شماره محصول</td>
              <td>مدل</td>
              <td>نوع</td>
              <td>نسخه</td>
            </tr>
            <tr className="product-data-row">
              <td>PWA تارا</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td colSpan="5" className="tagging-description">
                <strong>نحوه برچسب گذاری محصول:</strong>
                <div className="tagging-placeholder"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* بخش لیست پیکربندی */}
      <section className="configuration-list-section">
        <h3 className="section-title">لیست پیکربندی</h3>
        <p className="eal-description">
          لیست پیکربندی در سطح EAL1 شامل معرفی محصول و مستندات لازم در این سطح می‌باشد:
        </p>

        <table className="configuration-table">
          <thead>
            <tr>
              <th>طبقه بندی</th>
              <th>لیست پیکربندی</th>
              <th>تولیدکننده</th>
              <th>نسخه</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>محصول</td>
              <td>اپلیکیشن PWA تارا</td>
              <td>شرکت توسعه تجارت و فناوری تارا</td>
              <td>-</td>
            </tr>
            <tr>
              <td>کلاس ASE</td>
              <td>سند هدف امنیتی</td>
              <td>شرکت توسعه تجارت و فناوری تارا</td>
              <td>-</td>
            </tr>
            <tr>
              <td>خانواده ADV_FSP</td>
              <td>سند مشخصات کارکردی</td>
              <td>شرکت توسعه تجارت و فناوری تارا</td>
              <td>-</td>
            </tr>
            <tr>
              <td>خانواده ALC_CMS</td>
              <td>سند پیکربندی</td>
              <td>شرکت توسعه تجارت و فناوری تارا</td>
              <td>-</td>
            </tr>
            <tr>
              <td>خانواده AGD_OPE<br />خانواده AGD_PRE</td>
              <td>سند شرح محصول</td>
              <td>شرکت توسعه تجارت و فناوری تارا</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* جای خالی در انتهای سند */}
      <div className="document-footer">
        <div className="empty-space"></div>
        <div className="empty-space"></div>
        <div className="empty-space"></div>
      </div>
    </div>
  );
};

export default ConfigurationDocument;