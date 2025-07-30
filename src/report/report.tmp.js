import React, { useEffect, useState } from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Button from '@mui/material/Button';
import Poc from './pages/POC';
import MainForm from './MainForm';

const Report = () => {
  const location = useLocation();
  const project = location.state?.project;
  const axiosPrivate = useAxiosPrivate();
  const serverIp = process.env.REACT_APP_SERVER_IP;
  const [reports, setReports] = useState([]);
  const [showMainForm, setShowMainForm] = useState(false); // State to toggle between Poc and MainForm

  console.log('project : ', project);

  useEffect(() => {
    const getfoundedBugs = async () => {
      const response = await axiosPrivate.get(`${serverIp}project/getbugs`, {
        params: {
          projectId: location.state?.project._id,
        },
      });
      console.log('response of getBugs : ', response.data);

      setReports(response.data);
    };
    getfoundedBugs();

    // Set up a listener to handle after the print dialog is closed
    const handleAfterPrint = () => {
      console.log('Print dialog closed, now rendering MainForm...');
      setShowMainForm(true); // Switch to MainForm after printing is done
    };

    window.addEventListener('afterprint', handleAfterPrint);

    // Clean up the listener when component unmounts
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const sendAllReportsToServer = async () => {
    try {
      console.log('before register page : ', reports);
      // Prepare an array of bug objects with id, wstg, label, labelfa, and page
      const bugsData = reports.map((report, key) => ({
        id: report.id,
        wstg: report.wstg,
        label: report.label,
        labelfa: report.labelfa,
        cvss: report.CVSS,
        cve: report.CVE,
        page: key + 1,
      }));

      // Assuming the project and projectManager are the same for all reports
      const dataToSend = {
        project: reports[0]?.project || '', // Use project from the first report
        projectManager: reports[0]?.projectManager || '', // Use projectManager from the first report
        bugs: bugsData,
      };

      // Send the whole array in one request to the server
      const response = await axiosPrivate.post(`${serverIp}project/page`, dataToSend);

      console.log('All reports data saved successfully:', response.data);

      // Trigger the print dialog
      window.print();
    } catch (error) {
      console.error('Error saving all reports data:', error);
    } finally {
      // Wait for the print dialog to close before switching to MainForm
      document.getElementById('savePage').style.display = 'none';
    }
  };

  return (
    <>
      <div id='page-container'>
        {!showMainForm ? (
          // Show Poc components when showMainForm is false
          reports &&
          reports.map((report, key) => {
            console.log('report in report file : ', report._id, key);
            return <Poc key={report._id} report={report} page={key} />;
          })
        ) : (
          // Show MainForm when showMainForm is true
          <MainForm report={reports} project={project} />
        )}
      </div>
      {!showMainForm && (
        <Button id='savePage' onClick={sendAllReportsToServer}>
          Save All Reports
        </Button>
      )}
    </>
  );
};

export default Report;
