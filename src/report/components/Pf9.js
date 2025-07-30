
import bg9 from "../images/bg9.png"
import PdfStructure from "./common/PdfStructure"

function Pf9({pageNumber}){


    return <>
      <div id="pf9" className="pf w0 h0" data-page-no="9">
            <div className="pc pc9 w0 h0">
                
              <PdfStructure src={bg9} page={pageNumber}/>
               
              
                <div className="c x0 y0 w2 h0">
                   
                    <div className="t m0 x1 h2 y2a ff1 fs0 fc0 sc0 ls0 ws0"> </div>
                    <div className="t m0 x4b h44 y12d ff1b fsb fc0 sc0 ls0 ws0"> </div>
                    <div className="t m0 x8c h62 y12e ff15 fs9 fc0 sc0 ls0 ws0"><span
                            className="_ _2"></span><span className="_ _4e"></span><span
                            className="_ _2"></span><span className="_ _ed"></span></div>
                    <div className="t m0 x8d h70 y12f ff15 fsa fc0 sc0 ls0 ws0"></div>
                </div>
                <div className="c x78 y130 w2b h71">
                    <div className="t m0 x60 h64 yca ff6 fs9 fc2 sc0 ls0 ws0"><span className="_ _1d"></span>کلاس<span
                            className="_ _4a"></span></div>
                </div>

                <div className="c x8e y130 w2b h71">
                    <div className="t m0 x2f h64 yca ff6 fs9 fc2 sc0 ls0 ws0">نام پارامتر<span className="_ _6c"></span></div>
                </div>

                <div className="c x3 y130 w2c h71">
                    <div className="t m0 x8f h64 yca ff6 fs9 fc2 sc0 ls0 ws0"><span className="_ _1d"></span>مقادیر ممکن<span
                            className="_ _42"></span></div>
                </div>
                <div className="c x78 y131 w2d h72">
                    <div className="t m0 x82 h13 y132 ff1b fs9 fc2 sc0 ls0 ws0">Exploitability Metric<span
                            className="_ _2"></span>s<span className="_ _101"></span><span className="ffd"></span></div>
                </div>
                <div className="c x90 y133 w2e h73">
                    <div className="t m0 x10 h13 y134 ff1b fs9 fc0 sc0 ls0 ws0">Attack vector (AV)<span
                            className="_ _106"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y135 w2c h74">
                    <div className="t m0 x8 h42 y46 ff1b fsb fc0 sc0 ls0 ws0">Network (AV:N)<span className="_ _3d"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y136 w2c h75">
                    <div className="t m0 x12 h42 y1c ff1b fsb fc0 sc0 ls0 ws0">Adjacent Network (AV:A)<span
                            className="_ _107"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y137 w2c h74">
                    <div className="t m0 x91 h42 y46 ff1b fsb fc0 sc0 ls0 ws0">Local (AV:L)<span className="_ _108"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y133 w2c h76">
                    <div className="t m0 x85 h42 y1c ff1b fsb fc0 sc0 ls0 ws0">Physical (AV:P)<span
                            className="_ _8"></span><span className="ffd"></span></div>
                </div>
                <div className="c x90 y138 w2e h77">
                    <div className="t m0 xe h1a y139 ff1b fs9 fc0 sc0 ls0 ws0">Attack Complexity (AC)<span
                            className="_ _2"></span><span className="ff24"> </span></div>
                </div>
                <div className="c x3 y13a w2c h2f">
                    <div className="t m0 x14 h42 y4b ff1b fsb fc0 sc0 ls0 ws0">Low (AC:L)<span className="_ _cd"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y138 w2c h78">
                    <div className="t m0 x91 h42 y13b ff1b fsb fc0 sc0 ls0 ws0">High (AC:H)<span className="_ _e6"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x90 y13c w2e h79">
                    <div className="t m0 x27 h13 y13d ff1b fs9 fc0 sc0 ls0 ws0">Privileges Required (P<span
                            className="_ _2"></span>R)<span className="_ _109"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y13e w2c h1c">
                    <div className="t m0 xb h42 y13f ff1b fsb fc0 sc0 ls0 ws0">None (PR:N)<span className="_ _10a"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y140 w2c h7a">
                    <div className="t m0 x14 h42 y1e ff1b fsb fc0 sc0 ls0 ws0">Low (PR:L)<span className="_ _42"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y13c w2c h75">
                    <div className="t m0 x91 h42 y1c ff1b fsb fc0 sc0 ls0 ws0">High (PR:H)<span className="_ _108"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x90 y141 w2e h7b">
                    <div className="t m0 x82 h13 y142 ff1b fs9 fc0 sc0 ls0 ws0">User Interaction (UI<span
                            className="_ _2"></span>)<span className="_ _10b"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y143 w2c h7c">
                    <div className="t m0 x91 h42 y46 ff1b fsb fc0 sc0 ls0 ws0">None (UI:N)<span className="_ _e5"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y141 w2c h33">
                    <div className="t m0 x23 h42 y1c ff1b fsb fc0 sc0 ls0 ws0">Required (UI:R)<span
                            className="_ _ac"></span><span className="ffd"></span></div>
                </div>
                <div className="c x90 y131 w2e h7d">
                    <div className="t m0 x15 h13 y19 ff1b fs9 fc0 sc0 ls0 ws0">Scope (S)<span className="_ _3a"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y144 w2c h76">
                    <div className="t m0 x92 h42 y145 ff1b fsb fc0 sc0 ls0 ws0">Unchanged (S:U)<span
                            className="_ _104"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y131 w2c h74">
                    <div className="t m0 x93 h42 y46 ff1b fsb fc0 sc0 ls0 ws0">Changed (S:C)<span className="_ _6b"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x78 y146 w2d h7e">
                    <div className="t m0 x94 h66 y147 ff1b fs9 fc2 sc0 ls0 ws0"> </div>
                    <div className="t m0 x92 h66 y148 ff1b fs9 fc2 sc0 ls0 ws0">Impact metrics<span className="_ _e1"></span>
                    </div>
                    <div className="t m0 x94 h66 y149 ff1b fs9 fc2 sc0 ls0 ws0"> </div>
                    <div className="t m0 x94 h13 y14a ffd fs9 fc2 sc0 ls0 ws0"></div>
                </div>
                <div className="c x90 y14b w2e h7f">
                    <div className="t m0 x6a h13 y13d ff1b fs9 fc0 sc0 ls0 ws0">Confidentiality Impact (C<span
                            className="_ _2"></span>)<span className="_ _d3"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y14c w2c h80">
                    <div className="t m0 x15 h42 y1c ff1b fsb fc0 sc0 ls0 ws0">None (C:N)<span className="_ _d"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y14d w2c h7c">
                    <div className="t m0 x95 h42 y4b ff1b fsb fc0 sc0 ls0 ws0">Low (C:L)<span className="_ _10c"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y14b w2c h75">
                    <div className="t m0 x14 h42 y1c ff1b fsb fc0 sc0 ls0 ws0">High (C:H)<span className="_ _42"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x90 y14e w2e h79">
                    <div className="t m0 x1c h13 y14f ff1b fs9 fc0 sc0 ls0 ws0">Integrity Impact (I)<span
                            className="_ _10d"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y150 w2c h81">
                    <div className="t m0 x14 h42 y1e ff1b fsb fc0 sc0 ls0 ws0">None (I:N)<span className="_ _3a"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y151 w2c h1c">
                    <div className="t m0 x2f h42 y13f ff1b fsb fc0 sc0 ls0 ws0">Low (I:L)<span className="_ _6c"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y14e w2c h80">
                    <div className="t m0 x57 h42 y1e ff1b fsb fc0 sc0 ls0 ws0">High (I:H)<span className="_ _10e"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x90 y146 w2e h82">
                    <div className="t m0 x12 h13 y152 ff1b fs9 fc0 sc0 ls0 ws0">Availability Impa<span
                            className="_ _2"></span>ct (A)<span className="_ _b4"></span><span className="ffd"></span></div>
                </div>
                <div className="c x3 y153 w2c h74">
                    <div className="t m0 x15 h42 y46 ff1b fsb fc0 sc0 ls0 ws0">None (A:N)<span className="_ _10f"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y154 w2c h76">
                    <div className="t m0 x57 h42 y155 ff1b fsb fc0 sc0 ls0 ws0">Low (A:L)<span className="_ _5b"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x3 y146 w2c h7c">
                    <div className="t m0 x14 h42 y46 ff1b fsb fc0 sc0 ls0 ws0">High (A:H)<span className="_ _98"></span><span
                            className="ffd"></span></div>
                </div>
                <div className="c x0 y0 w2 h0">
                    <div className="t m0 x96 h1f yab ff2 fsb fc4 sc0 ls0 ws0"><span className="_ _9a"></span><span
                            className="_ _ab"></span><span className="_ _19"></span><span
                            className="_ _110"></span><span
                            className="_ _111"></span><span className="ff1">CVSS 3.1<span className="_ _6c"></span><span
                                className="ff2"></span></span></div>
                    <div className="t m0 x4 h3 y156 ff2 fs0 fc0 sc0 ls0 ws0"></div>
                    <div className="t m0 x4 h4 y157 ff2 fs1 fc0 sc0 ls0 ws0"></div>
                    <div className="t m0 x4 h4 y158 ff2 fs1 fc0 sc0 ls0 ws0"></div>
                    <div className="t m0 x4 h6 y159 ff5 fs1 fc0 sc0 ls0 ws0"> </div>
                </div>
            </div>
        </div>
    
    </>
}

export default Pf9