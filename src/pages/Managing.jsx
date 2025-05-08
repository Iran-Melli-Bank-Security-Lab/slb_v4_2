import { useMemo, useState } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PeopleIcon from "@mui/icons-material/People";
import DataTable from "../components/projects/DataTable";
import AssignPentester from "../components/projects/manager_projects/AssignPentester";

const ManagerProjects = () => {

  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProject(null);
  };

  const handleOpenModal = (project) => {
    console.log("row content : ", project);
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleGenerateReport = (projectId) => {
    console.log(`Generating report for project ${projectId}`);
  };

  const handleViewIdentifier = (projectId) => {
    window.open(`/projects/${projectId}/info`, "_blank");
  };

  const columns = useMemo (()=> [
    {
      id: "projectName",
      label: "Project Name",
      sortable: true,
    },
    {
      id: "assign",
      label: "Assign",
      sortable: false,
      render: (row) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<PeopleIcon />}
          onClick={() => handleOpenModal(row)}
          sx={{ textTransform: "none" }}
        >
          Pentesters
        </Button>
      ),
    },
    {
      id: "identifier",
      label: "Identifier",
      sortable: false,
      render: (row) => (
        <Tooltip title="View project identifier">
          <IconButton
            onClick={() => handleViewIdentifier(row.id)}
            color="primary"
          >
            <FingerprintIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      id: "generateReport",
      label: "Generate Report",
      sortable: false,
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<DescriptionIcon />}
          onClick={() => handleGenerateReport(row.id)}
          sx={{ textTransform: "none" }}
        >
          Generate
        </Button>
      ),
    },
    { id: "version", label: "Version", sortable: true },
    { id: "created_date", label: "Date", sortable: true },
  ])

  return (
    <>
      <DataTable
        columns={columns}
        fetchUserType="manager"
        title="Manager Projects"
      />

      {/* render your modal here */}

      {openModal && (
        <AssignPentester
          open={openModal}
          onClose={handleCloseModal}
          project={selectedProject}
        />
      )}
    </>
  );
};

export default ManagerProjects;
