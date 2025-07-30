
import bgb from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import Discription_1 from "./PFB/Discription_1"
import Discription_2 from "./PFB/Discription_2"
import MyTable from "./PFB/MyTable"

function Pfb({ project,originalReport,  report, edarehKol = "بانک ملی ایران" ,pageNumber}) {



    return <>
        <div id="pfb" className="pf w0 h0" data-page-no="b">
            <div className="pc pcb w0 h0">
                <PdfStructure src={bgb} page={pageNumber} />


                <div className="c x0 y0 w2 h0">

                    <HeaderPage className="cxd0pfb">
                        1-خلاصه مدیریتی آزمایشگاه امنیت
                    </HeaderPage>


                </div>

                <Discription_1 />

                <div className={`c pfbcx90 cw52 cy291pfb chbb`}>

                    <MyTable originalReport={originalReport} report={report} />

                </div>



             



                <div className="c x4e y9a w38 h94">

                    <div className="t m0 x37 h1f y190 ff2 fsb fc4 sc0 ls0 ws0"><span className="_ _11"></span><span
                        className="_ _19"></span><span className="ls34"><span className="_ _142"></span><span
                            className="ls0"><span className="_ _60"></span><span
                                className="_ _51"></span><span className="_ _30"></span><span className="ff1">
                            </span></span></span>
                            
                    </div>
                </div>


            </div>


        </div>
    </>
}
export default Pfb