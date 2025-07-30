
import bg18 from "../images/bg5.png"
import { upData } from "../utils/updateData";
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import MyTable from "./PF13/MyTable";
import Discription from "./PF18/Discription"

function Pf18({page , pageNumber}){

    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.8.1", description: '4.8.1- آزمون مدیریت نادرست خطا', code: '(WSTG-ERRH-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.8.2", description: '4.8.2- آزمون Stack Traces', code: '(WSTG-ERRH-02)' }
      ];
      

      const updatedData = upData(data , page )

    return <>
    
    <div id="pf18" className="pf w0 h0" data-page-no="18">
           

            <div className="pc pc18 w0 h0">
                <PdfStructure page={pageNumber.pf18} src={bg18}/>
            
            
                <div className="c x0 y0 w2 h0">
                 
                 <HeaderPage className="cxd0pf18">

                 4.8- آزمون مدیریت خطاها

                 </HeaderPage>
               <Discription/>

               <MyTable data={updatedData} className="cy291pf18"/>

                </div>


                
            </div>
        </div>
    </>
}
export default Pf18 