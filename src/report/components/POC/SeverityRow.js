
function SeverityRow({Severity , WSTG , Header , Score , rowColor , textColor , fontSize , fontFamily }) {

    return <>


        <tr style={{ height: "76pt" }} >
            <td
                style={{
                    width: "155pt",
                    borderTopStyle: "solid",
                    borderTopWidth: "5pt",
                    borderTopColor: `${rowColor}`,
                }}
                bgcolor={rowColor}
            >
                <p style={{ textIndent: "0pt", textAlign: "left" }}><br /></p>
                <p className="ccs1" style={{ textIndent: "0pt", textAlign: "center" , color:`${textColor}` , fontSize:`${fontSize}pt`}}>
                    {Score}
                </p>
                <p
                    className="ccs1"
                    style={{
                        paddingTop: "12pt",
                        paddingLeft: "20pt",
                        paddingRight: "22pt",
                        textIndent: "0pt",
                        textAlign: "center",
                        color:`${textColor}`, 
                        fontSize:`${fontSize}pt`

                    }}
                >
                    {Severity}
                </p>
            </td>

            <td
                style={{
                    width: "309pt",
                    borderTopStyle: "solid",
                    borderTopWidth: "5pt",
                    borderTopColor: `${rowColor}`,
                }}
                colSpan="4"
                bgcolor="#D9D9D9"
            >
                <p
                    className="ccs3" dir="rtl"
                    style={{

                        paddingLeft: "31pt",
                        paddingRight: "35pt",
                        textIndent: "0pt",
                        lineHeight: "14pt",
                        textAlign: "center",
                        direction:"rtl" , 
                        fontSize:"22px", 
                        fontSize:`${fontSize}pt`
                    }}
                >
                   {Header}
                </p>
                <p
                    className="ccs3"
                    style={{
                        paddingLeft: "31pt",
                        paddingRight: "35pt",
                        textIndent: "0pt",
                        textAlign: "center",
                        marginTop:"12px", 
                        fontFamily:"Times New Roman"
                        
                        
                    }}
                >
                    (WSTG-{WSTG})
                </p>
            </td>
        </tr>


    </>
}

export default SeverityRow 