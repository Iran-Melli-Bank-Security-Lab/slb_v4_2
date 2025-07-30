


function TdHead({ children, className, bgcolor, width  }) {

    return <>
        <td
            style={{
                width: `${width}pt`,
                borderTopStyle: 'solid',
                borderTopWidth: '5pt',
                borderTopColor: '#F4AE23',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
            }}
            bgcolor={bgcolor}
        >
            <p
                className="s9identifier"
                style={{
                    paddingTop: '4pt',
                    paddingLeft: '9pt',
                    paddingRight: '5pt',
                    textIndent: '0pt',
                    textAlign: 'center',
                   
                }}
            >

                {children}
            </p>
        </td>
    </>

}

export default TdHead