import bg13 from "../images/bg5.png"
import PdfStructure from "./common/PdfStructure"
import "./PF4/style.css"

function Pf4({projectName ="ایران زمین" , date=" ۱۴۰۳/۱۲/۱۲ " , org="سداد" , pageNumber} ) {

    return <>
        <div id="pf4" className="pf w0 h0" data-page-no="4">
            <div className="pc pc4 w0 h0">
          
            <PdfStructure src={bg13 } page={pageNumber}/>

                <div className=" x0 y0 w2 h0">


                    <p dir="rtl" className="bnazanin1 pf4c pf4x19 pf4h" style={{textAlign:"justify"}}>
                        این مستند،
                        
                         در تاریخ 

                       {/* {' '} {date} {' '} */}
                     {' '}  {'1403/10/03'}{' '}

                         
                         توسط آزمایشگاه امنیت و کیفیت نرم افزار بانک ملی ایران به ‌منظور ارزیابی 
                          
                         {' '} {projectName} {' '}
                          
                          متعلق به  

                      {' '}  {org} {' '}

                            ارائه گردیده و ارزش و اعتبار دیگری ندارد. تمامی حقوق این اثر، متعلق به «آزمایشگاه امنیت و کیفیت نرم افزار بانک ملی ایران» بوده و هرگونه نسخه ‌برداری از آن، شامل رونوشت، نسخه‌ برداری الکترونیکی و یا ترجمه بخش یا تمام آن در گرو کسب اجازه کتبی از صاحب اثر است. همچنین مطالب این مستند بدون اطلاع قبلی به« آزمایشگاه امنیت و کیفیت نرم افزار بانک ملی ایران » غیرقابل تغییر است.


                    </p>



                    <div className="t m0 x3 h3c y86 ff16 fs6 fc0 sc0 ls0 ws0">Copyright </div>
                    <div className="t m0 x3 h3d y87 ff17 fsc fc0 sc0 ls0 ws0">© Copyright 2024<span className="ff18">
                    </span>Corporation </div>
                    <div className="t m0 x3 h3d y88 ff17 fsc fc0 sc0 ls0 ws0">All rights reserved. </div>
                    <div className="t m0 x3 h3d y89 ff17 fsc fc0 sc0 ls0 ws0">Published </div>
                    <div className="t m0 x43 h3d y8a ff17 fsc fc0 sc0 ls0 ws0">This <span className="_ _83"> </span>document
                        <span className="_ _83"> </span>may <span className="_ _83"> </span>not, <span className="_ _83"> </span>in
                        <span className="_ _83"> </span>whole<span className="_ _4e"></span> <span className="_ _83"> </span>or
                        <span className="_ _83"> </span>in <span className="_ _83"> </span>part, <span className="_ _83"> </span>be
                        <span className="_ _83"> </span>copied, <span className="_ _84"> </span>photocopied, <span
                            className="_ _83"> </span>reproduced,
                    </div>
                    <div className="t m0 x3 h3d y8b ff17 fsc fc0 sc0 ls0 ws0">translated, <span className="_ _4e"></span>or
                        <span className="_ _5f"></span>reduced <span className="_ _4e"></span>to <span
                            className="_ _5f"></span>an<span className="_ _2"></span>y <span className="_ _5f"></span>machine-<span
                                className="_ _2"></span>r<span className="_ _4e"></span>eadable <span className="_ _5f"></span>form
                        without <span className="_ _5f"></span>formal <span className="_ _5f"></span>permission. Every <span
                            className="_ _5f"></span>effort
                    </div>
                    <div className="t m0 x3 h3d y8c ff17 fsc fc0 sc0 ls0 ws0">has been made to ensure the acc<span
                        className="_ _4e"></span>uracy of this doc<span className="_ _4e"></span>ument. However, shall not
                        be liable<span className="_ _4e"></span> for any </div>
                    <div className="t m0 x3 h3d y8d ff17 fsc fc0 sc0 ls0 ws0">error or <span className="_ _2"></span>for
                        incidental <span className="_ _2"></span>or consequential d<span className="_ _2"></span>amages<span
                            className="_ _4e"></span> pert<span className="_ _2"></span>i<span className="_ _4e"></span>nent to
                        <span className="_ _2"></span>the form, <span className="_ _2"></span>performance,<span
                            className="_ _4e"></span> or <span className="_ _2"></span>use
                    </div>
                    <div className="t m0 x3 h3d y8e ff17 fsc fc0 sc0 ls0 ws0">of <span className="_ _5f"></span>t<span
                        className="_ _2"></span>his <span className="_ _5f"></span>document <span className="_ _4e"></span>or
                        <span className="_ _5f"></span>the <span className="_ _4e"></span>examples <span
                            className="_ _4e"></span>within. <span className="_ _5f"></span>The in<span
                                className="_ _4e"></span>formation <span className="_ _5f"></span>herein is <span
                                    className="_ _5f"></span>subject <span className="_ _5f"></span>to change <span
                                        className="_ _5f"></span>without
                    </div>
                    <div className="t m0 x3 h3e y8f ff17 fsc fc0 sc0 ls0 ws0">notice to<span className="ff19 fc6">
                    </span>Corporation. </div>
                    <div className="t m0 x49 h3f y90 ff14 fsb fc0 sc0 ls0 ws0"> <span className="_ _46"></span><span
                        className="ffd"></span></div>
                </div>
                <div className="c x0 y91 w2 h40">
                    <div className="t m0 pf4x4a h41 y92 fff fs6 fc0 sc0 ls0 ws0"></div>
                </div>
            </div>
            <div className="pi" data-data='{"ctm":[1.500000,0.000000,0.000000,1.500000,0.000000,0.000000]}'></div>
        </div>


    </>
}

export default Pf4 