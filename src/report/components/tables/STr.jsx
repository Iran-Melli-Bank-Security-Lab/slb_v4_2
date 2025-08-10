import SummaryEditableCell from "./SummaryEditableCell"


function STr(props) {

    return <>

        <tr style={{ height: '21pt' }} >

        

            <SummaryEditableCell id={props.id } data={props.data} test4={props.test4} />

            
            <SummaryEditableCell test4={props.test3} />


            <SummaryEditableCell test4={props.test2} />


            <SummaryEditableCell test4={props.test1} />


            <td style={{ width: '186pt' }} bgcolor="#006FC0">
                <p
                    className="s11"
                    style={{
                        paddingTop: '2pt',
                        paddingLeft: '17pt',
                        paddingRight: '16pt',
                        textIndent: '0pt',
                        textAlign: 'center'
                    }}>

                    {props.children}

                </p>
            </td>
        </tr>

    </>
}

export default STr 