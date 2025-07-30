
import bg19 from "../images/bg5.png"
import { upData } from "../utils/updateData";
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import MyTable from "./PF13/MyTable";
import Discription from "./PF19/Discription"

function Pf19({page , pageNumber}){
    
    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.9.1", description: '4.9.1- آزمون رمزنگاریSSL/TLS ضعیف', code: '(WSTG-CRYP-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.9.2", description: '4.9.2- آزمون Padding Oracle', code: '(WSTG-CRYP-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.9.3", description: '4.9.3- آزمون ارسال اطلاعات مهم از طریق کانال رمزگذاری نشده', code: '(WSTG-CRYP-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.9.4", description: '4.9.4- آزمون رمزنگاری ضعیف', code: '(WSTG-CRYP-04)' }
      ];
      const updatedData = upData(data , page )
 
    return <>
    
    <div id="pf19" className="pf w0 h0" data-page-no="19">
            <div className="pc pc19 w0 h0">
              
              {console.log("lin24 : " , pageNumber.pf19)}
                <PdfStructure src={bg19} page={pageNumber.pf19}/>
                <div className="c x0 y0 w2 h0">
                  
                   
                   <HeaderPage className="cxd0pf19">
                   4.9- آزمون رمزنگاری (بند 9 - 15408)
                   </HeaderPage>
                   <Discription/>
                  
                   <MyTable data={updatedData} className="cy291pf19"/>

              
                </div>

            </div>
        </div>

    </>
}

export default Pf19 