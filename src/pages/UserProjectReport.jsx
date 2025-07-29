//project report table to show the reports of project to user  
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useUserId } from "../hooks/useUserId";
import {  fetchAllUserReports } from "../api/bugs/fetchAllReports";
import { fetchUserProjectById } from "../api/projects/fetchProjectById";

const UserProjectReport = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const userId  = useUserId()
  
  useEffect(() => {
    // Simulate API call to fetch project and reports
    const fetchData = async () => {
      try {
        // Replace with actual API calls

        const projectResponse = await fetchUserProjectById(projectId , userId  )

        console.log("project response line 41 : " , projectResponse)
        setProject(projectResponse);

        const reportsResponse =  await fetchAllUserReports(projectId  , userId );
        // // const reportsData = await reportsResponse.json();
        // console.log(reportsResponse)
        setReports(reportsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleRowDoubleClick = (reportId) => {
    navigate(`/project/report/${reportId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {console.log("project : line 80 : " , project)}
        {project?.projectName || "Project Reports"}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View all reports for this project
      </Typography>
{console.log("reports line 83 : " , reports)}
      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pentester</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((report) => (
                  <TableRow
                    key={report._id}
                    hover
                    onDoubleClick={() => handleRowDoubleClick(report._id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{report.pentester.lastName }</TableCell>
                    <TableCell>{report.label}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            report.state === "Verified"
                              ? "success.light"
                              : report.state === "New"
                              ? "warning.light"
                              : "error.light",
                          color:
                            report.state === "Completed"
                              ? "success.contrastText"
                              : report.state === "In Progress"
                              ? "warning.contrastText"
                              : "error.contrastText",
                        }}
                      >
                        {report.state}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View report details">
                        <DescriptionIcon
                          color="action"
                          onClick={() => handleRowDoubleClick(report._id)}
                          sx={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default UserProjectReport;