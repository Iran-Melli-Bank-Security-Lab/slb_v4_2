import bg5 from "../images/bg5.png";
import { upData } from "../utils/updateData";
import HeaderPage from "./common/Header";
import Discription from "./PF11/Discription";
import MyTable from "./PF13/MyTable";
import PdfStructure from "./common/PdfStructure";
import {  useMemo, useState } from "react";
import { data } from "./PF11/data";
function Pf11({ page, pageNumber }) {
  //   const [updatedData, setUpdatedData] = useState(null);

  console.log("page line 12 in pf11: " , page )
  const updatedData = useMemo(() => upData(data, page), [page]);

  console.log("update one line 25: " , updatedData )


  if ( !updatedData) {
    return <div>Loading...</div>; // Or some loading indicator
  }
  return (
    <>
      <div id="pf11" className="pf w0 h0" data-page-no="11">
        <div className="pc pc11 w0 h0">
          <PdfStructure src={bg5} page={pageNumber.pf11} />

          <div className="c x0 y0 w2 h0">
            <HeaderPage style={{ marginBottom: "10px" }} className="cxd0pf11">
              4.2- آزمون پیکربندی و مدیریت استقرار
            </HeaderPage>

            <Discription />
          </div>
            <MyTable data={updatedData} className="cy291pf11" />

          {/* 3) Only render MyTable when we actually have data */}
          {/* {updatedData ? (
            <MyTable data={updatedData} className="cy291pf11" />
          ) : (
            <p>Loading table…</p>
          )} */}
        </div>
      </div>
    </>
  );
}
export default Pf11;
