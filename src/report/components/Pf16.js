
import bg16 from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import MyTable from "./PF13/MyTable";
import Discription from "./PF16/Discription"
import { upData } from "../utils/updateData"

function Pf16({page , pageNumber}){
    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.7.1", description: '4.7.1- آزمون XSS بازتابی', code: '(WSTG-INPV-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.2", description: '4.7.2- آزمون XSS ذخیره‌شده (پایا)', code: '(WSTG-INPV-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.3", description: '4.7.3- آزمون دست‌کاری عملکرد HTTP', code: '(WSTG-INPV-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.4", description: '4.7.4- آزمون آلودگی پارامترهایHTTP', code: '(WSTG-INPV-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.1", description: '4.7.5.1- آزمون تزریق اوراکل', code: '(WSTG-INPV-05-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.2", description: '4.7.5.2- آزمون تزریق MySQL', code: '(WSTG-INPV-05-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.3", description: '4.7.5.3- آزمون تزریق SQL Server', code: '(WSTG-INPV-05-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.4", description: '4.7.5.4- آزمون تزریق PostgreSQL', code: '(WSTG-INPV-05-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.5", description: '4.7.5.5- آزمون تزریق MS Access', code: '(WSTG-INPV-05-05)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.6", description: '4.7.5.6- آزمون تزریق NoSQL', code: '(WSTG-INPV-05-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.7", description: '4.7.5.7- آزمون تزریق ORM', code: '(WSTG-INPV-05-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.5.8", description: '4.7.5.8- آزمون Client-side', code: '(WSTG-INPV-05-08)' },

    ];
      const updatedData = upData(data , page )
    return <>
    
    <div id="pf16" className="pf w0 h0" data-page-no="16">
            <div className="pc pc16 w0 h0">
                
               <PdfStructure src={bg16} page={pageNumber.pf16}/>

                
                <div className="c x0 y0 w2 h0">
                   
                <HeaderPage style={{marginBottom:'10px'}} className="cxd0pf16">

                4.7- آزمون اعتبارسنجی ورودی (بند 14 - 15408)
                    </HeaderPage>

                <Discription/>
                <MyTable data={updatedData} className="cy291pf16"/>

                </div>



            </div>
        </div>


    </>
}

export default Pf16