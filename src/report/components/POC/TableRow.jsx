

function TableRow({ children, height=20, cell , bgcolor="" ,rowColor , textColor , fontSize  }) {

    return <>
        <tr style={{ height: `${height}pt`  }}>
           
            <td bgcolor={rowColor}>
            {/* <p style={{ textIndent: "0pt", textAlign: "left" }}><br /></p> */}
              
                <p
                    className="cccs1"
                  style={{color:`${textColor}`  , fontSize:`${fontSize}pt`}}
                >
                    {cell}
                </p>
                {/* <p style={{ textIndent: "0pt", textAlign: "left" }}><br /></p> */}
            </td>

            <td
                
                colSpan="1"
                bgcolor={bgcolor}
            >
                {children}
            </td>
        </tr>


    </>
}

export default TableRow 