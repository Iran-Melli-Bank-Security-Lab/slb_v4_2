


function Td({ children, className="s5", paddingRight='0px' ,  bgcolor, width = 38 ,  textAlign= 'center' }) {

    return <>

        <td
            style={{
                width: `${width}pt`,
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
            }}
            bgcolor={bgcolor}
        >
            <p
                className={className}
                style={{
                    textIndent: '0pt',
                    lineHeight: '16pt',
                    textAlign: `${textAlign}`,
                    paddingRight:`${paddingRight}`
                }}
            >
                {children}
            </p>


        </td>



    </>

}

export default Td