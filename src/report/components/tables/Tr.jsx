import EditableCell from "./EditableCell"


function Tr(props) {

    return <>

        <tr style={{ height: '21pt' }} >

            {/* <td style={{ width: '65pt', paddingTop: '5px' }} bgcolor={props.bgcolor} >

                {props.test4 ? <p className="s15" style={{ textAlign: 'center' }}>✔</p> : null}


            </td> */}

            <EditableCell data={props.data} test4={props.test4} />

            {/* <td style={{ width: '64pt', paddingTop: '5px' }} bgcolor={props.bgcolor}>

                {props.test3 ? <p className="s15" style={{ textAlign: 'center' }}>✔</p> : null}

            </td> */}
            <EditableCell test4={props.test3} />


{/* 
            <td style={{ width: '65pt', paddingTop: '5px' }} bgcolor={props.bgcolor}>

                {props.test2 ? <p className="s15" style={{ textAlign: 'center' }}>✔</p> : null}

            </td> */}
            <EditableCell test4={props.test2} />


            {/* <td style={{ width: '64pt', paddingTop: '5px' }} bgcolor={props.bgcolor}>
               
                {props.test1 ? <p className="s15" style={{ textAlign: 'center' }}>✔</p> : null}
           
            </td> */}
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