
import bgc from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import CaptionTable from "./PFC/CaptionTable"
import Discription from "./PFC/Discription"
import Discription_1 from "./PFC/Discription_1"
import MyTable from "./PFC/MyTable"

function Pfc({pageNumber}) {

        return <>

                <div id="pfc" className="pf w0 h0" data-page-no="c">
                        <div className="pc pcc w0 h0">

                                <PdfStructure page={pageNumber} src={bgc} />


                                <div className="c x0 y0 w2 h0">

                                        {/* <HeaderPage className="cxd0pfc" y="y229pfc">

2-مفروضات ارزیابی

</HeaderPage> */}



                                        <HeaderPage className="cxd0pfc" y="y229pfc">
                                                2.1- رویکرد آزمون نفوذ
                                        </HeaderPage>

                                        <Discription />


                                        <CaptionTable />

                                        <HeaderPage className="cxd0pfc" y="y229pfc_1" >
                                                2.2-مکان گروه ارزیاب
                                        </HeaderPage>

                                        <Discription_1 />
                                </div>


                                <div className={`c cx90 cw52 cy291pfb_1 chbb`}>

                                        <MyTable />


                                </div>

                        </div>
                </div>

        </>
}

export default Pfc 