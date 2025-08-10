import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import "./styles/base.min.css";
import "./styles/fancy.min.css";
import "./styles/main-form.css";
import "./index.css";
import "./temp/webReport_files/document.css";
import { useLocation, useParams } from "react-router";
import Button from "@mui/material/Button";
//  import Poc from "./pages/POC";
import MainForm from "./MainForm";
import { calculatePageNumber } from "../utils/calculatePageNumber";
import Pf10 from "./components/Pf10";
import Pf1a from "./components/Pf1a";
import { getAllBugsForReport } from "../api/bugs/getAllBugsForReport";
import { setPage } from "../api/bugs/setPage";
import { getProjectById } from "../api/projects/getProjectById";

const MainReport = () => {
  const location = useLocation();
  const { projectId } = useParams();

  // اگر از navigate با state آمده باشد:
  const initialProject = location.state?.project || null;

  const [project, setProject] = useState(initialProject);
  // const project = location.state?.project;
  console.log("project in main report : ", projectId  , initialProject);
  const [reports, setReports] = useState(null);
  const [counter, setCounter] = useState(1);



 // projectId نهایی که باید باهاش کار کنیم (یا از state یا از params)
  const effectiveProjectId = project?._id || projectId;

  console.log("effective project : " , effectiveProjectId)
  // اگر از state پروژه نداشتیم، با id از URL بگیر
  useEffect(() => {
    const fetchProject = async () => {
      if (!project && projectId) {
    
        console.log("project ******************************************************************************************")
        try {
          const result  = await getProjectById(projectId);
          console.log("result in line 24 getProject : " , result )
          setProject(result);
        } catch (e) {
          console.error("Failed to fetch project by id:", e);
        }
    }
    };
    fetchProject();
  }, [projectId]);


  const [pf10, setPf10] = useState([]);
  const [pf11, setPf11] = useState([]);
  const [pf12, setPf12] = useState([]);
  const [pf13, setPf13] = useState([]);
  const [pf14, setPf14] = useState([]);
  const [pf15, setPf15] = useState([]);
  const [pf16, setPf16] = useState([]);
  const [pf17, setPf17] = useState([]);
  const [pf18, setPf18] = useState([]);
  const [pf19, setPf19] = useState([]);
  const [pf1a, setPf1a] = useState([]);
  const [pf1b, setPf1b] = useState([]);
  const [pf1c, setPf1c] = useState([]);

  const [dataToSend, setDataToSend] = useState(null);
  const [bugsByCategory1, setbugsByCategory1] = useState([]);

  const [pageNumbers, setPageNumbers] = useState({}); // To store page numbers for w41 to w412

  useEffect(() => {

    if (!effectiveProjectId) return;


    const getfoundedBugs = async () => {
      try {
        const result = await getAllBugsForReport(effectiveProjectId);

        console.log("result in line 5000: ", result);
        setReports(result);

        // Separate bugs by their ID prefix
        const bugsByCategory = result.reduce((acc, bug) => {
          const idPrefix = bug.id.split(".").slice(0, 2).join("."); // Extract prefix (e.g., "4.1")
          if (!acc[idPrefix]) {
            acc[idPrefix] = [];
          }
          acc[idPrefix].push(bug);
          return acc;
        }, {});

        setbugsByCategory1(bugsByCategory);
        // Keep the original data

        // Correctly set each category in state
        setPf10(bugsByCategory["4.1"] || []);
        setPf11(bugsByCategory["4.2"] || []);
        setPf12(bugsByCategory["4.3"] || []);
        setPf13(bugsByCategory["4.4"] || []);
        setPf14(bugsByCategory["4.5"] || []);
        setPf15(bugsByCategory["4.6"] || []);
        setPf16(bugsByCategory["4.7"] || []);
        setPf17(bugsByCategory["4.7"] || []);
        setPf18(bugsByCategory["4.8"] || []);
        setPf19(bugsByCategory["4.9"] || []);
        setPf1a(bugsByCategory["4.10"] || []);
        setPf1b(bugsByCategory["4.11"] || []);
        setPf1c(bugsByCategory["4.12"] || []);
      } catch (error) {
        console.error("Error fetching bugs:", error);
      }
    };

    getfoundedBugs();
  }, [effectiveProjectId]);

  useEffect(() => {
    const registerAllWstg = async () => {
      const page = {};
      page.pf10 = 17;

      const Pf10 = pf10.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf10 + 1,
      }));

      console.log("Pf10 pages: ", pf10);

      page.pf11 = calculatePageNumber(Pf10, page.pf10);

      const Pf11 = pf11.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf11 + 1,
      }));
      page.pf12 = calculatePageNumber(Pf11, page.pf11);

      const Pf12 = pf12.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf12 + 1,
      }));
      page.pf13 = calculatePageNumber(Pf12, page.pf12);

      const Pf13 = pf13.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf13 + 1,
      }));
      page.pf14 = calculatePageNumber(Pf13, page.pf13);

      const Pf14 = pf14.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf14 + 1,
      }));
      page.pf15 = calculatePageNumber(Pf14, page.pf14);

      const Pf15 = pf15.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf15 + 1,
      }));
      page.pf16 = calculatePageNumber(Pf15, page.pf15);

      const Pf16 = pf16.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf16 + 2, // remove key
      }));
      // page.pf17 = calculatePageNumber(Pf16, page.pf16) ;

      page.pf17 = page.pf16 + 1;
      const Pf17 = pf17.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf17 + 1,
      }));
      page.pf18 = calculatePageNumber(Pf17, page.pf17);

      const Pf18 = pf18.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf18 + 1,
      }));
      page.pf19 = calculatePageNumber(Pf18, page.pf18);

      const Pf19 = pf19.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf19 + 1,
      }));
      page.pf1a = calculatePageNumber(Pf19, page.pf19);

      const Pf1a = pf1a.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf1a + 1,
      }));
      page.pf1b = calculatePageNumber(Pf1a, page.pf1a);

      const Pf1b = pf1b.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf1b + 1,
      }));
      page.pf1c = calculatePageNumber(Pf1b, page.pf1b);

      const Pf1c = pf1c.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + page.pf1c + 1,
      }));
      page.pf1d = calculatePageNumber(Pf1c, page.pf1c);

      setPageNumbers(page);

      const dataToSend = {
        project: location.state?.project._id || "",
        projectManager: (reports && reports[0]?.projectManager) || "",
        pf10: Pf10,
        pf11: Pf11,
        pf12: Pf12,
        pf13: Pf13,
        pf14: Pf14,
        pf15: Pf15,
        pf16: Pf16,
        pf17: Pf17,
        pf18: Pf18,
        pf19: Pf19,
        pf1a: Pf1a,
        pf1b: Pf1b,
        pf1c: Pf1c,
      };

      setDataToSend(dataToSend);
      try {
        console.log("data to send #####################  : ", dataToSend);
        await setPage(dataToSend);
      } catch (error) {
        console.log(error);
      }
    };

    registerAllWstg();
  }, [reports]);

  return (
    <div id="page-container">
      {/* <Button id="savePage" >Save All Reports</Button> */}

      <MainForm
        originalReport={reports}
        pageNumbers={pageNumbers}
        report={bugsByCategory1}
        project={project}
        count={counter}
        dataToSend={dataToSend}
      />
    </div>
  );
};

export default MainReport;
