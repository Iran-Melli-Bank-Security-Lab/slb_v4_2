// import { Suspense, lazy, useMemo, useState , useEffect} from "react";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
// import CircularProgress  from "@mui/material/CircularProgress";
// import DescriptionIcon from "@mui/icons-material/Description";
// import FingerprintIcon from "@mui/icons-material/Fingerprint";
// import PeopleIcon from "@mui/icons-material/People";
// import ArticleIcon from "@mui/icons-material/Article";
// import { useNavigate } from "react-router";
// import PersianDateWithTooltip from "../components/dateTime/PersainDate";
// import { generateReportonServer } from "../api/projects/generateReportonServer";
// import { useBaseUrl } from "../hooks/useBaseUrl";

// const DataTable = lazy(() => import("../components/projects/DataTable"));
// const AssignPentester = lazy(
//   () => import("../components/projects/manager_projects/AssignPentester")
// );

// const ManagerProjects = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);

//   const base_url = useBaseUrl() 

//   const navigate = useNavigate()

//   // Preload AssignPentester on mount
//   useEffect(() => {
//     import("../components/projects/manager_projects/AssignPentester");
//   }, []);

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedProject(null);
//   };

//   const handleOpenModal = (project) => {
//     console.log("row content : ", project);
//     setSelectedProject(project);
//     setOpenModal(true);
//   };

//   const handleGenerateReport = (project) => {

//     console.log("project row in line 39 : " , project)
//    generateReportonServer(`${base_url}/users/reports/${project._id}` , project._id )
//   //  generateReportonServer(`${base_url}/managing` , project._id )

//     // navigate('/userreports', { state: { project } });

//   };

//   const handleViewIdentifier = (projectId) => {
//     window.open(`/projects/${projectId}/info`, "_blank");
//   };

//   const handleViewReports = (projectId) => {
//     console.log("row in line 46 : " , projectId )
//     window.open(`/project/${projectId._id }/reports`, "_blank");
//   };

//   const columns = useMemo(() => [
//     {
//       id: "projectName",
//       label: "Project Name",
//       sortable: true,
//     },
//     {
//       id: "assign",
//       label: "Assign",
//       sortable: false,
//       render: (row) => (
//         <Button
//           variant="outlined"
//           size="small"
//           startIcon={<PeopleIcon />}
//           onClick={() => handleOpenModal(row)}
//           sx={{ textTransform: "none" }}
//         >
//           Pentesters
//         </Button>
//       ),
//     },
//     // {
//     //   id: "identifier",
//     //   label: "Identifier",
//     //   sortable: false,
//     //   render: (row) => (
//     //     <Tooltip title="View project identifier">
//     //       <IconButton
//     //         onClick={() => handleViewIdentifier(row.id)}
//     //         color="primary"
//     //       >
//     //         <FingerprintIcon />
//     //       </IconButton>
//     //     </Tooltip>
//     //   ),
//     // },
//     {
//       id: "generateReport",
//       label: "Generate Report",
//       sortable: false,
//       render: (row) => (
//         <Button
//           variant="contained"
//           size="small"
//           startIcon={<DescriptionIcon />}
//           onClick={() => handleGenerateReport(row)}
//           sx={{ textTransform: "none" }}
//         >
//           Generate
//         </Button>
//       ),
//     },
//     {
//       id: "viewReports",
//       label: "Reports",
//       sortable: false,
//       render: (row) => (
//         <Tooltip title="View project reports">
//           <IconButton
//             onClick={() => handleViewReports(row)}
//             color="primary"
//           >
//             <ArticleIcon />
//           </IconButton>
//         </Tooltip>
//       ),
//     },
//     { id: "version", label: "Version", sortable: true },
//     { id: "created_date", label: "Created At", sortable: true , 
//        render: (row) =>
//       row?.created_date ? 
//       <PersianDateWithTooltip tooltipFormat = 'jD jMMMM jYYYY' date={row?.created_date} /> : console.log(row.created_date),


//     },
//   ]);

//   return (
//     <>
//       <Suspense fallback={<CircularProgress size={24} />}>
//         <DataTable
//           columns={columns}
//           fetchUserType="manager"
//           title="Manager Projects"
//         />
//       </Suspense>

//       {/* render your modal here */}

