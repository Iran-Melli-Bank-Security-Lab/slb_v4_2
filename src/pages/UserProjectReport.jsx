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
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
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
  const [showMe, setShowMe] = useState(true);
  const [showOthers, setShowOthers] = useState(true);
  
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
    navigate(`/user/report/${reportId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredReports = reports.filter((report) => {
    const isMe = report?.pentester?._id === userId;
    if (showMe && showOthers) return true;
    if (showMe) return isMe;
    if (showOthers) return !isMe;
    return false;
  });

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
      <Box
        sx={(theme) => ({
          mt: 2,
          mb: 3,
          p: 1.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.18em", fontWeight: 600, color: "text.secondary" }}
          >
            Report Owner
          </Typography>
          <Stack direction="row" spacing={1}>
            <FormControlLabel
              sx={(theme) => ({
                m: 0,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid",
                borderColor: showMe ? "primary.main" : "divider",
                bgcolor: showMe
                  ? alpha(theme.palette.primary.main, 0.12)
                  : alpha(theme.palette.background.paper, 0.6),
                transition: "all 160ms ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: "translateY(-1px)",
                },
                "& .MuiCheckbox-root": { p: 0.5, mr: 0.75 },
                "& .MuiFormControlLabel-label": { fontWeight: 600 },
              })}
              control={
                <Checkbox
                  checked={showMe}
                  onChange={(event) => {
                    setShowMe(event.target.checked);
                    setPage(0);
                  }}
                  icon={<RadioButtonUncheckedRoundedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
                />
              }
              label="Me"
            />
            <FormControlLabel
              sx={(theme) => ({
                m: 0,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid",
                borderColor: showOthers ? "secondary.main" : "divider",
                bgcolor: showOthers
                  ? alpha(theme.palette.secondary.main, 0.12)
                  : alpha(theme.palette.background.paper, 0.6),
                transition: "all 160ms ease",
                "&:hover": {
                  borderColor: "secondary.main",
                  bgcolor: alpha(theme.palette.secondary.main, 0.08),
                  transform: "translateY(-1px)",
                },
                "& .MuiCheckbox-root": { p: 0.5, mr: 0.75 },
                "& .MuiFormControlLabel-label": { fontWeight: 600 },
              })}
              control={
                <Checkbox
                  checked={showOthers}
                  onChange={(event) => {
                    setShowOthers(event.target.checked);
                    setPage(0);
                  }}
                  icon={<RadioButtonUncheckedRoundedIcon fontSize="small" />}
                  checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
                />
              }
              label="Others"
            />
          </Stack>
        </Box>
      </Box>
{console.log("reports line 83 : " , reports)}
      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bug Name</TableCell>
                <TableCell>Pentester</TableCell>

                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((report) => (
                  <TableRow
                    key={report._id}
                    hover
                    onDoubleClick={() => handleRowDoubleClick(report._id)}
                    sx={{ cursor: "pointer" }}
                  >{console.log("line 109 : "  ,report)}
                    {/* <TableCell>{report.pentester.lastName }</TableCell> */}
                    <TableCell>{report.label} </TableCell>
                    <TableCell>{report.pentester?.firstName || 'N/A'} {report.pentester?.lastName || ''}</TableCell>
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
          count={filteredReports.length}
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
