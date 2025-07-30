import { fontFamily, fontWeight, padding } from "@mui/system"

function TableHeader({children , margintop = 0 , dir="ltr"  , fontFamily="Arial" , textAlign ="center" }){

    return <>
    
                        <p
                            className=""
                           
                            style={{
                               
                                textIndent: "0pt",
                                lineHeight: "14pt",
                                textAlign: `${textAlign}`,
                                marginTop:`${margintop}px`, 
                                direction:`${dir}` , 
                                fontFamily:`${fontFamily}`, 
                                margin:"9px"
                            }}
                        >

                            {children}
                        </p>
                            {/* <p style={{ textIndent: "0pt", textAlign: "left" }}><br /></p> */}

                       

    
    </>
}
export default TableHeader 