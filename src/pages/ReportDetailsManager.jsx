import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { fetchReportById } from "../api/bugs/fetchReport";
import { useUserId } from "../hooks/useUserId";

import {
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CloudUpload as CloudUploadIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as DuplicateIcon,
  NotInterested as NotApplicableIcon,
  HelpOutline as NeedMoreInfoIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
} from "@mui/material";
import { verifyReport } from "../api/bugs/verifyReport";

const StatusBadge = ({ status }) => {
  const statusClasses = {
    New: "bg-blue-100 text-blue-800 border-blue-300",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Verified: "bg-green-100 text-green-800 border-green-300",
    Duplicate: "bg-purple-100 text-purple-800 border-purple-300",
    "Not Applicable": "bg-gray-100 text-gray-800 border-gray-300",
    "Need More Information": "bg-orange-100 text-orange-800 border-orange-300",
  };

  const statusIcons = {
    New: <BugReportIcon className="w-4 h-4 mr-1" />,
    Pending: <PendingIcon className="w-4 h-4 mr-1" />,
    Verified: <CheckCircleIcon className="w-4 h-4 mr-1" />,
    Duplicate: <DuplicateIcon className="w-4 h-4 mr-1" />,
    "Not Applicable": <NotApplicableIcon className="w-4 h-4 mr-1" />,
    "Need More Information": <NeedMoreInfoIcon className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClasses[status]}`}
    >
      {statusIcons[status]}
      {status}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  const severityClasses = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
  };

  const severityIcons = {
    Low: <InfoIcon className="w-4 h-4 mr-1" />,
    Medium: <WarningIcon className="w-4 h-4 mr-1" />,
    High: <WarningIcon className="w-4 h-4 mr-1" />,
    Critical: <ErrorIcon className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClasses[severity]}`}
    >
      {severityIcons[severity]}
      {severity}
    </span>
  );
};

