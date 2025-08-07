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
    "In-Progress": <InProgressContent  />,
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

      <ProjectInfo/>


<ProjcetStates statusComponents={statusComponents}/>
     

    
    </Container>
  );
};

export default DoProject;
