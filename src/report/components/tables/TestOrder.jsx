
function TestOrder({children}){
    return <>
     <tr style={{ height: '18pt' }}>
                    <td
                        style={{
                            width: '248pt',
                            borderTopStyle: 'solid',
                            borderTopWidth: '5pt',
                            borderTopColor: '#00AF50'
                        }}
                        colSpan="4"
                        bgcolor="#006FC0"
                    >
                        <p
                            className="s5"
                            style={{
                                paddingLeft: '78pt',
                                paddingRight: '78pt',
                                textIndent: '0pt',
                                lineHeight: '17pt',
                                textAlign: 'center'
                            }}
                        >
                            آزمون های انجام گرفته
                        </p>
                    </td>
                    <td
                        style={{
                            width: '186pt',
                            borderTopStyle: 'solid',
                            borderTopWidth: '5pt',
                            borderTopColor: '#00AF50'
                        }}
                        bgcolor="#006FC0"
                    >
                        <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
                    </td>
                </tr>
                <tr style={{ height: '25pt' }}>
                    <td style={{ width: '70pt' }} bgcolor="#D7D7D7">
                        <p
                            className="s15 cff6"
                            style={{
                                paddingLeft: '6pt',
                                paddingRight: '4pt',
                                textIndent: '0pt',
                                lineHeight: '18pt',
                                textAlign: 'center'
                            }}
                        >
                            آزمون مرتبه چهارم
                        </p>
                    
                    </td>
                    <td style={{ width: '53pt' }} bgcolor="#D7D7D7">
                        <p
                            className="s15 cff6"
                            style={{
                                paddingLeft: '4pt',
                                paddingRight: '4pt',
                                textIndent: '0pt',
                                lineHeight: '18pt',
                                textAlign: 'center'
                            }}
                        >
                            آزمون مرتبه سوم
                        </p>
                       
                    </td>
                    <td style={{ width: '65pt' }} bgcolor="#D7D7D7">
                        <p
                            className="s15 cff6"
                            style={{
                                paddingLeft: '4pt',
                                paddingRight: '5pt',
                                textIndent: '0pt',
                                lineHeight: '18pt',
                                textAlign: 'center'
                            }}
                        >
                         آزمون مرتبه دوم
                        </p>
                        
                    </td>
                    <td style={{ width: '64pt' }} bgcolor="#D7D7D7">
                        <p
                            className="s15 cff6"
                            style={{
                                paddingLeft: '5pt',
                                paddingRight: '4pt',
                                textIndent: '0pt',
                                lineHeight: '18pt',
                                textAlign: 'center'
                            }}
                        >
                            آزمون مرتبه اول
                        </p>
                       
                    </td>
                    <td style={{ width: '186pt' }} bgcolor="#006FC0">
                        <p style={{ textIndent: '0pt', textAlign: 'left' }}></p>
                        <p
                            className="s3"
                            style={{
                                paddingLeft: '17pt',
                                paddingRight: '16pt',
                                textIndent: '0pt',
                                lineHeight: '20pt',
                                textAlign: 'center'
                            }}
                        >

                            {children}
                        </p>
                    </td>
                </tr>
    </>
}

export default TestOrder 