
import bg5 from "../images/bg5.png"
import Address from "./common/Address"
import BackgroundImage from "./common/BackgroundImage"
import Email from "./common/Email"
import HeaderPage from "./common/Header"
import PageNumber from "./common/PageNumber"
import PhoneNumber from "./common/PhoneNumber"
import Discription from "./PF12/Discription"
import MyTable from "./PF13/MyTable"
import { upData } from "../utils/updateData"
import { findSmallestPageObject } from "../utils/findSmallestPageObject"

function Pf12({page , pageNumber}) {

    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.3.1", description: '4.3.1- آزمون تعریف نقش‌های سامانه', code: '(WSTG-IDNT-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.3.2", description: '4.3.2- آزمون فرآیند ثبت‌نام کاربر', code: '(WSTG-IDNT-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.3.3", description: '4.3.3- آزمون فرآیند تأمین حساب کاربری', code: '(WSTG-IDNT-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.3.4", description: '4.3.4- آزمون برشماری حساب‌های ‌کاربری و نام‌های کاربری قابل حدس', code: '(WSTG-IDNT-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.3.5", description: '4.3.5- آزمون سیاست انتخاب نام کاربری ضعیف یا غیرقابل اجرا', code: '(WSTG-IDNT-05)' }
      ];
      
      const updatedData = upData(data , page )
    //   const pageNumber = findSmallestPageObject(updatedData)?.page  

    return <>

        <div id="pf12" className="pf w0 h0" data-page-no="12">

            <div className="pc pc12 w0 h0">

                <BackgroundImage src={bg5} />
                <Email />
                <PhoneNumber />
                <Address />

                <div className="c x0 y0 w2 h0">

                    <PageNumber page={pageNumber.pf12} />

                    <HeaderPage style={{ marginBottom: '10px' }} className="cxd0pf12">
                        4.3-
                        آزمون مدیریت هویت


                    </HeaderPage>
                    <Discription />
                    <MyTable data={updatedData} className="cy291pf12"/>


                </div>


            </div>
        </div>

    </>
}

export default Pf12