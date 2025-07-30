
import bg1a from "../images/bg5.png"
import Discription from "../components/PF1A/Discription"
import PdfStructure from "../components/common/PdfStructure"
import HeaderPage from "./common/Header"
import MyTable from "./PF13/MyTable";
import { upData } from "../utils/updateData";

function Pf1a({page , pageNumber}){

  const data = [
    { page: '', cvss: '', state: 'PASS', id: "4.10.1", description: '4.10.1- آزمون اعتبارسنجی داده منطق کسب‌وکار', code: '(WSTG-BUSL-01)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.2", description: '4.10.2- آزمون بررسی امکان جعل درخواست', code: '(WSTG-BUSL-02)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.3", description: '4.10.3- آزمون یکپارچگی داده‌ها', code: '(WSTG-BUSL-03)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.4", description: '4.10.4- آزمون بررسی زمان پردازش', code: '(WSTG-BUSL-04)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.5", description: '4.10.5- آزمون محدودیت تعداد دفعات استفاده از یک تابع', code: '(WSTG-BUSL-05)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.6", description: '4.10.6- آزمون دور زدن جریان کاری', code: '(WSTG-BUSL-06)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.7", description: '4.10.7- آزمون دفاع در برابر عدم استفاده مناسب  برنامه‌ی کاربردی', code: '(WSTG-BUSL-07)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.8", description: '4.10.8- آزمون بارگذاری انواع فایل‌های غیرمجاز', code: '(WSTG-BUSL-08)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.9", description: '4.10.9- آزمون بارگذاری فایل‌های مخرب', code: '(WSTG-BUSL-09)' },
    { page: '', cvss: '', state: 'PASS', id: "4.10.10", description: '4.10.10- آزمون عملکرد پرداخت', code: '(WSTG-BUSL-10)' }
  ];
  const updatedData = upData(data , page )

    return <>
    
    <div id="pf1a" className="pf w0 h0" data-page-no="1a">
            <div className="pc pc1a w0 h0">
              
              <PdfStructure src={bg1a} page={pageNumber.pf1a}/>


                <div className="c x0 y0 w2 h0">
                
                 <HeaderPage className="cxd0pf1a">
                 4.10- آزمون منطق کسب ‌و کار (بند 12 - 15408)
                 </HeaderPage>
                  <Discription/>
                  
                  <MyTable data={updatedData} className="cy291pf1a"/>

                
                </div>

            </div>
        </div>

    </>
}

export default Pf1a 