import React from "react";
import bg3 from "../images/bg5.png"
import PentesterHistory from "./Pf3/PentesterHistory";
import IdentifierDoc from "./Pf3/IdentifierDoc";
import ControlQualify from "./Pf3/ControlQualify";
import PdfStructure from "./common/PdfStructure"
import CaptionTable_1 from "./Pf3/CaptionTable_1";


function Pf3(props  ) {


    return <>

        <div id="pf3" className="pf w0 h0" data-page-no="3">
            <div className="pc pc3 w0 h0">
                <PdfStructure src={bg3} page={props.pageNumber} />


                <div className={`cp1 cx90pf3 cw52p1 cy291pf3 chbb`}>

                    <IdentifierDoc project={props.project} count={props.count}/>
                    <div className="pf31cap">
                        <CaptionTable_1 caption="جدول 1: شناسنامه مستند" />
                    </div>
                </div>

                <div className={`cp1 cx90pf3_2 cw52 cy291pf3_2 chbb`}>

                    <ControlQualify />
                    <div className="pf32cap">
                        <CaptionTable_1 caption="جدول 2: کنترل کیفیت گزارش "/>
                    </div>

                </div>

            </div>
        </div>


    </>
}

export default Pf3 