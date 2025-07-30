import React, { useEffect, useState } from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Button from '@mui/material/Button';
import Poc from "./pages/POC";
import MainForm from './MainForm';

const Report = () => {
  const location = useLocation();
  const project = location.state?.project;
  const axiosPrivate = useAxiosPrivate();
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [reports, setReports] = useState([]);
  const [counter, setCounter] = useState(1);
  const [saved, setSaved] = useState(false); // Add this state to track when reports are saved

  useEffect(() => {
    const getfoundedBugs = async () => {
      const { data } = await axiosPrivate.get(`${serverIp}project/getbugs`, {
        params: {
          projectId: location.state?.project._id
        }
      });
      setReports(data);
    };
    getfoundedBugs();
  }, []);

  const sendAllReportsToServer = async () => {
    try {
      console.log("Before register page: ", reports);

      const bugsData = reports.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + 1
      }));

      const dataToSend = {
        project: reports[0]?.project || "",
        projectManager: reports[0]?.projectManager || "",
        bugs: bugsData
      };

      const {data} = await axiosPrivate.post(`${serverIp}project/page`, dataToSend);
      console.log('All reports data saved successfully:', data);
      
      setSaved(true); // Set saved to true to hide reports and button, show MainForm

    } catch (error) {
      console.error('Error saving all reports data:', error);
    } finally {
      window.print();
    }
  };

  const colors = [{severity : "Info" , color:"#00B0F0" } , {severity:"Low" , color:"#FFFF00"}, 
    {severity:"Medium" , color:"#FFC000" } , {severity:"High" ,color:"#FF0000"} , {severity:"Critical" , color:"#C00000"}
  ]
  return (
    <div id='page-container'>
      

       {/* Conditionally render the button only if not saved */}
       {!saved && (
        <Button id="savePage" onClick={sendAllReportsToServer}>Save All Reports</Button>
      )}
      {!saved ? (
        reports && reports.map((report, key) => {
          console.log("report : "  , report ) 

          if(report.severity ==="Info")   
          return <Poc rowColor={colors[0].color} key={report._id} report={report} page={key} />;
          else if (report.severity === "Low"){
            return <Poc rowColor={colors[1].color} key={report._id} report={report} page={key} />;

          }else if (report.severity === "Medium"){
            return <Poc textColor="#000000" rowColor={colors[2].color} key={report._id} report={report} page={key} />;

          }else if (report.severity === "High"){
            return <Poc rowColor={colors[3].color} key={report._id} report={report} page={key} />;

          }else if (report.severity === "Critical"){
            return <Poc rowColor={colors[4].color} key={report._id} report={report} page={key} />;

          }
        })
      ) : (
        <MainForm report={reports} project={project} count={counter} />
      )}

     
    </div>
  );
};

export default Report;
