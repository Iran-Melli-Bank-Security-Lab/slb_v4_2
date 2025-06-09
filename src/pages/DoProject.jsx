import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Container,
} from "@mui/material";

import { useParams } from "react-router";
import OpenStatusContent from "../components/doProject/OpenStatusContent";
import InProgressContent from "../components/doProject/InProgressContent";
import PendingStatusContent from "../components/doProject/PendingStatusContent";
import FinishStatusContent from "../components/doProject/FinishStatusContent";
import ProjectInfo from "../components/doProject/projectInfo";
import ProjectStatus from "../components/doProject/projectStatus";


const DoProject = () => {

  const { id } = useParams();
  const [projectStatus, setProjectStatus] = useState("open");
  const [workTime, setWorkTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastStatusChange, setLastStatusChange] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  console.log("re-render ")

  useEffect(() => {
    setLoading(true);
    const savedData = localStorage.getItem(`projectTimeTracking-${id}`);
    if (savedData) {
      const { status, time, entries } = JSON.parse(savedData);
      setProjectStatus(status);
      setWorkTime(time);
      setTimeEntries(entries);
      if (status === "in-progress") {
        setIsTracking(true);
        setLastStatusChange(new Date());
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    const dataToSave = {
      status: projectStatus,
      time: workTime,
      entries: timeEntries,
    };
    localStorage.setItem(
      `projectTimeTracking-${id}`,
      JSON.stringify(dataToSave)
    );
  }, [id, projectStatus, workTime, timeEntries]);

  const handleStatusChange = (newStatus) => {
    const now = new Date();

    if (projectStatus === "in-progress" && lastStatusChange) {
      const duration = Math.floor((now - lastStatusChange) / 1000);
      const newEntry = {
        start: lastStatusChange.toISOString(),
        end: now.toISOString(),
        duration,
        status: "work",
      };
      setTimeEntries((prev) => [...prev, newEntry]);
      setWorkTime((prev) => prev + duration);
    }

    setProjectStatus(newStatus);

    if (newStatus === "in-progress") {
      setIsTracking(true);
      setLastStatusChange(now);
    } else {
      setIsTracking(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const projectData = {
    title: `E-commerce Platform Migration #${id}`,
    description:
      "Migration of legacy e-commerce platform to modern microservices architecture with CI/CD pipeline implementation.",
    startDate: "2023-06-15",
    endDate: "2023-12-20",
    owner: "Jane Smith",
    team: [
      { name: "Alex Johnson", role: "DevOps Engineer", avatar: "AJ", status: "active" },
      { name: "Maria Garcia", role: "Backend Developer", avatar: "MG", status: "active" },
      { name: "Sam Wilson", role: "Frontend Developer", avatar: "SW", status: "active" },
      { name: "Taylor Swift", role: "UI/UX Designer", avatar: "TS", status: "inactive" },
    ],
    technologies: ["AWS", "Kubernetes", "Docker", "Terraform", "React", "Node.js"],
    progress: 65,
    rating: 4.5,
  };

  const devOpsInfo = {
    repoUrl: "https://github.com/company/ecommerce-migration",
    ciTool: "GitHub Actions",
    deploymentTarget: "AWS EKS",
    monitoring: "Prometheus + Grafana",
    logging: "ELK Stack",
  };

  const statusComponents = {
    open: <OpenStatusContent />,
    pending: <PendingStatusContent />,
    "in-progress": <InProgressContent progress={projectData.progress} />,
    finish: <FinishStatusContent />,
  };

  const totalWorkTime = timeEntries.reduce((sum, entry) => sum + entry.duration, 0) +
    (isTracking && lastStatusChange
      ? Math.floor((new Date() - lastStatusChange) / 1000)
      : 0);

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-12 px-4 sm:px-6 lg:px-8">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8 px-4 sm:px-6 lg:px-8">

      <ProjectInfo
        projectData={projectData}
        devOpsInfo={devOpsInfo}

      />


      <ProjectStatus
        projectStatus={projectStatus}
        toggleExpand={toggleExpand}
        expanded={expanded}
        handleStatusChange={handleStatusChange}
        totalWorkTime={totalWorkTime}
        isTracking={isTracking}
        lastStatusChange={lastStatusChange}
        timeEntries={timeEntries}
        openHistoryModal={openHistoryModal}
        setOpenHistoryModal={setOpenHistoryModal}
        statusComponents={statusComponents}
      />

    </Container>
  );
};

export default DoProject;
