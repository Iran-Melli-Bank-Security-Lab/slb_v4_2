import bga from "../images/bga.png"
import PdfStructure from "./common/PdfStructure"

function Pfa({pageNumber}){

    return <>
    
    <div id="pfa" className="pf w0 h0" data-page-no="a">
            <div className="pc pca w0 h0">
                <PdfStructure src={bga} page={pageNumber}/>
              
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
                </div>
                
                 */}
                
                <div className="c x0 y0 w2 h0">
                    
                    <div className="t m0 x1 h2 y2a ff1 fs0 fc0 sc0 ls0 ws0"> </div>
                    <div className="t m0 x4b h42 y93 ffd fsb fc0 sc0 ls0 ws0"></div>
                    <div className="t m0 x4 h83 y15a ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _ab"></span><span className="ff1 fs0"> <span
                                    className="_ _18"></span><span className="ffd fsc"><span className="_ _2"></span><span
                                        className="_ _4e"></span></span></span></span></div>
                 
                    <div className="t m0 x97 h84 y15b ffd fs12 fc0 sc0 ls0 ws0"></div>
                    <div className="t m0 x98 h34 y15a ffd fsc fc0 sc0 ls0 ws0"><span className="_ _ec"></span><span
                            className="ff2"><span className="_ _99"></span><span className="_ _61"></span><span
                                className="_ _94"></span><span className="_ _81"></span><span className="ls7"><span
                                    className="_ _78"></span><span className="ls24"><span className="_ _25"></span><span
                                        className="ls0"><span className="_ _50"></span><span className="ls1a"><span
                                                className="_ _4"></span><span className="ff1 ls0"> <span
                                                    className="_ _ad"></span><span className="ff2"><span
                                                        className="_ _94"></span><span className="_ _3f"></span><span
                                                        className="ls25"><span className="_ _9d"></span><span
                                                            className="_ _56"></span><span className="ls0"><span
                                                                className="_ _1b"></span><span className="_ _48"></span><span
                                                                className="_ _26"></span><span className="ls7"><span
                                                                    className="_ _a2"></span><span className="ls0"><span
                                                                        className="_ _99"></span><span
                                                                        className="_ _2b"></span><span
                                                                        className="_ _c4"></span><span
                                                                        className="_ _4e"></span><span
                                                                        className="_ _f0"></span><span
                                                                        className="_ _ae"></span><span
                                                                        className="_ _46"></span><span className="ff1">
                                                                    </span></span></span></span></span></span></span></span></span></span></span></span>
                    </div>
                    <div className="t m0 x46 h85 y15c ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _65"></span><span className="ff16">PASS<span
                                    className="_ _24"></span><span className="ffd ls26"><span className="_ _e1"></span><span
                                        className="ff2 ls0"><span className="_ _5e"></span><span className="_ _2"></span><span
                                            className="_ _5f"></span><span className="_ _2"></span><span
                                            className="_ _5f"></span><span className="_ _2"></span><span
                                            className="_ _112"></span><span className="_ _113"></span><span
                                            className="ls7"><span className="_ _114"></span><span
                                                className="ls0"><span
                                                    className="_ _115"></span><span className="ff1">
                                                </span></span></span></span></span></span></span></div>
                    <div className="t m0 x46 h85 y15d ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _116"></span><span className="ff16">FAIL<span
                                    className="_ _49"></span><span className="ffd ls26"><span className="_ _113"></span><span
                                        className="ff2 ls0"><span className="_ _36"></span><span
                                            className="_ _117"></span><span
                                            className="_ _118"></span><span className="ls7"><span className="_ _119"></span><span
                                                className="ls0"><span
                                                    className="_ _110"></span><span className="ff1">
                                                </span></span></span></span></span></span></span></div>
                    <div className="t m0 x46 h85 y15e ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _ac"></span><span className="ff16">Not <span
                                    className="_ _d1"></span>Acc<span className="_ _2"></span>essible<span
                                    className="_ _f0"></span><span className="ffd"><span className="_ _61"></span><span
                                        className="_ _26"></span><span className="ff2 ls27"><span className="_ _59"></span><span
                                            className="ls0"><span className="_ _11a"></span><span
                                                className="_ _61"></span><span
                                                className="_ _4e"></span><span className="_ _4e"></span><span
                                                className="_ _61"></span><span className="_ _2"></span><span
                                                className="_ _4e"></span><span className="_ _11b"></span><span
                                                className="_ _61"></span><span
                                                className="_ _4e"></span><span
                                                className="_ _5f"></span><span className="_ _61"></span><span
                                                className="_ _2"></span></span></span></span></span></span></div>
                    <div className="t m0 x99 h2 y15f ff2 fs0 fc0 sc0 ls0 ws0">
                        <span className="_ _11c"></span><span className="ff1">
                        </span></div>
                    <div className="t m0 x46 h85 y160 ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _f0"></span><span className="ff16">Not <span
                                    className="_ _11d"></span>Applicable<span className="_ _ac"></span><span className="ffd"><span
                                        className="_ _ec"></span><span className="ff2 ls7"><span className="_ _25"></span><span
                                            className="ls0"><span className="_ _36"></span><span className="_ _36"></span><span
                                                className="_ _11e"></span><span className="_ _61"></span><span
                                                className="_ _36"></span><span className="_ _2"></span><span
                                                className="_ _f9"></span><span className="_ _36"></span><span
                                                className="_ _36"></span><span className="_ _36"></span><span
                                                className="_ _2"></span><span className="_ _2"></span><span
                                                className="_ _4e"></span><span className="_ _36"></span><span
                                                className="_ _2"></span><span className="_ _61"></span><span
                                                className="_ _b9"></span><span
                                                className="_ _2"></span></span></span></span></span></span></div>
                    <div className="t m0 x9a h2 y161 ff2 fs0 fc0 sc0 ls0 ws0">
                        <span
                            className="_ _11f"></span><span className="ff1"> </span></div>
                    <div className="t m0 x46 h85 y162 ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _10f"></span><span className="ff16">In Progress<span
                                    className="_ _108"></span><span className="ffd ls26"><span className="_ _120"></span><span
                                        className="ff2 ls0"><span className="_ _61"></span><span
                                            className="_ _2"></span><span className="_ _4e"></span><span
                                            className="_ _107"></span></span></span></span></span></div>
                    <div className="t m0 x4 h83 y163 ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _2d"></span><span className="ffd"><span
                                    className="_ _1"></span><span className="_ _c1"></span><span className="ls28"><span
                                        className="_ _81"></span><span className="ls0"></span></span></span></span></div>
                    <div className="t m0 x13 h84 y164 ffd fs12 fc0 sc0 ls29 ws0"></div>
                    <div className="t m0 x9b h5f y163 ffd fsc fc0 sc0 ls0 ws0"><span className="_ _ec"></span><span
                            className="ff2"><span className="_ _9e"></span><span
                                className="_ _121"></span><span className="_ _5e"></span><span
                                className="_ _2"></span><span className="_ _122"></span><span
                                className="_ _5e"></span><span className="_ _123"></span><span
                                className="_ _61"></span><span className="_ _61"></span><span
                                className="_ _61"></span></span></div>
                    <div className="t m0 x9c h34 y165 ff2 fsc fc0 sc0 ls0 ws0"><span
                            className="_ _4e"></span><span className="_ _124"></span><span
                            className="_ _7d"></span><span className="_ _1c"></span><span className="ff1"> </span></div>
                    <div className="t m0 x4 h34 y166 ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _c1"></span><span className="ffd"><span
                                    className="_ _9e"></span><span className="ls2a"><span className="_ _125"></span><span
                                        className="ls0"><span className="_ _22"></span><span className="ls1a"><span
                                                className="_ _126"></span><span className="ff2 ls0"><span
                                                    className="_ _61"></span><span
                                                    className="_ _127"></span><span
                                                    className="_ _128"></span><span
                                                    className="_ _129"></span><span className="ff1">
                                                </span></span></span></span></span></span></span></div>
                    <div className="t m0 x4 h5f y167 ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span
                            className="ffb"> <span className="_ _12a"></span><span className="ffd"><span
                                    className="_ _51"></span><span className="_ _51"></span><span
                                    className="_ _60"></span><span className="ff2"><span
                                        className="_ _12b"></span><span
                                        className="_ _4e"></span><span
                                        className="_ _4e"></span></span></span></span></div>
                    <div className="t m0 x9d h34 y168 ff2 fsc fc0 sc0 ls0 ws0"><span className="_ _1e"></span><span
                            className="_ _4b"></span><span className="_ _a2"></span><span className="ff1"> </span></div>
                    <div className="t m0 x4d h85 y169 ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _bc"></span><span className="ffd"><span
                                    className="_ _2"></span><span className="_ _12c"></span><span
                                    className="ff2 ls7"><span className="_ _12d"></span><span
                                        className="ls0"><span
                                            className="_ _4e"></span><span
                                            className="_ _4e"></span><span className="_ _4e"></span><span
                                            className="_ _12e"></span><span className="ff1"> </span></span></span></span></span>
                    </div>
                    <div className="t m0 x4d h85 y16a ff3 fs0 fc0 sc0 ls0 ws0">-<span className="_ _8d"></span><span
                            className="ff14"> <span className="_ _97"></span><span className="ffd"><span
                                    className="_ _44"></span><span className="_ _4e"></span><span
                                    className="_ _12f"></span><span className="ff2 ls8"><span className="_ _130"></span><span
                                        className="ls0"><span className="_ _61"></span><span
                                            className="_ _5f"></span><span className="_ _2"></span><span
                                            className="_ _4e"></span><span className="_ _36"></span><span
                                            className="_ _36"></span><span className="_ _4e"></span><span
                                            className="_ _36"></span><span className="_ _4e"></span><span
                                            className="_ _36"></span></span></span></span></span></div>
                    <div className="t m0 x9e h2 y16b ff2 fs0 fc0 sc0 ls0 ws0"><span className="_ _4a"></span><span
                            className="ff1"> </span></div>
                    <div className="t m0 x4 h5f yf4 ff21 fsc fc0 sc0 ls0 ws0">•<span className="_ _99"></span><span className="ffb">
                            <span className="_ _7b"></span><span className="ffd"><span className="_ _36"></span><span
                                    className="_ _44"></span><span className="_ _44"></span><span
                                    className="_ _4e"></span><span className="_ _131"></span><span className="ff10 fs9">WAF<span
                                        className="_ _1a"></span><span className="ffd fsc"><span className="_ _ec"></span><span
                                            className="ff2 ls7"><span className="_ _132"></span><span className="ls0"><span
                                                    className="_ _5e"></span><span
                                                    className="_ _51"></span><span
                                                    className="_ _36"></span><span
                                                    className="_ _51"></span><span
                                                    className="_ _36"></span><span className="_ _133"></span><span
                                                    className="ff1 fs9">WAF<span className="_ _4a"></span><span
                                                        className="ff2 fsc ls2b"><span className="_ _b3"></span><span
                                                            className="ls0"><span
                                                                className="_ _36"></span></span></span></span></span></span></span></span></span></span>
                    </div>
                    <div className="t m0 x8c h34 y16c ff2 fsc fc0 sc0 ls0 ws0"><span
                            className="_ _4e"></span><span className="_ _134"></span><span
                            className="ff1"> </span></div>
                    <div className="t m0 x4 h61 y16d ff15 fs9 fc0 sc0 ls2c ws0"><span className="_ _a2"></span><span
                            className="ls23"><span className="_ _135"></span><span className="ls0"><span
                                    className="_ _2"></span><span className="_ _4e"></span><span
                                    className="_ _69"></span><span className="_ _36"></span><span
                                    className="_ _88"></span><span className="ls2d"><span className="_ _37"></span><span
                                        className="ls0"><span className="_ _cd"></span><span
                                            className="_ _69"></span><span className="_ _40"></span><span
                                            className="ls23"><span className="_ _90"></span><span className="ls0"><span
                                                    className="_ _116"></span><span className="_ _30"></span><span
                                                    className="ls2e"><span className="_ _136"></span><span
                                                        className="ls0"><span className="_ _2"></span><span
                                                            className="_ _1f"></span><span className="ff1">Critical<span
                                                                className="_ _63"></span><span className="ff15"><span
                                                                    className="_ _51"></span><span
                                                                    className="_ _22"></span><span
                                                                    className="_ _1c"></span><span className="ff1">High<span
                                                                        className="_ _1c"></span><span
                                                                        className="ff15 ls23"><span
                                                                            className="_ _1b"></span><span
                                                                            className="ls0"><span
                                                                                className="_ _ee"></span><span
                                                                                className="_ _51"></span><span
                                                                                className="_ _3e"></span><span
                                                                                className="_ _ee"></span><span
                                                                                className="ff1">Me<span
                                                                                    className="_ _2"></span>dium<span
                                                                                    className="_ _14"></span><span
                                                                                    className="ff15"><span
                                                                                        className="_ _99"></span><span
                                                                                        className="_ _51"></span><span
                                                                                        className="_ _2"></span><span
                                                                                        className="_ _1c"></span><span
                                                                                        className="ls2f"><span
                                                                                            className="_ _47"></span><span
                                                                                            className="ls0"><span
                                                                                                className="_ _74"></span><span
                                                                                                className="_ _f9"></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>
                    </div>
                    <div className="t m0 x8d h61 y16e ff15 fs9 fc0 sc0 ls0 ws0"><span className="_ _13"></span><span
                            className="ff1">L<span className="_ _2"></span>ow<span className="_ _13"></span><span
                                className="ff15"><span className="_ _ec"></span><span className="ls23"><span
                                        className="_ _13"></span><span className="ls0"><span className="_ _36"></span><span
                                            className="_ _a4"></span><span className="ls2d"><span className="_ _5b"></span><span
                                                className="ls0"><span className="_ _10e"></span><span
                                                    className="ls2d"><span className="_ _31"></span><span className="ls0"><span
                                                            className="_ _2"></span><span className="_ _4e"></span><span
                                                            className="_ _66"></span><span
                                                            className="_ _a8"></span></span></span></span></span></span></span></span></span>
                    </div>
                </div>
                <div className="c x7d y16f w2f h20">
                    <div className="t m0 x9f h22 y69 ffd fsc fc2 sc0 ls0 ws0"><span className="_ _36"></span><span
                            className="_ _137"></span><span className="_ _a4"></span><span className="ls2a"><span
                                className="_ _138"></span><span className="ff10 fs1 ls0">OWASP<span className="_ _2a"></span><span
                                    className="fsc"> </span></span></span></div>
                </div>
                <div className="c xa0 y16f w30 h20">
                    <div className="t m0 xa1 h35 y69 ffd fsc fc2 sc0 ls0 ws0"><span className="_ _37"></span><span
                            className="ff25"> <span className="_ _44"></span><span className="ffd ls2a"><span
                                    className="_ _1c"></span><span className="ls0"><span className="_ _4a"></span><span
                                        className="ls2a"><span className="_ _b3"></span><span className="ff10 fs1 ls0">CVSS<span
                                                className="_ _9e"></span><span className="ffd ls6"><span
                                                    className="_ _ab"></span><span
                                                    className="fsc ls0"></span></span></span></span></span></span></span>
                    </div>
                </div>
                <div className="c x7d y170 w2f h86">
                    <div className="t m0 x91 h34 y6d ffd fsc fc2 sc0 ls0 ws0"><span className="_ _36"></span><span
                            className="_ _94"></span><span className="ff1"> </span></div>
                </div>
                <div className="c xa0 y170 w30 h86">
                    <div className="t m0 x93 h34 y46 ff1 fsc fc2 sc0 ls0 ws0">9.0 - 10<span className="_ _136"></span> </div>
                </div>
                <div className="c x7d y171 w2f h87">
                    <div className="t m0 x91 h34 ye5 ffd fsc fc2 sc0 ls0 ws0"><span className="_ _139"></span><span
                            className="ff1"> </span></div>
                </div>
                <div className="c xa0 y171 w30 h87">
                    <div className="t m0 x85 h22 y71 ff1 fsc fc2 sc0 ls0 ws0">7.0 <span className="ff26">–</span> 8.9<span
                            className="_ _6d"></span><span className="ff10"> </span></div>
                </div>
                <div className="c x7d y172 w2f h88">
                    <div className="t m0 xa2 h34 yec ffd fsc fc0 sc0 ls0 ws0"><span className="_ _57"></span><span
                            className="ff1"> </span></div>
                </div>
                <div className="c xa0 y172 w30 h88">
                    <div className="t m0 x85 h22 y6d ff1 fsc fc0 sc0 ls0 ws0">4.0 <span className="ff26">–</span> 6.9<span
                            className="_ _6d"></span><span className="ff10"> </span></div>
                </div>
                <div className="c x7d y173 w2f h89">
                    <div className="t m0 xa3 h34 y13f ffd fsc fc0 sc0 ls4 ws0"><span className="_ _6e"></span><span
                            className="ls0"><span className="_ _23"></span><span className="ff1"> </span></span></div>
                </div>
                <div className="c xa0 y173 w30 h89">
                    <div className="t m0 x85 h22 y48 ff1 fsc fc0 sc0 ls0 ws0">0.1 <span className="ff26">–</span> 3.9<span
                            className="_ _6d"></span><span className="ff10"> </span></div>
                </div>
                <div className="c x7d y174 w2f h8a">
                    <div className="t m0 x8f h5f ye5 ffd fsc fc0 sc0 ls0 ws0"><span className="_ _b3"></span><span
                            className="ff2"></span></div>
                </div>
                <div className="c xa0 y174 w30 h8a">
                    <div className="t m0 x95 h34 y67 ff1 fsc fc0 sc0 ls0 ws0">0.0<span className="_ _95"></span> </div>
                </div>
                <div className="c x0 y0 w2 h0">
                    <div className="t m0 xa4 h1f y175 ff2 fsb fc4 sc0 ls0 ws0"><span className="_ _9a"></span><span
                            className="_ _ab"></span><span className="_ _19"></span><span
                            className="_ _8c"></span><span className="_ _e4"></span><span className="ff1">CVSS
                            <span className="ls1a">3.</span>1<span className="_ _138"></span><span className="ff2 ls30"><span
                                    className="_ _6"></span><span className="ff1 ls0"> </span></span></span></div>
                    <div className="t m0 x2 h4 y176 ff2 fs1 fc0 sc0 ls0 ws0"></div>
                </div>
            </div>
            <div className="pi" data-data='{"ctm":[1.500000,0.000000,0.000000,1.500000,0.000000,0.000000]}'></div>
        </div>
    </>

}
export default Pfa 