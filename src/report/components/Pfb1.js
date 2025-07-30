
import bgb from "../images/bg5.png"
import PdfStructure from "./common/PdfStructure"
import SummaryManagement from "./PFB/SummaryManagement"
import CaptionTable_1 from "./PFB/CaptionTable_1"
import { transformObject } from "../../utils/transformObject"
import { useEffect, useState } from "react"

function Pfb1({ page , pageNumber }) {

    const [transform , setTransform ] = useState({})

    console.log("before transform : " , page )
    
    useEffect(()=>{
       
        setTransform(transformObject(page))
    
    } , [page])
    return <>
        <div id="pfb" className="pf w0 h0" data-page-no="b">
            <div className="pc pcb w0 h0">
                <PdfStructure src={bgb} page={pageNumber} />

                <div className={`pfb1c pfbcx91 cw52 cy291pfb_1 chbb`}>
                    <SummaryManagement pages={transform}/>
                    <div className="pfb1cap">
                        <CaptionTable_1 />
                    </div>
                </div>
                {/* <div className="c x0 y0 w2 h0">



                    <CaptionTable_1 />
                </div> */}
            </div>


        </div>
    </>
}
export default Pfb1