import React from "react";
import bg3 from "../images/bg5.png"
import PentesterHistory from "./Pf3/PentesterHistory";
import PdfStructure from "./common/PdfStructure"
import CaptionTable_1 from "./Pf3/CaptionTable_1";

function Pf3_1(props ) {

console.log("propes project : " , props )
    return <>

        <div id="pf3" className="pf w0 h0" data-page-no="3">
            <div className="pc pc3 w0 h0">
                <PdfStructure src={bg3} page={props.pageNumber} />

                <div className={`pf3_1c cx90pf3_1 cw52pf3 cy291pf3_1 chbb`}>

                    <PentesterHistory ProjectId={props.project?._id}/>
                    <div className="pf32cap">
                        <CaptionTable_1 caption="جدول 3: تاریخچه آزمونگران"/>
                    </div>
                </div>

             
              

            </div>
        </div>


    </>
}

export default Pf3_1 