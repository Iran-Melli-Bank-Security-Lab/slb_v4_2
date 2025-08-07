import { useEffect, useState } from "react";
import bg10 from "../images/bg5.png";
import HeaderPage from "./common/Header";
import PdfStructure from "./common/PdfStructure";
import Discription from "./PF10/discription";
import MyTable from "./PF13/MyTable";
import { data } from "./PF10/data";
import { upData } from "../utils/updateData";

function Pf10({ page, pageNumber = 17 }) {

  const [backColor, setBackColor] = useState("");
  const [updatedData, setUpdatedData] = useState();

  useEffect(() => {
    const result = upData(data, page);
    setUpdatedData(result);
    console.log("updated Data in useEffect: ", result);
  }, [page]);

  console.log("updated Data in line 19 :  ", updatedData);

  return (
    <>
      <div id="pf10" className="pf w0 h0" data-page-no="10">
        <div className="pc pc10 w0 h0">
          <PdfStructure src={bg10} page={pageNumber} />

          <div className="c x0 y0 w2 h0">
            <HeaderPage className="cxd0pf10">
              4.1- آزمون جمع‌آوری اطلاعات (بند 10 - 15408)
            </HeaderPage>

            <Discription />
          </div>

          <MyTable backColor={backColor} data={updatedData} className="cy291pf10"/>
        </div>
      </div>
    </>
  );
}

export default Pf10;