const ReportDetailsManager = () => {
  const { reportId } = useParams();
  const userId = useUserId();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [score, setScore] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    handleMenuClose();
    
    if (action === "Need More Information") {
      setIsDialogOpen(true);
    } else {
      handleAction(action);
    }
  };

  const handleAction = async (action) => {
    let message = `Report status changed to "${action}"`;
    if (action === "Need More Information") {
      message += ` with feedback: ${feedbackText}`;
    }
    if (score > 0) {
      message += ` and score: ${score}`;
    }
    console.log("action in line 130 : " , action)
    
    await verifyReport(reportId , action )
    toast.success(message);
    // API call would go here to update the report status
    console.log({
      action,
      feedback: feedbackText,
      score,
      reportId
    });
    
    // Reset states
    setSelectedAction(null);
    setFeedbackText("");
    setScore(0);
    setIsDialogOpen(false);
  };

  const handleScoreChange = (event, newValue) => {
    setScore(newValue);
  };

  const actionItems = [
    { name: "New", icon: <BugReportIcon fontSize="small" /> },
    { name: "Verified", icon: <CheckCircleIcon fontSize="small" /> },
    { name: "Duplicate", icon: <DuplicateIcon fontSize="small" /> },
    { name: "Not Applicable", icon: <NotApplicableIcon fontSize="small" /> },
    { name: "Need More Information", icon: <NeedMoreInfoIcon fontSize="small" /> },
  ];

  useEffect(() => {
    const getReport = async () => {
      try {
        setIsLoading(true);
        const result = await fetchReportById(reportId);
        setReport(result);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report");
      } finally {
        setIsLoading(false);
      }
    };
    getReport();
  }, [reportId]);


  // Function to check if file is an image
  const isImageFile = (filename) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
  };

  // Function to check if file is a video
  const isVideoFile = (filename) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(filename);
  };

  // Function to handle file preview click
  const handleFilePreview = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };



  const renderRtlText = (text) => {
    if (!text) return null;

    return (
      <div
        dir="rtl"
        className="text-right whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200"
      >
        {text.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="mt-4 text-gray-600">Report not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 relative">
      <div className="flex items-center mb-6">
        <BugReportIcon className="text-red-500 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">
          Bug Report: {report.label}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {report.label}
            </h2>
            <div className="flex space-x-2">
              <StatusBadge status={report.state} />
              <SeverityBadge severity={report.severity} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">CVSS:</span> {report.CVSS}
            </div>
            <div>
              <span className="font-medium">CVE:</span>{" "}
              {report.CVE || "N/A"}
            </div>
            <div>
              <span className="font-medium">WSTG:</span>{" "}
              {report.wstg || "N/A"}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-700">{report.description}</p>
          </div>

          <div className="space-y-4">
            {report.impact && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Impact
                </h3>
                {renderRtlText(report.impact)}
              </div>
            )}

            {report.solutions && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Solutions
                </h3>
                {renderRtlText(report.solutions)}
              </div>
            )}

            {report.tools?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Tools Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}


  {report.pocs?.length > 0 && (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Proof of Concepts
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {report.pocs.map((poc, index) => {
          const backendURL = import.meta.env.VITE_API_URL || "http://localhost:4000" ; 
          const fileUrl = backendURL +"/" +poc.path  // Handle both URL and File object
          const isImage = isImageFile(poc.originalname);
          const isVideo = isVideoFile(poc.originalname);

          return (
            <div 
              key={index}
              className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              onClick={() => handleFilePreview(fileUrl)}
            >
              {isImage ? (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={fileUrl}
                    alt={poc.originalname}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23EEE'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='12' fill='%23000' text-anchor='middle' dominant-baseline='middle'%3EImage%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ) : isVideo ? (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <video className="h-full w-full object-contain" controls>
                    <source src={fileUrl} type={`video/${poc.originalname.split('.').pop()}`} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex flex-col items-center justify-center p-4">
                  <CloudUploadIcon className="text-gray-400 text-4xl mb-2" />
                  <span className="text-sm text-gray-600 text-center truncate w-full">
                    {poc.originalname}
                  </span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
              
              <div className="p-3 bg-white">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {poc.originalname}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {poc.size ? `${(poc.size / 1024).toFixed(1)} KB` : 'Size not available'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}



            

            {report.path && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Path:</span> {report.path}
              </div>
            )}

            {report.exploits && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Exploit
                </h3>
                {renderRtlText(report.exploits)}
              </div>
            )}

            {report.refrence && (
              <div className="text-sm">
                <span className="font-medium">Reference:</span>{" "}
                <a
                  href={report.refrence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {report.refrence}
                </a>
              </div>
            )}

            {report.cvssVector && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">CVSS Vector:</span>{" "}
                {report.cvssVector}
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Securing Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="font-medium">
                    Web Server Settings:
                  </span>{" "}
                  {report.securingByOptions.webServerSettings ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="font-medium">
                    Program Code Modification:
                  </span>{" "}
                  {report.securingByOptions.modificationInProgramCode ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-600">No</span>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="font-medium">WAF Possibility:</span>{" "}
                  <span className="text-blue-600">
                    {report.securingByWAF}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {report.created_at && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-700">
                      Created:{" "}
                    </span>
                    <span>
                      {format(
                        new Date(report.created_at),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              )}
              {report.updated_at && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-700">
                      Updated:{" "}
                    </span>
                    <span>
                      {format(
                        new Date(report.updated_at),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <IconButton
                aria-label="more"
                aria-controls="report-actions-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                className="focus:outline-none"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="report-actions-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {actionItems.map((item) => (
                  <MenuItem 
                    key={item.name} 
                    onClick={() => handleActionSelect(item.name)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Provide Additional Information</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography variant="body1" gutterBottom>
              You're requesting more information for report: <strong>{report.label}</strong>
            </Typography>
            
            <TextField
              autoFocus
              margin="dense"
              id="feedback"
              label="Detailed Feedback"
              placeholder="Please specify what additional information is needed from the pentester..."
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={6}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              sx={{ mt: 3 }}
            />
            
         
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (!feedbackText.trim()) {
                toast.warning("Please provide feedback before submitting");
                return;
              }
              handleAction(selectedAction);
            }}
            variant="contained"
            color="primary"
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportDetailsManager;