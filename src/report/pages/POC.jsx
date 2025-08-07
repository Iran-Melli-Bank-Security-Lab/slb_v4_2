import React, { useEffect, useState } from "react";
// import "../components/POC/style.css"
import "../components/POC/poc_style.css"
import bg5 from "../images/bg5.png"
import HeaderPage from "../components/common/Header";
import PocTable from "../components/POC/PocTable";
import PdfStructure from "../components/common/PdfStructure";

const Poc = ({ report, page, rowColor, textColor }) => {
  const [pocUrl, setPocUrl] = useState("")
  useEffect(() => {

    const getAddressOfProject = async () => {

      // const { data } = await axiosPrivate.get(`${serverIp}project/pocurl/${report?.project?._id}`)

      
      // setPocUrl(data?.address)
      setPocUrl("http://pocinpages.ir")
    }

    getAddressOfProject()
  }, [])
  const len = (report?.labelfa?.length + report?.id?.length);
  return (
    <div id="pf13" className="pf w0 h0" data-page-no="13">
      <div className="pc pc13 w0 h0">

        <PdfStructure src={bg5} page={page+1 } />

        <div className="c x0 y0 w2 h0 pocx0">
          <HeaderPage len={len} style={{ marginBottom: '10px' }} report={1} >

            {report.id}-
            {report.labelfa}
          </HeaderPage>

        </div>
        <PocTable textColor={textColor} rowColor={rowColor} report={report} pocUrl={pocUrl} />



      </div>
    </div>
  );
};

export default Poc;
