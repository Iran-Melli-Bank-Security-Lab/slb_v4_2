
import React from 'react';

function MyTable() {
    return (
        <>
            <table style={{ borderCollapse: 'collapse', marginLeft: '41.775pt'  , backgroundColor:"white"}} cellSpacing="0">
                <tbody>
                    <tr style={{ height: '21pt' }}>
                        <td style={{ width: '463pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: '#F4AE23' , verticalAlign:"middle" }} colSpan="2" bgcolor="#006FC0">
                            <p className="s34" style={{ paddingTop: '3pt', paddingBottom:"3px",  paddingLeft: '180pt', paddingRight: '180pt', textIndent: '0pt' }}>
                                انواع تست نفوذ
                            </p>
                        </td>
                    </tr>
                    <tr style={{ height: '23pt' }}>
                        <td style={{ width: '400pt', borderTopStyle: 'solid', borderTopWidth: '1pt' }} bgcolor="#D7D7D7">
                            <p className="s65" style={{ paddingTop: '7pt', 
                                 textIndent: '0pt', textAlign: 'center',
                                fontFamily : "btitr" , fontSize:"10pt" }}>
                                موارد بررسی شده
                            </p>
                        </td>
                        <td style={{ width: '39pt' }} bgcolor="#006FC0">
                            <p className="s66" style={{ fontFamily : "btitr" , paddingTop: '7pt', textIndent: '0pt', textAlign: 'center' }}>
                                تایید
                            </p>
                        </td>
                    </tr>
                    <tr style={{ height: '19pt' }}>
                        <td style={{ width: '424pt' }}>
                            <p className="s15" style={{fontFamily : "btitr" , paddingTop: '5pt', paddingRight: '4pt', textIndent: '0pt', textAlign: 'right' }}>
                                تست جعبه سیاه

                            </p>
                        </td>
                        <td style={{ width: '39pt' }} bgcolor="#006FC0">
                            <p className="s68" style={{ paddingTop: '3pt', paddingLeft: '14pt', textIndent: '0pt', lineHeight: '15pt', textAlign: 'left' }}>
                            𐄂
                            </p>
                        </td>
                    </tr>
                    <tr style={{ height: '22pt' }}>
                        <td style={{ width: '424pt' }} bgcolor="#D7D7D7">
                            <p className="s15" style={{fontFamily : "btitr" , paddingTop: '6pt', paddingRight: '5pt', textIndent: '0pt', textAlign: 'right' }}>
                                تست جعبه خاکستری
                            </p>
                        </td>
                        <td style={{ width: '39pt' }} bgcolor="#006FC0">
                            <p className="s68" style={{ paddingTop: '4pt', paddingLeft: '13pt', textIndent: '0pt', textAlign: 'left' }}>
                            ✔
                            </p>
                        </td>
                    </tr>
                    <tr style={{ height: '22pt' }}>
                        <td style={{ width: '424pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }}>
                            <p className="s15" style={{fontFamily : "btitr" , paddingTop: '6pt', paddingRight: '5pt', textIndent: '0pt', textAlign: 'right' }}>

                                تست جعبه سفید
                            </p>
                        </td>
                        <td style={{ width: '39pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#006FC0">
                            <p className="s68" style={{ paddingTop: '4pt', paddingLeft: '13pt', textIndent: '0pt', textAlign: 'left' }}>
                            𐄂
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default MyTable;
