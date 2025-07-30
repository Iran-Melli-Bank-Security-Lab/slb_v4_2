

function ImageRow({children , cell , rowColor, textColor }){

    return<>
    
      <tr className="imagerow">

      <td className="tdimage" bgcolor={rowColor}>
                
                <p className="cccs1" style={{color:`${textColor}`}}>
                    {cell}
                </p>

            </td>


                    <td className="tdimage" colSpan="4" >
                        <p className="pimage">
                            <span className="pimage">
                                {/* <img className="img"  alt="image" src={src} /> */}
                                {children}
                            </span>
                        </p>
                    </td>
                </tr>
    
    </>
}

export default ImageRow 