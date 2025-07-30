
import bg17 from "../images/bg5.png"
import PdfStructure from "./common/PdfStructure" 
import MyTable from "./PF13/MyTable";
import { upData } from "../utils/updateData"

function Pf17({page , pageNumber}){
    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.7.6", description: '4.7.6- آزمون تزریقLDAP', code: '(WSTG-INPV-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.7", description: '4.7.7- آزمون تزریق XML', code: '(WSTG-INPV-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.8", description: '4.7.8- آزمون تزریق SSI', code: '(WSTG-INPV-08)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.9", description: '4.7.9- آزمون تزریق XPath', code: '(WSTG-INPV-09)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.10", description: '4.7.10- آزمون تزریق IMAP/SMTP', code: '(WSTG-INPV-10)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.11.1", description: '4.7.11.1- آزمون تزریق کد', code: '(WSTG-INPV-11-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.11.2", description: '4.7.11.2- آزمون تزریق File Inclusion', code: '(WSTG-INPV-11-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.12", description: '4.7.12- آزمون تزریق Command', code: '(WSTG-INPV-12)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.13", description: '4.7.13- آزمون تزریق Format String', code: '(WSTG-INPV-13)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.14", description: '4.7.14- آزمون آسیب پذیری نهفته', code: '(WSTG-INPV-14)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.15", description: '4.7.15- آزمون قاچاق Splitting HTTP', code: '(WSTG-INPV-15)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.16", description: '4.7.16- آزمون درخواست‌های ورودی HTTP', code: '(WSTG-INPV-16)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.17", description: '4.7.17- آزمون تزریق Host Header', code: '(WSTG-INPV-17)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.18", description: '4.7.18- آزمون SSTI', code: '(WSTG-INPV-18)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.19", description: '4.7.19- آزمون SSRF', code: '(WSTG-INPV-19)' },
        { page: '', cvss: '', state: 'PASS', id: "4.7.20", description: '4.7.20- آزمون Mass Assignment', code: '(WSTG-INPV-20)' }
      ];
      const updatedData = upData(data , page )

    return  <>
    
    <div id="pf17" className="pf w0 h0" data-page-no="17">
            <div className="pc pc17 w0 h0">

            <PdfStructure page={pageNumber.pf16+1
            } src={bg17}/>    
            
            <MyTable data={updatedData} className="cy291pf17"/>

                     
            </div>
        </div>
    </>
}

export default Pf17 