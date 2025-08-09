import React, { useEffect, useState } from "react";
import Pf1 from "./components/Pf1";
import Pf2 from "./components/Pf2";
import Pf3 from "./components/Pf3";
import Pf4 from "./components/Pf4";
import Pf5 from "./components/Pf5";
import Pf6 from "./components/Pf6";
import Pf7 from "./components/Pf7";
import Pf8 from "./components/Pf8";
import Pf9 from "./components/Pf9";
import Pf10 from "./components/Pf10";
import Pf11 from "./components/Pf11";
import Pf12 from "./components/Pf12";
import Pf13 from "./components/Pf13";
import Pf14 from "./components/Pf14";
import Pf15 from "./components/Pf15";
import Pf16 from "./components/Pf16";
import Pf17 from "./components/Pf17";
import Pf18 from "./components/Pf18";
import Pf19 from "./components/Pf19";
import Pfa from "./components/Pfa";
import Pfb from "./components/Pfb";
import Pfc from "./components/Pfc";
import Pfd from "./components/Pfd";
import Pfb1 from "./components/Pfb1";
import Pfb2 from "./components/Pfb2";
import Pf1a from "./components/Pf1a";
import Pf1b from "./components/Pf1b";
import Pf1c from "./components/Pf1c";
import Pfe from "./components/Pfe";
import Pff from "./components/Pff";
import Pf3_1 from "./components/Pf3_1";
import PF from "./components/PF/PF";
// import { getPage } from "../api/bugs/getPage";

function MainForm({
  report,
  originalReport,
  project,
  count,
  pageNumbers,
  dataToSend,
}) {
  // const [page, setPage] = useState(null);

  console.log("data to send line 44 : ", dataToSend);

  // useEffect(() => {
  //   const getPagesNumber = async () => {
  //     const result = await getPage(project._id);
  //     console.log("data in line 52 : ", result);
  //     setPage(result || dataToSend);
  //   };
  //   getPagesNumber();
  // }, [project._id]);

  return (
    <>
      {/* <Suspense fallback={<div>Loading...</div>}> */}

  {/* <Pf1 />  */}
    {/* <Pf2 />      */}
    {/* <Pf3 project={project} count={count} pageNumber={1} /> */}
    {/* <Pf3_1 project={project} pageNumber={2} /> */}

    {/* <Pf4 pageNumber={3} org={project.identifier.beneficiaryOffice} projectName={project.projectName} /> */}

    {/* <Pf5 pageNumber={4} pageNumbers={pageNumbers}/> */}
    {/* <Pf6 pageNumber={5} /> */}
    {/* <Pf7 pageNumber={6} />
    <Pf8 pageNumber={7} />
    <Pf9 pageNumber={8} />
    <Pfa pageNumber={9} /> */}

    {/* <Pfb pageNumber={10} originalReport={originalReport} report={report} project={project} /> */}

    {/* <Pfb1 pageNumber={11} page={page} /> */}
    {/* <Pfb1 pageNumber={11} page={dataToSend} /> */}
    {console.log("line 79 in PFb1 : " , dataToSend )}
    {/* <Pfb2 pageNumber={12} page={page} project={project} /> */}
    {/* <Pfb2 pageNumber={12} page={dataToSend} project={project} /> */}

    {/* <Pfc pageNumber={13} /> */}

    <Pfd pageNumber={14} count={project.numberOfTest} data={dataToSend} />
    <Pfe pageNumber={15} count={project.numberOfTest} />
    <Pff pageNumber={16} count={project.numberOfTest} /> 

      {/* <Pf10 page={dataToSend} pageNumber={17} />
      <PF reports={report["4.1"]} pageOffset={17} />

      <Pf11 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.2"]} pageOffset={pageNumbers.pf11} />

      <Pf12 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.3"]} pageOffset={pageNumbers.pf12} />

      <Pf13 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.4"]} pageOffset={pageNumbers.pf13} />

      <Pf14 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.5"]} pageOffset={pageNumbers.pf14} />

      <Pf15 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.6"]} pageOffset={pageNumbers.pf15} />

      <Pf16 page={dataToSend} pageNumber={pageNumbers} />

      <Pf17 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.7"]} pageOffset={pageNumbers.pf17} />

      <Pf18 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.8"]} pageOffset={pageNumbers.pf18} />

      <Pf19 page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.9"]} pageOffset={pageNumbers.pf19} />

      <Pf1a page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.10"]} pageOffset={pageNumbers.pf1a} />

      <Pf1b page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.11"]} pageOffset={pageNumbers.pf1b} />

      <Pf1c page={dataToSend} pageNumber={pageNumbers} />
      <PF reports={report["4.12"]} pageOffset={pageNumbers.pf1c} /> */}

      {/* <Pf1d/> */}

      {/* </Suspense> */}
    </>
  );
}

export default MainForm;
