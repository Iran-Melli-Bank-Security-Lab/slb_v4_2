
import bg5 from "../images/bg5.png"
import HeaderPage from "./common/Header";
import PdfStructure from "./common/PdfStructure";
import CaptionTable from "./PFF/CaptionTable"
import SummaryTest from "./tables/SummaryTest";
function Pff({count , pageNumber , data }) {
   console.log("data in line 8: " , data )
    return <>

        <div id="pff" className="pf w0 h0" data-page-no="f">
            <div className="pc pcf w0 h0">
                <PdfStructure src={bg5} page={pageNumber} />

                <HeaderPage className="cxd0pff">
                4- خلاصه آزمون‌های انجام گرفته
                    </HeaderPage>

                <div className={`c cx90 cw52 cy291pff chbb`}>

                    <SummaryTest count={count}  data={data}/>
                
                </div>

                
            </div>

            <div className=" x0 y0 w2 h0" >

                    <CaptionTable />

                </div>
        </div>
    </>
}

export default Pff 