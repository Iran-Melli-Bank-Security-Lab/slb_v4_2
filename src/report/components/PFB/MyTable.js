import React from 'react';
import getSeverityCounts from '../../utils/getSeverityCounts';

function MyTable({report , originalReport }) {

    console.log("report in useEffect6 : " , report , originalReport )
    const  {
        Info ,
        Low ,
        Medium ,
        High,
        Critical 
      } = getSeverityCounts(originalReport)


    return (
        <>
            <table style={{ borderCollapse: 'collapse' }} cellSpacing="0">
                <tbody>
                    <tr style={{ height: '28pt' }}>
                        <td style={{ width: '81pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: '#C00000', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#006FC0">
                            <p className="s47p10" style={{fontFamily:"Georgia" ,  paddingTop: '4pt', paddingLeft: '11pt', paddingRight: '16pt', textIndent: '0pt', textAlign: 'center' }}>
                                CRITICAL
                            </p>
                        </td>
                        <td style={{ width: '65pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: '#FF0000', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#006FC0">
                            <p className="s47p10" style={{ paddingTop: '4pt', paddingLeft: '17pt', paddingRight: '19pt', textIndent: '0pt', textAlign: 'center' }}>
                                HIGH
                            </p>
                        </td>
                        <td style={{ width: '85pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: '#FFC000', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#006FC0">
                            <p className="s47p10" style={{ paddingTop: '4pt', paddingLeft: '19pt', paddingRight: '19pt', textIndent: '0pt', textAlign: 'center' }}>
                                MEDIUM
                            </p>
                        </td>
                        <td style={{ width: '70pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: '#FFFF00', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#006FC0">
                            <p className="s47p10" style={{ paddingTop: '4pt', paddingLeft: '19pt', paddingRight: '24pt', textIndent: '0pt', textAlign: 'center' }}>
                                LOW
                            </p>
                        </td>
                        <td style={{ width: '75pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: '#00AFEF', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#006FC0">
                            <p className="s47p10" style={{ paddingTop: '4pt', paddingLeft: '24pt', paddingRight: '24pt', textIndent: '0pt', textAlign: 'center' }}>
                                INFO
                            </p>
                        </td>
                        <td style={{ width: '85pt', borderBottomStyle: 'solid', borderBottomWidth: '2pt' }} bgcolor="#006FC0">
                            <p className="s34p10" style={{ paddingTop: '5pt', paddingLeft: '6pt', paddingRight: '5pt', textIndent: '0pt', textAlign: 'center' }}>
                                نوع آسیب پذیری
                            </p>
                        </td>
                    </tr>
                    <tr style={{ height: '30pt' }}>
                        <td style={{ width: '81pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#D7D7D7">
                            <p className="s12p10" style={{ paddingTop: '5pt', paddingRight: '4pt', textIndent: '0pt', textAlign: 'center' }}>{Critical}</p>
                        </td>
                        <td style={{ width: '65pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#D7D7D7">
                            <p className="s12p10" style={{ paddingTop: '5pt', paddingRight: '1pt', textIndent: '0pt', textAlign: 'center' }}>{High}</p>
                        </td>
                        <td style={{ width: '85pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#D7D7D7">
                            <p className="s12p10" style={{ paddingTop: '5pt', textIndent: '0pt', textAlign: 'center' }}>{Medium}</p>
                        </td>
                        <td style={{ width: '70pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#D7D7D7">
                            <p className="s12p10" style={{ paddingTop: '5pt', paddingRight: '4pt', textIndent: '0pt', textAlign: 'center' }}>{Low}</p>
                        </td>
                        <td style={{ width: '75pt', borderTopStyle: 'solid', borderTopWidth: '1pt', borderBottomStyle: 'solid', borderBottomWidth: '1pt' }} bgcolor="#D7D7D7">
                            <p className="s12p10" style={{ paddingTop: '5pt', textIndent: '0pt', textAlign: 'center' }}>{Info}</p>
                        </td>
                        <td style={{ width: '75pt', borderTopStyle: 'solid', borderTopWidth: '2pt' }} bgcolor="#006FC0">
                            <p className="s34p10" style={{ paddingTop: '6pt', paddingLeft: '6pt', paddingRight: '5pt', textIndent: '0pt', textAlign: 'center' }}>
                                تعداد
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default MyTable;
