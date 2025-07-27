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
import { fetchProjectByUserProjectManager } from "../api/projects/fetchProjectById";
import { useUserId } from "../hooks/useUserId";
import ProjcetStates from "../components/doProject/projectStatus/ProjectStates";


const staticDevOpsInfo = {
  project: "640a1b5e8f4b2a1f9c3d2e5f", // Mock project ID
  pentester: "640a1b5e8f4b2a1f9c3d2e60", // Mock user ID

  platform: "web", // Can be 'web', 'mobile', or 'desktop'

  platformData: {
    web: {
      environmentType: "vm", // OVF, VM, Docker, Production, Development
      accessInfo: {
        address: "app.example.com",
        port: "8080",
        username: "admin",
        password: "securepassword123",
        notes: "Use SSH key for authentication when possible"
      },
      dockerInfo: {
        imageName: "my-web-app:latest",
        containerName: "web-app-prod",
        ports: ["8080:80", "8443:443"],
        volumes: ["/data/app:/var/www/html"],
        envVariables: ["NODE_ENV=production", "DB_HOST=db.example.com"],
        network: "app-network",
        dockerHost: "docker.example.com",
        registry: "registry.example.com",
        auth: {
          username: "docker-user",
          password: "registrypass123"
        }
      }
    }
  },

  endpoints: [
    {
      url: "https://api.example.com",
      isDns: true,
      ip: "192.168.1.100",
      credentials: [
        {
          username: "api-admin",
          password: "api-secret-123"
        },
        {
          username: "readonly-user",
          password: "readonly-pass"
        }
      ],
      technologyStack: {
        frontendLanguage: "JavaScript (React)",
        backendLanguage: "Node.js",
        databases: ["MongoDB", "Redis"],
        frameworks: ["Express", "Socket.io"],
        webServer: "NGINX"
      }
    },
    {
      url: "https://admin.example.com",
      isDns: false,
      ip: "192.168.1.101",
      credentials: [
        {
          username: "admin",
          password: "admin-secure-pass"
        }
      ],
      technologyStack: {
        frontendLanguage: "TypeScript (Angular)",
        backendLanguage: "Java",
        databases: ["PostgreSQL"],
        frameworks: ["Spring Boot"],
        webServer: "Apache Tomcat"
      }
    }
  ],

  technologyStack: {
    web: {
      frontendLanguage: "TypeScript (React)",
      backendLanguage: "Node.js",
      databases: ["MongoDB", "Redis"],
      frameworks: ["Express", "Next.js", "Socket.io"],
      webServer: "NGINX"
    }
  },

  isShared: true
};

// Example usage:
// <DevOpsInfoDisplay devOpsInfo={staticDevOpsInfo} />

const DoProject = () => {

  const userId = useUserId()
  const { id, projectManager } = useParams();
  const [projectStatus, setProjectStatus] = useState("open");
  const [workTime, setWorkTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastStatusChange, setLastStatusChange] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const [userProject, setUserProject] = useState({})

  console.log("re-render **************** : ", id)

  async function getProject() {

    const result = await fetchProjectByUserProjectManager(id, userId, projectManager)

    console.log("fetchProjectByUserProjectManager : ", result)
    setUserProject(result)
  }

  useEffect(() => {
    getProject()
  }, [])



  useEffect(() => {
    setLoading(true);
    const savedData = localStorage.getItem(`projectTimeTracking-${id}`);
    if (savedData) {
      const { status, time, entries } = JSON.parse(savedData);
      console.log("status in line 150 : ", status, time, entries)
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




  const statusComponents = {
    Open: <OpenStatusContent />,
    Pending: <PendingStatusContent />,
    "In-Progress": <InProgressContent progress={0} />,
    Finish: <FinishStatusContent />,
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
        devOpsInfo={staticDevOpsInfo}
      />


<ProjcetStates statusComponents={statusComponents}/>
      {/* <ProjectStatus
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
      /> */}

      {/* <ProjectStatus/> */}

    
    </Container>
  );
};

export default DoProject;
