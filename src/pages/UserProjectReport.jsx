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
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import moment from "moment-jalaali";
import { useUserId } from "../hooks/useUserId";
import {  fetchAllUserReports } from "../api/bugs/fetchAllReports";
import { fetchUserProjectById } from "../api/projects/fetchProjectById";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return `${API_BASE_URL}/${imagePath}`;
};

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

  const getStatusPalette = (status) => {
    switch (status) {
      case "Verified":
      case "Completed":
        return "success";
      case "New":
        return "info";
      case "Verify":
        return "success";
      case "In Progress":
      case "Pending":
        return "warning";
      case "Rejected":
      case "Failed":
      case "Error":
        return "error";
      default:
        return "error";
    }
  };

  const getSeverityTone = (severity) => {
    const key = severity?.toLowerCase();
    if (key === "critical") {
      return { palette: "error", intensity: 0.18, accent: 0.7 };
    }
    if (key === "high") {
      return { palette: "error", intensity: 0.12, accent: 0.5 };
    }
    if (key === "medium") {
      return { palette: "warning", intensity: 0.1, accent: 0.5 };
    }
    if (key === "low") {
      return { palette: "success", intensity: 0.08, accent: 0.4 };
    }
    return { palette: "info", intensity: 0.06, accent: 0.35 };
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
                <TableCell>Created At</TableCell>
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
                    sx={(theme) => {
                      const { palette, intensity, accent } = getSeverityTone(
                        report.severity
                      );
                      const tone = theme.palette[palette].main;
                      return {
                        cursor: "pointer",
                        background: `linear-gradient(90deg, ${alpha(
                          tone,
                          intensity
                        )} 0%, ${alpha(tone, 0)} 55%)`,
                        boxShadow: `inset 4px 0 0 ${alpha(tone, accent)}`,
                        transition: "background-color 150ms ease",
                        "&:hover": {
                          backgroundColor: alpha(tone, intensity + 0.06),
                        },
                      };
                    }}
                  >{console.log("line 109 : "  ,report)}
                    {/* <TableCell>{report.pentester.lastName }</TableCell> */}
                    <TableCell>
                      {(() => {
                        const label = report.label || "—";
                        const metaParts = [];
                        if (report.id) metaParts.push(`ID: ${report.id}`);
                        if (report.wstg) metaParts.push(report.wstg);
                        const metaLine = metaParts.join(" • ");

                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={(theme) => ({
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: `linear-gradient(135deg, ${alpha(
                                  theme.palette.primary.light,
                                  0.2
                                )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                                border: "1px solid",
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                color: theme.palette.primary.main,
                              })}
                            >
                              <BugReportRoundedIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: "text.primary" }}
                              >
                                {label}
                              </Typography>
                              {metaLine && (
                                <Typography variant="caption" color="text.secondary">
                                  {metaLine}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const pentester = report.pentester;
                        const firstName = pentester?.firstName || "";
                        const lastName = pentester?.lastName || "";
                        const fullName = `${firstName} ${lastName}`.trim();
                        const initials = `${firstName.trim().charAt(0)}${lastName
                          .trim()
                          .charAt(0)}`.trim();
                        const profileUrl = getProfileImageUrl(
                          pentester?.profileImageUrl
                        );
                        const shortId = pentester?._id
                          ? `${pentester._id.slice(0, 6)}...${pentester._id.slice(-4)}`
                          : null;
                        const isMe = pentester?._id === userId;

                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              src={profileUrl || undefined}
                              sx={(theme) => ({
                                width: 36,
                                height: 36,
                                border: "1px solid",
                                borderColor: alpha(theme.palette.secondary.main, 0.3),
                                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                                color: theme.palette.secondary.dark,
                                fontWeight: 700,
                                fontSize: "0.8rem",
                              })}
                            >
                              {initials || <PersonRoundedIcon sx={{ fontSize: 18 }} />}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: "text.primary" }}
                              >
                                {fullName || "N/A"}
                              </Typography>
                              {(shortId || isMe) && (
                                <Typography variant="caption" color="text.secondary">
                                  {isMe ? "Me" : "Pentester"}
                                  {shortId ? ` • ${shortId}` : ""}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const statusPalette = getStatusPalette(report.state);
                        return (
                      <Box
                        sx={(theme) => ({
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 1.5,
                          py: 0.6,
                          borderRadius: 999,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                          border: "1px solid",
                          borderColor: alpha(
                            theme.palette[statusPalette].main,
                            0.4
                          ),
                          color: theme.palette[statusPalette].dark,
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette[statusPalette].light,
                            0.6
                          )} 0%, ${alpha(
                            theme.palette[statusPalette].main,
                            0.12
                          )} 100%)`,
                          boxShadow: `0 8px 18px ${alpha(
                            theme.palette[statusPalette].main,
                            0.16
                          )}`,
                          "&::before": {
                            content: '""',
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: theme.palette[statusPalette].main,
                            boxShadow: `0 0 0 3px ${alpha(
                              theme.palette[statusPalette].main,
                              0.18
                            )}`,
                          },
                        })}
                      >
                        {report.state || "Unknown"}
                      </Box>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        if (!report.created_at) {
                          return (
                            <Typography variant="caption" color="text.secondary">
                              N/A
                            </Typography>
                          );
                        }

                        const createdAt = moment(report.created_at);
                        if (!createdAt.isValid()) {
                          return (
                            <Typography variant="caption" color="text.secondary">
                              N/A
                            </Typography>
                          );
                        }

                        return (
                          <Box
                            sx={(theme) => ({
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                              px: 1.25,
                              py: 0.6,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                              background: `linear-gradient(135deg, ${alpha(
                                theme.palette.primary.light,
                                0.15
                              )} 0%, ${alpha(
                                theme.palette.background.paper,
                                0.9
                              )} 100%)`,
                              boxShadow: `0 6px 16px ${alpha(
                                theme.palette.primary.main,
                                0.1
                              )}`,
                            })}
                            dir="rtl"
                          >
                            <Box
                              sx={(theme) => ({
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.12
                                ),
                                color: "primary.main",
                              })}
                            >
                              <EventRoundedIcon sx={{ fontSize: 16 }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  fontWeight: 700,
                                  color: "text.primary",
                                  lineHeight: 1.2,
                                  textAlign: "right",
                                }}
                              >
                                {createdAt.format("jD jMMMM jYYYY")}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  color: "text.secondary",
                                  lineHeight: 1.2,
                                  textAlign: "right",
                                }}
                              >
                                {createdAt.format("HH:mm")}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View report details">
                        <Box sx={{ display: "inline-flex" }}>
                          <Box
                            component="button"
                            type="button"
                            onClick={() => handleRowDoubleClick(report._id)}
                            sx={(theme) => ({
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.75,
                              px: 1.5,
                              py: 0.6,
                              borderRadius: 999,
                              border: "1px solid",
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.08
                              ),
                              color: theme.palette.primary.dark,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              letterSpacing: "0.02em",
                              cursor: "pointer",
                              transition: "all 150ms ease",
                              "&:hover": {
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.16
                                ),
                                borderColor: theme.palette.primary.main,
                                transform: "translateY(-1px)",
                              },
                            })}
                          >
                            <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                            View
                          </Box>
                        </Box>
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
