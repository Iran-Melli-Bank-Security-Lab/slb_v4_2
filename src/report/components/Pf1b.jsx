
import bg1b from "../images/bg5.png"
import { upData } from "../utils/updateData";
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import MyTable from "./PF13/MyTable";
import Discription from "./PF1B/Discription"

function Pf1b({page , pageNumber}){
    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.11.1", description: '4.11.1- آزمون XSS مبتنی بر مدل DOM', code: '(WSTG-CLNT-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.2", description: '4.11.2- آزمون اجرای اسکریپت جاوا', code: '(WSTG-CLNT-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.3", description: '4.11.3- آزمون تزریق HTML', code: '(WSTG-CLNT-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.4", description: '4.11.4- آزمون تغییر مسیر URL سمت کاربر', code: '(WSTG-CLNT-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.5", description: '4.11.5- آزمون تزریق CSS', code: '(WSTG-CLNT-05)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.6", description: '4.11.6- آزمون دست‌ کاری منابع سمت کاربر', code: '(WSTG-CLNT-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.7", description: '4.11.7- آزمون CORS', code: '(WSTG-CLNT-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.8", description: '4.11.8- آزمون بهره‌کشی از برنامه ‌های کاربردی(CSF)', code: '(WSTG-CLNT-08)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.9", description: '4.11.9- آزمون Click Jacking', code: '(WSTG-CLNT-09)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.10", description: '4.11.10- آزمون WebSockets', code: '(WSTG-CLNT-10)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.11", description: '4.11.11- آزمون پیام ‌رسانی تحت وب', code: '(WSTG-CLNT-11)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.12", description: '4.11.12- آزمون Storage مرورگر', code: '(WSTG-CLNT-12)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.13", description: '4.11.13- آزمون گنجاندن اسکریپت درون سایت', code: '(WSTG-CLNT-13)' },
        { page: '', cvss: '', state: 'PASS', id: "4.11.14", description: '4.11.14- آزمون Tabnabbing معکوس', code: '(WSTG-CLNT-14)' }
      ];
      
      const updatedData = upData(data , page )

      console.log("pageNumber line 29 : " , pageNumber)

    return <>
    
    <div id="pf1b" className="pf w0 h0" data-page-no="1b">
            <div className="pc pc1b w0 h0">
               
               <PdfStructure src={bg1b} page={pageNumber.pf1b}/>
               
               
                <div className="c x0 y0 w2 h0">
               <HeaderPage className="cxd0pf1b">
               4.11- آزمون سمت مشتری
               </HeaderPage>
                <Discription/>
                <MyTable data={updatedData} className="cy291pf1b"/>

                </div>


            </div>
        </div>
    </>
}

export default Pf1b