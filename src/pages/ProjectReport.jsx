// project reports to show the project report to manager of project
import { useState, useEffect, useMemo } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useUserId } from "../hooks/useUserId";
import { fetchAllReports } from "../api/bugs/fetchAllReports";
import { fetchProjectById } from "../api/projects/fetchProjectById";
import { getUsers } from "../api/users/getUsers"; // ← موجود در پروژه‌ت
import { toast } from "react-toastify";
import { updateReportReadAccess } from "../api/bugs/updateReportReadAccess";

const ProjectReport = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const userId = useUserId();

  // Users for Read Access dialog
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Read access dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeReportId, setActiveReportId] = useState(null);

  // Map: reportId -> Set(userIds)
  const [accessMap, setAccessMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await fetchProjectById(projectId, userId);
        setProject(projectResponse);

        const reportsResponse = await fetchAllReports(projectId, userId);
        setReports(reportsResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId, userId]);

  // Initialize accessMap from reports.readAccess when reports change
  useEffect(() => {
    const map = {};
    (reports || []).forEach((r) => {
      const arr = (r.readAccess || []).map(String);
      map[r._id] = new Set(arr);
    });
    setAccessMap(map);
  }, [reports]);

  const handleRowDoubleClick = (reportId) => {
    navigate(`/project/report/${reportId}`);
  };

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openReadAccess = async (reportId) => {
    setActiveReportId(reportId);
    setDialogOpen(true);

    // lazy-load users
    if (!users.length) {
      try {
        setUsersLoading(true);
        const list = await getUsers(); 
        console.log("list : " , list)

        setUsers(Array.isArray(list?.users) ? list?.users : []);
      } catch (e) {
        console.error("Failed to load users:", e);
      } finally {
        setUsersLoading(false);
      }
    }
  };

  const closeReadAccess = () => {
    setDialogOpen(false);
    setActiveReportId(null);
    setUserSearch("");
  };

  const selectedSet = useMemo(() => {
    if (!activeReportId) return new Set();
    return accessMap[activeReportId] || new Set();
  }, [activeReportId, accessMap]);

  const toggleUser = (userId) => {
    if (!activeReportId) return;
    setAccessMap((prev) => {
      const copy = { ...prev };
      const set = new Set(copy[activeReportId] || []);
      if (set.has(userId)) set.delete(userId);
      else set.add(userId);
      copy[activeReportId] = set;
      return copy;
    });
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}}`.toLowerCase();
      return name.includes(q);
    });
  }, [users, userSearch]);

  const handleSelectAll = () => {
    if (!activeReportId) return;
    setAccessMap((prev) => {
      const copy = { ...prev };
      
      copy[activeReportId] = new Set(filteredUsers.map((u) => String(u._id)));
      console.log("copy line 154 : " , copy )
      return copy;
    });
  };

  const handleClearAll = () => {
    if (!activeReportId) return;
    setAccessMap((prev) => {
      const copy = { ...prev };
      copy[activeReportId] = new Set();
      return copy;
    });
  };

  const saveReadAccess = async () => {
    // TODO: call your backend API to persist:
    // console.log( "Array.from(accessMap[activeReportId] : ", Array.from(accessMap[activeReportId])
    await updateReportReadAccess(activeReportId, Array.from(accessMap[activeReportId] || []));
    // برای نمونه فقط می‌بندیم:
    console.log("Array accessMap line175 : " , Array.from(accessMap[activeReportId]))
    toast.success("با موفقیت انجام شد")
    closeReadAccess();
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
        {project?.projectName || "Project Reports"}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View all reports for this project
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pentester</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Permission</TableCell> {/* NEW */}
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
                    <TableCell>{report?.pentester?.lastName}</TableCell>
                    <TableCell>{report?.label}</TableCell>

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
                            report.state === "Verified"
                              ? "success.contrastText"
                              : report.state === "New"
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

                    {/* NEW: Permission column with Read Access button */}
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReadAccess(report._id);
                        }}
                      >
                        Read Access
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="View report details">
                        <DescriptionIcon
                          color="action"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowDoubleClick(report._id);
                          }}
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

      {/* Read Access dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeReadAccess}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Read Access</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <Button variant="text" onClick={handleSelectAll}>
              Select all
            </Button>
            <Button variant="text" onClick={handleClearAll}>
              Clear
            </Button>
          </Box>

          {usersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List dense>
              {filteredUsers.map((u) => {
                const id = String(u._id);
                const checked = selectedSet.has(id);
                const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || "—";
                return (
                  <ListItem key={id} disablePadding>
                    <ListItemButton onClick={() => toggleUser(id)}>
                      <ListItemIcon>
                        <Checkbox edge="start" tabIndex={-1} disableRipple checked={checked} />
                      </ListItemIcon>
                      <ListItemText
                        primary={fullName}
                        secondary={u.email || ""}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
              {!filteredUsers.length && (
                <Box sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                  No users found
                </Box>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReadAccess}>Cancel</Button>
          <Button onClick={saveReadAccess} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectReport;
