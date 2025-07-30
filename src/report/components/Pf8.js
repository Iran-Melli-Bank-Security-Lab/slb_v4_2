import bg8 from "../images/bg8.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"

function Pf8({pageNumber}){

    return <>
    
    <div id="pf8" className="pf w0 h0" data-page-no="8">
            <div className="pc pc8 w0 h0">
                
            <PdfStructure src={bg8} page={pageNumber}/>
                
             
                {/* <div className="c x14 y25 wc h14">
                    <div className="t m0 x16 h13 y26 ffd fs9 fc0 sc0 ls0 ws0"><span
                            className="_ _2"></span><span className="_ _f"></span><span
                            className="_ _2"></span><span className="_ _10"></span><span
                            className="_ _11"></span><span className="_ _12"></span><span className="_ _13"></span><span
                            className="_ _14"></span><span className="_ _15"></span><span
                            className="_ _16"></span><span className="_ _17"></span></div>
                    <div className="t m0 x17 h13 y27 ffd fs9 fc0 sc0 ls0 ws0"><span className="fc3 sc0"></span><span
                            className="fc3 sc0"></span><span className="fc3 sc0"></span><span
                            className="fc3 sc0"></span><span className="fc3 sc0"></span><span
                            className="fc3 sc0"></span><span className="_ _18"></span><span className="ls1"><span
                                className="fc3 sc0"></span><span className="_ _19"></span><span className="ls0"><span
                                    className="fc3 sc0"></span></span></span></div>
                </div> */}
                <div className="c x0 y0 w2 h0">
                    

                   
                   <HeaderPage className="cxd0pf8">
                   ساختار موارد آزمون:
                   </HeaderPage>

                    <div className="t m0 x78 h26 y106 ff2 fs2 fc0 sc0 ls0 ws0"><span className="_ _5e"></span><span
                            className="_ _1d"></span><span className="_ _2"></span><span
                            className="_ _1d"></span><span className="_ _dd"></span><span className="ff1 fs0">OWASP<span
                                className="_ _de"></span><span className="ff2 fs2"><span
                                    className="_ _df"></span><span className="_ _5e"></span><span
                                    className="_ _2"></span></span></span></div>
                    <div className="t m0 x74 h26 y107 ff2 fs2 fc0 sc0 ls0 ws0"><span className="_ _5e"></span><span
                            className="_ _2"></span><span className="_ _9f"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span
                            className="_ _5e"></span><span className="_ _e0"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span
                            className="_ _5e"></span></div>
                    <div className="t m0 x79 h5 y108 ff2 fs2 fc0 sc0 ls0 ws0"><span
                            className="_ _e1"></span><span className="_ _c9"></span><span className="ff1"> </span></div>
                    <div className="t m0 x7a h34 y109 ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _19"></span><span className="ff1"> <span className="_ _99"></span><span
                                    className="ffd"><span className="_ _67"></span><span className="_ _e2"></span><span
                                        className="_ _e2"></span><span className="_ _1"></span><span className="ff2 ls7"><span
                                            className="_ _8b"></span><span className="ls0"><span className="_ _32"></span><span
                                                className="_ _36"></span><span className="_ _21"></span><span
                                                className="_ _94"></span><span className="_ _e3"></span><span
                                                className="_ _e4"></span><span className="_ _ae"></span><span
                                                className="_ _46"></span><span className="ff1">
                                            </span></span></span></span></span></span></div>
                    <div className="t m0 x7a h34 y10a ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _e5"></span><span className="ffd"><span
                                    className="_ _e6"></span><span className="ff2"><span
                                        className="_ _e7"></span><span
                                        className="_ _e8"></span><span className="ff1"> </span></span></span></span></div>
                    <div className="t m0 x7a h4c y10b ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _c5"></span><span className="ffd"><span
                                    className="_ _4e"></span><span className="_ _5e"></span><span
                                    className="_ _5e"></span><span className="_ _e9"></span><span className="ff2 ls7"><span
                                        className="_ _ea"></span><span className="ff16 fs0 ls0">(POC URL)<span
                                            className="_ _eb"></span><span className="ffd fsc"><span className="_ _ec"></span><span
                                                className="ff2"><span className="_ _ed"></span><span
                                                    className="_ _5e"></span><span className="_ _69"></span><span
                                                    className="_ _2"></span><span
                                                    className="_ _4e"></span><span
                                                    className="_ _69"></span><span
                                                    className="_ _69"></span><span
                                                    className="_ _69"></span></span></span></span></span></span></span>
                    </div>
                    <div className="t m0 x7b h34 y10c ff2 fsc fc0 sc0 ls0 ws0"><span className="_ _ee"></span><span
                            className="ff1"> </span></div>
                    <div className="t m0 x7a h34 y10d ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _3b"></span><span className="ffd"><span
                                    className="_ _ef"></span><span className="ff2 ls7"><span className="_ _21"></span><span
                                        className="ff16 fs0 ls0">(Attack Vector)<span className="_ _f0"></span><span
                                            className="ffd fsc"><span className="_ _1"></span><span className="fs0"><span
                                                    className="_ _f1"></span><span
                                                    className="ff2 fsc"><span
                                                        className="_ _4e"></span><span
                                                        className="_ _4e"></span><span className="_ _f2"></span><span
                                                        className="ff1">
                                                    </span></span></span></span></span></span></span></span></div>
                    <div className="t m0 x7a h4c y10e ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _3a"></span><span className="ffd"><span
                                    className="_ _42"></span><span className="ff2 ls7"><span className="_ _76"></span><span
                                        className="ff10 fs0 ls0"> <span className="ff16">(Attack Score)<span
                                                className="_ _71"></span><span className="ffd fsc"><span
                                                    className="_ _1"></span><span className="fs0"><span
                                                        className="_ _f3"></span><span className="ff2 fsc"><span
                                                            className="_ _4e"></span><span
                                                            className="_ _f4"></span><span className="ff1 fs0">CVSS<span
                                                                className="_ _aa"></span><span className="ff2 fsc"><span
                                                                    className="_ _8"></span><span
                                                                    className="_ _ac"></span><span className="ff3">
                                                                </span></span></span></span></span></span></span></span></span></span></span>
                    </div>


                    <div className="t m0 x76 h60 y10f ff3 fs0 fc0 sc0 ls0 ws0"> </div>
                    <div className="t m0 x46 h61 y110 ff1 fs9 fc0 sc0 ls0 ws0">CVSS<span className="_ _24"></span><span
                            className="ff22 ls21"> <span className="_ _f5"></span><span className="ff15 ls0"><span
                                    className="_ _51"></span><span
                                    className="_ _1d"></span><span className="_ _1d"></span><span
                                    className="_ _1d"></span><span className="_ _2"></span><span
                                    className="_ _4e"></span><span className="_ _1d"></span><span
                                    className="_ _1d"></span><span
                                    className="_ _1d"></span></span></span></div>
                    <div className="t m0 x7c h62 y111 ff15 fs9 fc0 sc0 ls0 ws0"><span
                            className="_ _1d"></span><span className="_ _f6"></span><span
                            className="_ _51"></span><span className="_ _1d"></span><span className="_ _4e"></span><span
                            className="_ _a5"></span><span className="ls22"><span className="_ _8b"></span><span
                                className="ls0"><span className="_ _59"></span><span className="ls23"><span
                                        className="_ _61"></span><span className="ls0"><span className="_ _ec"></span><span
                                            className="_ _f7"></span><span className="_ _51"></span><span
                                            className="_ _2"></span><span className="_ _51"></span><span
                                            className="_ _2"></span><span className="_ _4e"></span><span
                                            className="_ _1d"></span><span className="_ _f8"></span><span
                                            className="_ _59"></span><span className="_ _de"></span><span
                                            className="_ _36"></span><span
                                            className="_ _2"></span><span className="_ _51"></span><span
                                            className="_ _2"></span><span className="_ _4e"></span><span
                                            className="_ _1d"></span></span></span></span></span></div>
                    <div className="t m0 x7d h62 y112 ff15 fs9 fc0 sc0 ls0 ws0"><span
                            className="_ _51"></span><span className="_ _1d"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span className="_ _f9"></span><span
                            className="_ _f9"></span><span className="_ _2"></span><span
                            className="_ _4e"></span><span className="_ _f9"></span><span className="_ _fa"></span><span
                            className="_ _36"></span><span className="_ _f9"></span><span className="_ _fb"></span><span
                            className="_ _51"></span><span className="_ _f9"></span><span
                            className="_ _f9"></span><span className="_ _2"></span><span
                            className="_ _f9"></span><span className="_ _2"></span><span className="_ _4e"></span>
                    </div>
                    <div className="t m0 x7e h62 y113 ff15 fs9 fc0 sc0 ls0 ws0"><span
                            className="_ _2"></span><span className="_ _2"></span><span
                            className="_ _4e"></span><span className="_ _fc"></span><span className="ff22">
                            <span className="_ _46"></span> </span></div>
                </div>
                <div className="c x7f y114 w26 h63">
                    <div className="t m0 x24 h64 y115 ff6 fs9 fc2 sc0 ls0 ws0"><span className="_ _1d"></span>کلاس<span
                            className="_ _4a"></span></div>
                </div>
                <div className="c x80 y114 w27 h63">
                    <div className="t m0 x8 h64 y115 ff6 fs9 fc2 sc0 ls0 ws0">نام پارامتر<span className="_ _1e"></span><span
                            className="ff23"> </span></div>
                </div>
                <div className="c x81 y114 w28 h63">
                    <div className="t m0 x75 h64 y115 ff6 fs9 fc2 sc0 ls0 ws0">توضیحات<span className="_ _fd"></span></div>
                </div>
                <div className="c x7f y116 w29 h65">
                    <div className="t m0 x6a h66 y117 ff1b fs9 fc2 sc0 ls0 ws0">Exploitability </div>
                    <div className="t m0 x82 h13 y118 ff1b fs9 fc2 sc0 ls0 ws0">Metrics<span className="_ _6c"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x83 y119 w2a h2e">
                    <div className="t m0 x2c h42 y71 ff1b fsb fc0 sc0 ls0 ws0">Attack vector(AV)<span
                            className="_ _fe"></span><span className="ffd"></span></div>
                </div>
                <div className="c x81 y119 w28 h2e">
                    <div className="t m0 x84 h32 y11a ffd fs1 fc0 sc0 ls0 ws0"><span
                            className="_ _4e"></span><span className="_ _4e"></span><span
                            className="_ _ff"></span><span className="_ _51"></span><span
                            className="_ _5f"></span><span className="_ _2"></span><span className="_ _e"></span></div>
                </div>
                <div className="c x83 y11b w2a h2f">
                    <div className="t m0 x5 h42 y4b ff1b fsb fc0 sc0 ls0 ws0">Attack Complexity(AC)<span
                            className="_ _34"></span><span className="ffd"></span></div>
                </div>
                <div className="c x81 y11b w28 h2f">
                    <div className="t m0 x85 h32 y4c ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _4e"></span><span className="_ _4e"></span><span
                            className="_ _4e"></span><span className="_ _100"></span></div>
                </div>
                <div className="c x83 y11c w2a h67">
                    <div className="t m0 x5a h42 y11d ff1b fsb fc0 sc0 ls0 ws0">Privileges Required(PR)<span
                            className="_ _101"></span><span className="ffd"></span></div>
                </div>
                <div className="c x81 y11c w28 h67">
                    <div className="t m0 x1e h32 y11e ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _4e"></span><span className="_ _4e"></span><span
                            className="_ _4e"></span><span className="_ _4e"></span></div>
                    <div className="t m0 x86 h32 y22 ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _93"></span></div>
                </div>
                <div className="c x83 y11f w2a h68">
                    <div className="t m0 x3f h42 y11d ff1b fsb fc0 sc0 ls0 ws0">User Interaction(UI)<span
                            className="_ _da"></span><span className="ffd"></span></div>
                </div>
                <div className="c x81 y11f w28 h68">
                    <div className="t m0 x27 h32 y11e ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _4e"></span><span className="_ _4e"></span><span
                            className="_ _5f"></span></div>
                    <div className="t m0 x87 h32 y22 ffd fs1 fc0 sc0 ls0 ws0"><span
                            className="_ _51"></span><span className="_ _102"></span><span
                            className="_ _51"></span><span className="_ _5f"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span className="_ _103"></span></div>
                </div>
                <div className="c x83 y116 w2a h69">
                    <div className="t m0 x26 h42 y120 ff1b fsb fc0 sc0 ls0 ws0">Scope(S)<span className="_ _92"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x81 y116 w28 h69">
                    <div className="t m0 x3f h32 y121 ffd fs1 fc0 sc0 ls0 ws0"><span
                            className="_ _51"></span><span className="_ _4e"></span><span
                            className="_ _4e"></span><span className="_ _4e"></span><span
                            className="_ _4e"></span></div>
                    <div className="t m0 x88 h32 y122 ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _2c"></span></div>
                </div>
                <div className="c x7f y123 w29 h6a">
                    <div className="t m0 x6e h66 y124 ff1b fs9 fc2 sc0 ls0 ws0">Impact metrics<span
                            className="_ _104"></span><span className="ff23"> </span></div>
                </div>
                <div className="c x83 y125 w2a h6b">
                    <div className="t m0 x82 h44 y126 ff1b fsb fc0 sc0 ls0 ws0">Confidentiality </div>
                    <div className="t m0 x25 h1a y73 ff1b fsb fc0 sc0 ls0 ws0">Impact(C)<span className="ff24 fs9"> </span>
                    </div>
                </div>
                <div className="c x81 y125 w28 h6b">
                    <div className="t m0 x1c h32 y127 ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _4e"></span><span className="_ _4e"></span><span
                            className="_ _4e"></span><span className="_ _105"></span></div>
                </div>
                <div className="c x83 y128 w2a h6c">
                    <div className="t m0 xe h6d y129 ff1b fsb fc0 sc0 ls0 ws0">Integrity Impact(I)<span className="ff24">
                        </span></div>
                </div>
                <div className="c x81 y128 w28 h6c">
                    <div className="t m0 x89 h32 y69 ffd fs1 fc0 sc0 ls0 ws0"><span
                            className="_ _5f"></span><span className="_ _cb"></span><span
                            className="_ _36"></span><span className="_ _4e"></span><span className="_ _76"></span>
                    </div>
                </div>
                <div className="c x83 y123 w2a h6e">
                    <div className="t m0 x20 h42 y4b ff1b fsb fc0 sc0 ls0 ws0">Availability Impact(A)<span
                            className="_ _7a"></span><span className="ffd"></span></div>
                </div>
                <div className="c x81 y123 w28 h6e">
                    <div className="t m0 x27 h32 y12a ffd fs1 fc0 sc0 ls0 ws0"><span className="_ _51"></span><span
                            className="_ _4e"></span><span className="_ _5f"></span><span
                            className="_ _2"></span><span className="_ _4e"></span><span
                            className="_ _5f"></span><span className="_ _2"></span><span className="_ _4e"></span><span
                            className="_ _80"></span></div>
                </div>
                <div className="c x0 y0 w2 h0">
                    <div className="t m0 x8a h1f y12b ff2 fsb fc4 sc0 ls0 ws0"><span className="_ _9a"></span><span
                            className="_ _78"></span><span className="_ _ab"></span><span className="_ _9f"></span><span
                            className="_ _9f"></span><span className="ff1"> <span className="_ _a5"></span><span className="ff2"><span
                                    className="_ _36"></span><span className="_ _2"></span><span
                                    className="_ _4e"></span><span className="_ _5b"></span><span className="ff1 ls1a">3.<span
                                        className="ls0">1 <span className="_ _9c"></span><span className="ff2"><span
                                                className="_ _3f"></span><span className="ff1">
                                                CVSS</span></span></span></span></span></span></div>
                    <div className="t m2 x8b h6f y12b ff2 fs11 fc4 sc0 ls0 ws0"></div>
                    <div className="t m0 x4b h44 y12c ff1b fsb fc0 sc0 ls0 ws0"> </div>
                </div>
            </div>
        </div>
    
    </>

}

export default Pf8 