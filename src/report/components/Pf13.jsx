
import bg13 from "../images/bg5.png"
import Discription from "./PF13/Discription"
import MyTable from "./PF13/MyTable";
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import { upData } from "../utils/updateData"

function Pf13({page , pageNumber}) {
    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.4.1", description: '4.4.1- آزمون انتقال اطلاعات حساب کاربری از طریق کانال رمزگذاری شده', code: '(WSTG-ATHN-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.2", description: '4.4.2- آزمون بررسی اعتبارنامه‌های پیش‌فرض', code: '(WSTG-ATHN-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.3", description: '4.4.3- آزمون سازوکار ضعیف مسدودسازی', code: '(WSTG-ATHN-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.4", description: '4.4.4- آزمون دور زدن  شمای احرازهویت', code: '(WSTG-ATHN-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.5", description: '4.4.5- آزمون سازوکار گذرواژه حفظ شده', code: '(WSTG-ATHN-05)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.6", description: '4.4.6- آزمون نقاط ضعف حافظه‌ی پنهان مرورگر', code: '(WSTG-ATHN-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.7", description: '4.4.7- آزمون سیاست  گذرواژه ضعیف', code: '(WSTG-ATHN-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.8", description: '4.4.8- آزمون پرسش/پاسخ امنیتی ضعیف', code: '(WSTG-ATHN-08)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.9", description: '4.4.9- آزمون عملکردهای ضعیف بازنشانی  یا تغییر گذرواژه', code: '(WSTG-ATHN-09)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.10", description: '4.4.10- آزمون احراز هویت ضعیف در کانال‌های  جایگزین', code: '(WSTG-ATHN-010)' },
        { page: '', cvss: '', state: 'PASS', id: "4.4.11", description: '4.4.11- آزمون احراز هویت چند عاملی(MAF)', code: '(WSTG-ATHN-010)' }
      ];

      const updatedData = upData(data , page )

      
    return <>

        <div id="pf13" className="pf w0 h0" data-page-no="13">
            <div className="pc pc13 w0 h0">
                
                <PdfStructure src={bg13} page={pageNumber.pf13}/>
              
                <div className="c x0 y0 w2 h0">
                    <HeaderPage className="cxd0pf13">
                    4.4- آزمون احراز هویت (بند 11- 15408)
                    </HeaderPage>

                    <Discription />
                    <MyTable data={updatedData} className="cy291pf13"/>

                </div>


            </div>
        </div>

    </>
}
export default Pf13