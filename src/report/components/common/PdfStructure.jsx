import Address from "./Address";
import BackgroundImage from "./BackgroundImage";
import Email from "./Email";
import PageNumber from "./PageNumber";
import PhoneNumber from "./PhoneNumber";

function PdfStructure(props){

    return <>
    
    <BackgroundImage src={props.src} />
                <Email />
                <PhoneNumber />
                <Address />
    
                <PageNumber page={props.page}/>
    </>

    
}

export default PdfStructure 