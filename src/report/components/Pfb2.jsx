
import bgb from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import Discription_2 from "./PFB/Discription_2"
import Gauge from "./Gauge"
import Discription_1 from "./PFB2/Discription_1"
import Discription_3 from "./PFB/Discription_3"
import Discription_4 from "./PFB/Discription_4"
import { useEffect, useState } from "react"
import { truncateToOneDecimal } from "../utils/truncateToOneDecimal"
import { transformObject } from "../utils/transformObject"
// import useAxiosPrivate from "../../hooks/useAxiosPrivate"

function Pfb2({ edarehKol = "بانک ملی ایران", page , project ,pageNumber }) {

    // const axiosPrivate = useAxiosPrivate() 
    // const serverIp = process.env.REACT_APP_SERVER_IP;

    const [risk, setRisk] = useState(0)
    const [pocUrl, setPocUrl] = useState("http://pocurlinPfb2.ir")

    // useEffect(() => {
  
    //   const getAddressOfProject = async () => {
  
    //     const { data } = await axiosPrivate.get(`${serverIp}project/pocurl/${project?._id}`)
  
    //     console.log("Path line 29 : ", data)
    //     setPocUrl(data?.address)
    //   }
  
    //   getAddressOfProject()
    // }, [])

    // const Page  = transformObject(page)
    useEffect(() => {
        page  = transformObject(page)
        const calcRisk = () => {
            let sum = 0;
            let counter = 0;

            // Loop through the bugs array to calculate the sum and count of bugs
            page?.bugs?.forEach( (p) => {
                // console.log(" p in line :  ", parseFloat(p.cvss) , p.cvss )
                sum += parseFloat(p.cvss); // Add the CVSS score to the sum
                counter += 1; // Increment the counter for each bug
            });

           
            // Avoid division by zero
            if (counter > 0) {
                setRisk(sum / counter); // Calculate the average CVSS score
            } else {
                setRisk(0); // Set risk to 0 if there are no bugs
            }
        };

        calcRisk()
    }, [page ])
    return <>

        <div id="pfb" className="pf w0 h0" data-page-no="b">
            <div className="pc pcb w0 h0">
                <PdfStructure src={bgb} page={pageNumber} />


                <div className="c x0 y0 w2 h0">
                    <HeaderPage className="cxd0pfb_ch" y="y229pfb">

                        1.1-نمودار ریسک کلی سامانه
                    </HeaderPage>

                    <Discription_1 risk={truncateToOneDecimal(risk)}/>
                    <div className={`c cw52 cy291pfb_ch  chbb`}>

                        <div style={{ backgroundColor: "white" }}>
                           
                            <Gauge targetValue={risk} severity="LOW" />
                        </div>
                    </div>
                    <HeaderPage className="cxd0pfb_1" y="y229pfb">

                        1.2-شرح کلی از سامانه
                    </HeaderPage>

                    <Discription_2 projectName={project.projectName} address={pocUrl} />


                    <HeaderPage className="cxd0pfb_2" y="y229pfb_1">
                        1.3- نام بهره بردار پروژه
                    </HeaderPage>


                    <Discription_3 edarehKol={project.identifier.employer} />




                    <HeaderPage className="cxd0pfb_3" y="y229pfb_2">

                        2-مفروضات ارزیابی

                    </HeaderPage>
                    <Discription_4 />


                </div>
            </div>
        </div>

    </>
}

export default Pfb2