
function TableRow({color ="s53" ,  severity , bugName , cvssScore , page  , bgcolor  }) {


    return <>

        <tr style={{ height: '22pt' }}>
            
            <td
                style={{
                    width: '20pt',
                    borderTopStyle: 'solid',
                    borderTopWidth: '2pt',
                    backgroundColor: `${bgcolor}`,
                }}>

                <p className={color} style={{ paddingTop: '4pt', textIndent: '0pt', textAlign: 'center' 
                    ,fontFamily:"Calibri" , fontSize:"14pt"  }}>{severity}</p>
           
            </td>

            <td
                style={{
                    width: '394pt',
                    borderTopStyle: 'solid',
                    borderTopWidth: '2pt',
                }}

                bgcolor="#FFFFFF">
                <p
                    className="s3311"
                    style={{
                        paddingTop: '4pt',   
                        textIndent: '0pt',
                        textAlign: 'center',
                        fontFamily:"bnazanin", 
                        fontSize:"14pt" , 
                        direction:"rtl"
                    }}
                >
                    {bugName}
                </p>
            </td>
            <td
                style={{
                    width: '35pt',
                    borderTopStyle: 'solid',
                    borderTopWidth: '2pt',
                }}
            >
                <p className="s3311" style={{ paddingTop: '4pt', textIndent: '0pt', textAlign: 'center' , 
                    fontFamily:"bnazanin"
                 }}>
                    {cvssScore }
                </p>
            </td>
            <td
                style={{
                    width: '35pt',
                    borderTopStyle: 'solid',
                    borderTopWidth: '2pt',
                }}
            >
                <p className="s3311" style={{fontFamily:"bnazanin", paddingTop: '4pt', paddingRight: '1pt', textIndent: '0pt', textAlign: 'center' }}>
                    {page}
                </p>
            </td>




        </tr>


    </>
}

export default TableRow 