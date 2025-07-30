import bg5 from "../images/bg5.png"
import { upData } from "../utils/updateData"
import Address from "./common/Address"
import BackgroundImage from "./common/BackgroundImage"
import Email from "./common/Email"
import HeaderPage from "./common/Header"
import PageNumber from "./common/PageNumber"
import PhoneNumber from "./common/PhoneNumber"
import Discription from "./PF11/Discription"
import MyTable from "./PF13/MyTable"
import { findSmallestPageObject } from "../utils/findSmallestPageObject"
import PdfStructure from "./common/PdfStructure"

function Pf11({ page , pageNumber }) {

    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.2.1", description: '4.2.1- آزمون پیکربندی شبکه/زیرساخت', code: '(WSTG-CONF-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.2", description: '4.2.2- آزمون پیکربندی بستر برنامه‌ی کاربردی', code: '(WSTG-CONF-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.3", description: '4.2.3- آزمون مدیریت پسوند فایل ها برای داده‌های حساس', code: '(WSTG-CONF-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.4", description: '4.2.4- آزمون بررسی فایل های پشتیبان قدیمی و بی‌مرجع برای داده ‌های حساس', code: '(WSTG-CONF-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.5", description: '4.2.5- آزمون برشماری واسط‌های مدیریتی زیرساخت و برنامه‌', code: '(WSTG-CONF-05)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.6", description: '4.2.6- آزمون روش‌های HTTP', code: '(WSTG-CONF-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.7", description: '4.2.7- آزمون HSTS', code: '(WSTG-CONF-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.8", description: '4.2.8- آزمون سیاست‌های بین دامنه‌ای RIA', code: '(WSTG-CONF-08)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.9", description: '4.2.9- آزمون مجوز فایل', code: '(WSTG-CONF-09)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.10", description: '4.2.10- آزمون تصاحب زیردامنه', code: '(WSTG-CONF-10)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.11", description: '4.2.11- آزمون فضای ذخیره سازی ابری', code: '(WSTG-CONF-11)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.12", description: '4.2.12- آزمون CSP', code: '(WSTG-CONF-12)' },
        { page: '', cvss: '', state: 'PASS', id: "4.2.13", description: '4.2.13- آزمون Path Confusion', code: '(WSTG-CONF-13)' }
    ];

    const updatedData = upData(data, page)


    return <>
        <div id="pf11" className="pf w0 h0" data-page-no="11">
            <div className="pc pc11 w0 h0">


<PdfStructure src={bg5} page={pageNumber.pf11 } />
               

                <div className="c x0 y0 w2 h0">
                    <HeaderPage style={{ marginBottom: '10px' }} className="cxd0pf11">

                        4.2-
                        آزمون
                        پیکربندی و
                        مدیریت استقرار



                    </HeaderPage>

                    <Discription />

                </div>
                <MyTable data={updatedData} className="cy291pf11" />


            </div>
        </div>
    </>
}
export default Pf11 