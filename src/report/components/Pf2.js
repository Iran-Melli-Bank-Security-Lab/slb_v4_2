import React from "react"
import bg2 from "../images/bg2.png"
import "../components/tables/document.css"

const  Pf2 = React.forwardRef((props, ref) => {

    return <div ref={ref}>

        <div  id="pf2" className="pf w0 h0" >
            <div className="pc pc2 w0 h0">
                <img className="bi x0 y0 w1 h1" alt="" src={bg2} />

                <div className="c x3 y14 w3 h7">
                    <div className="t m0 x5 h8 y15 ff6 fs3 fc1 sc0 ls0 ws0">
                        الگوی استاندارد ارزیابی امنیتی و آزمون نفوذ
                    </div>
                </div>
                <div className="c x7 y17 w4 ha">
                    <div className="t m0 x8 hb y18 ff6 fs5 fc0 sc0 ls0 ws0">
                        اداره کل شبکه و زیرساخت
                    </div>
                    <div className="t m0 x9 hc y19 ff6 fs6 fc0 sc0 ls0 ws0">
                        معاونت امنیت

                    </div>

                </div>
                <div className="c xb y1b w5 he">
                    <div className="t m0 xc hf y1c ffa fs8 fc2 sc0 ls0 ws0">DEFINE<span className="_ _8"></span><span
                        className="fs6"> </span></div>
                </div>
                <div className="c xd y1d w6 h10">
                    <div className="t m0 xe hf y1e ffa fs8 fc2 sc0 ls0 ws0">DESIGN<span className="_ _9"></span><span
                        className="fs6"> </span></div>
                </div>
                <div className="c xf y1f w7 he">
                    <div className="t m0 x10 hf y1c ffa fs8 fc2 sc0 ls0 ws0">DEVELOP<span className="_ _a"></span><span
                        className="fs6"> </span></div>
                </div>
                <div className="c x11 y1d w8 h10">
                    <div className="t m0 x12 hf y1e ffa fs8 fc2 sc0 ls0 ws0">DEPLOY<span className="_ _b"></span><span
                        className="fs6"> </span></div>
                </div>
                <div className="c x13 y20 w9 he">
                    <div className="t m0 x12 hf y1c ffa fs8 fc2 sc0 ls0 ws0">MAINTAIN<span className="_ _c"></span><span
                        className="fs6"> </span></div>
                </div>
            </div>
        </div>

    </div>
})
export default Pf2