import EditableCell from "./EditableCell"


function Tr(props) {

    return <>

        <tr style={{ height: '21pt' }} >

        

            <EditableCell label={props.label } data={props.data} test4={props.test4} />

            
            <EditableCell test4={props.test3} />


            <EditableCell test4={props.test2} />


            <EditableCell test4={props.test1} />


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

export default Tr 