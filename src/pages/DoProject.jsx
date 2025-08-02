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
      environmentType: "OVF", // OVF, VM, Docker, Production, Development
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
  const [loading, setLoading] = useState(false);



  async function getProject() {

    const result = await fetchProjectByUserProjectManager(id, userId, projectManager)

    console.log("fetchProjectByUserProjectManager : ", result)
    setUserProject(result)
  }


  const statusComponents = {
    Open: <OpenStatusContent />,
    Pending: <PendingStatusContent />,
    "In-Progress": <InProgressContent progress={0} />,
    Finish: <FinishStatusContent />,
  };

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
     

      {/* <ProjectStatus/> */}

    
    </Container>
  );
};

export default DoProject;
