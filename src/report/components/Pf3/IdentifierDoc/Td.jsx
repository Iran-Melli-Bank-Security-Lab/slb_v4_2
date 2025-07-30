import { fontFamily } from "@mui/system"


function Td({ value, header, bgcolor, className , fontFamily  }) {
    return <>

        <td
            style={{
                width: '256pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
            }}
            colSpan="3"
            bgcolor={bgcolor}
        >
            <p className={className} style={{  paddingTop: '4pt', paddingLeft: '0pt',
                 textIndent: '0pt', textAlign: 'center' , fontSize:"13pt", 
                 fontFamily:`${fontFamily}` }}>
                {value}
            </p>
        </td>
        <td style={{ width: '130pt' }} bgcolor="#006FC0">
            <p
                className="s5identifier"
                style={{
                    paddingLeft: '7pt',
                    paddingRight: '6pt',
                    textIndent: '0pt',
                    lineHeight: '30pt',
                    textAlign: 'center',
                }}
            >
                {header}

            </p>
        </td>

    </>
}


export default Td 
