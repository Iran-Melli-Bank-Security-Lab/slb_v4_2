
import bg1c from "../images/bg5.png"
import { upData } from "../utils/updateData";
import MyTable from "./PF13/MyTable";
import Discription from "./PF1C/Discription"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"

function Pf1c({page , pageNumber}){

    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.12.1", description: '4.12.1- آزمون GraphQL', code: '(WSTG-APIT-01)' }, 
        { page: '', cvss: '', state: 'PASS', id: "4.12.2", description: '4.12.2- احراز هویت ناقص/معیوب در سطح آبجکت', code: '(WSTG-APIT-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.3", description: '4.12.3- شکست احراز هویت', code: '(WSTG-APIT-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.4", description: '4.12.4- احراز هویت معیوب در سطح فیلد', code: '(WSTG-APIT-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.5", description: '4.12.5- مصرف منابع نامحدود', code: '(WSTG-APIT-05)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.6", description: '4.12.6- احراز هویت معیوب در سطح عملیات', code: '(WSTG-APIT-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.7", description: '4.12.7- دسترسی نامحدود به جریان های حساس کسب و کار', code: '(WSTG-APIT-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.8", description: '4.12.8- جعل درخواست از سمت سرور', code: '(WSTG-APIT-08)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.9", description: '4.12.9- تنظیمات نادرست امنیتی', code: '(WSTG-APIT-09)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.10", description: '4.12.10-  مدیریت ضعیف دارایی ها', code: '(WSTG-APIT-10)' },
        { page: '', cvss: '', state: 'PASS', id: "4.12.11", description: '4.12.11- استفاده ناامن از APIها', code: '(WSTG-APIT-11)' }
      ];
      const updatedData = upData(data , page )

    return <>
    
    <div id="pf1c" className="pf w0 h0" data-page-no="1c">
            <div className="pc pc1c w0 h0">
             
                <PdfStructure page={pageNumber.pf1c} src={bg1c}/>
                
                <div className="c x0 y0 w2 h0">
                 
                  <HeaderPage className="cxd0pf1c">
                    
                  4.12- آزمون API

                  </HeaderPage>

                 <Discription/>

                 <MyTable data={updatedData} className="cy291pf1c"/>
                

                </div>

                

            </div>
        </div>
    
    </>
}
export default Pf1c