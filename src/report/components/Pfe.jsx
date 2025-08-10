import bge from "../images/bg5.png"
import PdfStructure from "./common/PdfStructure"
import ReportTestSecond from "./tables/ReportTestSecond"

function Pfe({count , pageNumber , data }) {

    return <>

        <div id="pfe" className="pf w0 h0" data-page-no="e">
            <div className="pc pce w0 h0">

                <PdfStructure src={bge} page={pageNumber} />

                <div className={`c cx90 cw52 cy291pfe chbb`}>

                    <ReportTestSecond  count={count} data={data}/>
                </div>
            </div>
        </div>
    </>
}

export default Pfe 