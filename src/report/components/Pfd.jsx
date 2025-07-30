import bgd from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import Discription from "./PF10/discription"
import ReportTest from "./tables/ReportTest"

function Pfd({count , pageNumber}) {

    return <>
        <div id="pfd" className="pf w0 h0" data-page-no="d">
            <div className="pc pcd w0 h0">
                <PdfStructure src={bgd} page={pageNumber} />


                <div className="c x0 y0 w2 h0">

                    <HeaderPage className="cxd0pfd" >
                        گزارش آزمون ۱۵۴۰۸

                    </HeaderPage>

                </div>

                <Discription />

                <div className={`c cx90 cw52 cy291pfd chbb`}>

                     <ReportTest count={count}/>

                </div>

            </div>
        </div>
    </>
}
export default Pfd 