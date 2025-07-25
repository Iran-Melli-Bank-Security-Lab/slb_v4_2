import { Suspense, lazy, useMemo, useState , useEffect} from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress  from "@mui/material/CircularProgress";
import DescriptionIcon from "@mui/icons-material/Description";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";

const DataTable = lazy(() => import("../components/projects/DataTable"));
const AssignPentester = lazy(
  () => import("../components/projects/manager_projects/AssignPentester")
);

const ManagerProjects = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);


  // Preload AssignPentester on mount
  useEffect(() => {
    import("../components/projects/manager_projects/AssignPentester");
  }, []);

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

  const handleViewReports = (projectId) => {
    console.log("row in line 46 : " , projectId )
    window.open(`/project/${projectId._id }/reports`, "_blank");
  };

  const columns = useMemo(() => [
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
    {
      id: "viewReports",
      label: "Reports",
      sortable: false,
      render: (row) => (
        <Tooltip title="View project reports">
          <IconButton
            onClick={() => handleViewReports(row)}
            color="primary"
          >
            <ArticleIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    { id: "version", label: "Version", sortable: true },
    { id: "created_date", label: "Date", sortable: true },
  ]);

  return (
    <>
      <Suspense fallback={<CircularProgress size={24} />}>
        <DataTable
          columns={columns}
          fetchUserType="manager"
          title="Manager Projects"
        />
      </Suspense>

      {/* render your modal here */}

      {openModal && (
        <Suspense fallback={<CircularProgress size={24} />}>
          <AssignPentester
            open={openModal}
            onClose={handleCloseModal}
            project={selectedProject}
          />
        </Suspense>
      )}
    </>
  );
};

export default ManagerProjects;
