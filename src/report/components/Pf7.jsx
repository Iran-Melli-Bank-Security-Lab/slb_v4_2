import bg7 from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import Discription from "./PF7/Discription"
import Header from "./PF7/Header"
import MyTable from "./PF7/MyTable"
function Pf7({pageNumber}) {

    return <>

        <div id="pf7" className="pf w0 h0" data-page-no="7">
            <div className="pc pc7 w0 h0">

                <PdfStructure page={pageNumber} src={bg7} />



                <div className="c x0 y0 w2 h0">


                 

                    <Header />

                </div>


                <div className="c x0 y0 w2 h0">

                    <div className={`c npf7cx90 cw52p6 cy291pf7 chbb`}>

                        <MyTable />

                    </div>



                    {/* table caption  */}
                    <div className="t m0 x29 h1e npf7yf0 ff2 fsb fc4 sc0 ls0 ws0"><span className="_ _9a"></span><span
                        className="_ _ab"></span><span className="_ _19"></span><span className="_ _42"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span className="_ _d5"></span>
                    </div>



                 
                    <HeaderPage className="cxd0pf7" y="y229pf7">
                        روش های  شناسایی آسیب پذیری یک سامانه :
                    </HeaderPage>



                  <Discription/>
               
               
                </div>
            </div>
        </div>
    </>
}
export default Pf7