//       {openModal && (
//         <Suspense fallback={<CircularProgress size={24} />}>
//           <AssignPentester
//             open={openModal}
//             onClose={handleCloseModal}
//             project={selectedProject}
//           />
//         </Suspense>
//       )}
//     </>
//   );
// };

// export default ManagerProjects;

import { Suspense, lazy, useMemo, useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import {
  Description,
  People,
  Article,
  Download,
  Visibility
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import PersianDateWithTooltip from "../components/dateTime/PersainDate";
import { generateReportonServer } from "../api/projects/generateReportonServer";
import { useBaseUrl } from "../hooks/useBaseUrl";

const DataTable = lazy(() => import("../components/projects/DataTable"));
const AssignPentester = lazy(
  () => import("../components/projects/manager_projects/AssignPentester")
);

const ManagerProjects = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const base_url = useBaseUrl();
  const navigate = useNavigate();

  // Preload AssignPentester component on mount
  useEffect(() => {
    import("../components/projects/manager_projects/AssignPentester");
  }, []);

  // Handlers for Assign Pentester modal
  const openAssignModal = (project) => {
    setSelectedProject(project);
    setAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedProject(null);
  };

  // Handlers for Report dialog
  const openReportDialog = (project) => {
    setSelectedProject(project);
    setReportDialogOpen(true);
  };

  const closeReportDialog = () => {
    setReportDialogOpen(false);
    setSelectedProject(null);
  };

  const handleDownloadReport = async () => {
    if (!selectedProject) return;

    try {
      setReportLoading(true); // دکمه وارد حالت loading میشه

      // فرض می‌کنیم generateReportonServer یک Promise برمی‌گردونه
      await generateReportonServer(
        `${base_url}/users/reports/${selectedProject._id}`,
        selectedProject._id
      );

      // بعد از اتمام دانلود مودال بسته میشه
      closeReportDialog();
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setReportLoading(false);
    }
  };



  // const handleDownloadReport = () => {
  //   if (selectedProject) {
  //     generateReportonServer(
  //       `${base_url}/users/reports/${selectedProject._id}`,
  //       selectedProject._id
  //     );
  //     closeReportDialog();
  //   }
  // };

  const handleViewReport = () => {
    if (selectedProject) {
      navigate('/userreports', { state: { project: selectedProject } });
      closeReportDialog();
    }
  };

  // Handler for viewing project reports
  const handleViewReports = (project) => {
    window.open(`/project/${project._id}/reports`, "_blank");
  };

  // Table columns configuration
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
          startIcon={<People />}
          onClick={() => openAssignModal(row)}
          sx={{ textTransform: "none" }}
        >
          Pentesters
        </Button>
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
          startIcon={<Description />}
          onClick={() => openReportDialog(row)}
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
            <Article />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      id: "version",
      label: "Version",
      sortable: true
    },
    {
      id: "created_date",
      label: "Created At",
      sortable: true,
      render: (row) =>
        row?.created_date ? (
          <PersianDateWithTooltip
            tooltipFormat='jD jMMMM jYYYY'
            date={row.created_date}
          />
        ) : null,
    },
  ], []);

  return (
    <>
      {/* Main Data Table */}
      <Suspense fallback={<CircularProgress size={24} />}>
        <DataTable
          columns={columns}
          fetchUserType="manager"
          title="Manager Projects"
        />
      </Suspense>

      {/* Assign Pentester Modal */}
      {assignModalOpen && (
        <Suspense fallback={<CircularProgress size={24} />}>
          <AssignPentester
            open={assignModalOpen}
            onClose={closeAssignModal}
            project={selectedProject}
          />
        </Suspense>
      )}

      {/* Report Options Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={closeReportDialog}
        aria-labelledby="report-dialog-title"
        aria-describedby="report-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="report-dialog-title">
          Report Options
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="report-dialog-description">
            Choose how you would like to access the report for{" "}
            <strong>{selectedProject?.projectName}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: "center",
          gap: 2,
          pb: 3,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Visibility />}
            onClick={handleViewReport}
            sx={{
              textTransform: "none",
              minWidth: 160
            }}
          >
            View Report
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={reportLoading ? <CircularProgress size={20} /> : <Download />}
            onClick={handleDownloadReport}
            sx={{
              textTransform: "none",
              minWidth: 160
            }}
            disabled={reportLoading} // دکمه هنگام لودینگ غیرفعال شود
          >
            {reportLoading ? "Downloading..." : "Download Report"}
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManagerProjects;