
import bg1c from "../images/bg5.png"
import { upData } from "../utils/updateData";
import MyTable from "./PF13/MyTable";
import Discription from "./PF1C/Discription"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"

function Pf1c({page , pageNumber}){

    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.12.1", description: '4.12.1- آزمون GraphQL', code: '(WSTG-APIT-01)' }
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