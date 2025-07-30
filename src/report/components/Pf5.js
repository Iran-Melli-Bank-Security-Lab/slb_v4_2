import bg13 from "../images/bg5.png"
import PdfStructure from "./common/PdfStructure"

import ListComponent from "./PF5/ListComponent"
function Pf5 ({pageNumber , pageNumbers}){

return <>
 <div id="pf5" className="pf w0 h0" data-page-no="5">
            <div className="pc pc5 w0 h0">
            <PdfStructure src={bg13 } page={pageNumber}/>

            <div className="c x0 pf5y0 w2 h0">

<ListComponent pageNumbers={pageNumbers}/>
                </div>
           
             
                
                
               
            </div>
        </div>

</>

}

export default Pf5 