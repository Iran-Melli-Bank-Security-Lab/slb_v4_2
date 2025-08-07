import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { fetchReportById } from "../api/bugs/fetchReport";
import { useUserId } from "../hooks/useUserId";
import { verifyReport } from "../api/bugs/verifyReport";
import PersianDateWithTooltip from "../components/dateTime/PersainDate";

// Icons
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
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ChatBubbleOutline as CommentIcon,
} from "@mui/icons-material";

// MUI Components
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
  Chip,
  Avatar,
  Divider,
  Tooltip,
  CircularProgress,
  Badge,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";

// Styled Components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const SeverityIndicator = styled('div')(({ severity, theme }) => {
  const colorMap = {
    Critical: theme.palette.error.main,
    High: theme.palette.warning.dark,
    Medium: theme.palette.warning.main,
    Low: theme.palette.success.main,
  };
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: colorMap[severity] || theme.palette.grey[500],
    marginRight: theme.spacing(1),
    display: 'inline-block',
  };
});

const StatusBadge = ({ status }) => {
  const statusColors = {
    New: { bg: '#e3f2fd', text: '#1565c0', icon: <BugReportIcon fontSize="small" /> },
    Pending: { bg: '#fff8e1', text: '#ff8f00', icon: <PendingIcon fontSize="small" /> },
    Verified: { bg: '#e8f5e9', text: '#2e7d32', icon: <CheckCircleIcon fontSize="small" /> },
    Duplicate: { bg: '#f3e5f5', text: '#7b1fa2', icon: <DuplicateIcon fontSize="small" /> },
    "Not Applicable": { bg: '#efebe9', text: '#4e342e', icon: <NotApplicableIcon fontSize="small" /> },
    "Need More Information": { bg: '#fff3e0', text: '#e65100', icon: <NeedMoreInfoIcon fontSize="small" /> },
  };

  return (
    <Chip
      icon={statusColors[status]?.icon}
      label={status}
      sx={{
        backgroundColor: statusColors[status]?.bg,
        color: statusColors[status]?.text,
        fontWeight: 600,
        px: 1,
      }}
    />
  );
};

const SeverityBadge = ({ severity }) => {
  const severityColors = {
    Critical: { bg: '#ffebee', text: '#c62828', icon: <ErrorIcon fontSize="small" /> },
    High: { bg: '#fff3e0', text: '#e65100', icon: <WarningIcon fontSize="small" /> },
    Medium: { bg: '#fff8e1', text: '#ff8f00', icon: <WarningIcon fontSize="small" /> },
    Low: { bg: '#e8f5e9', text: '#2e7d32', icon: <InfoIcon fontSize="small" /> },
  };

  return (
    <Chip
      icon={severityColors[severity]?.icon}
      label={severity}
      sx={{
        backgroundColor: severityColors[severity]?.bg,
        color: severityColors[severity]?.text,
        fontWeight: 600,
        px: 1,
      }}
    />
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
  const [score, setScore] = useState(50); // Default to 50
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    handleMenuClose();

    if (action === "Need More Information") {
      setDialogType('needInfo');
      setIsDialogOpen(true);
    } else if (action === "Verify") {
      setDialogType('verify');
      setIsDialogOpen(true);
    } else {
      handleAction(action);
    }
  };

  const handleAction = async (action) => {
    try {
      setIsLoading(true);
      const payload = {
        state: action,
        id:reportId,
      };

      if (action === "Need More Information") {

 if (!feedbackText.trim()) {
          toast.warning('Please provide feedback before submitting');
          return;
        }
        payload.feedback = feedbackText;


      } else if (action === "Verify") {
        payload.score = score;
        payload.comments = feedbackText;
      }

      await verifyReport(payload);
      toast.success(`Report marked as "${action}" successfully`);

      // Refresh report data
      const updatedReport = await fetchReportById(reportId);
      setReport(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error(`Failed to update report: ${error.message}`);
    } finally {
      setSelectedAction(null);
      setFeedbackText("");
      setScore(0);
      setIsDialogOpen(false);
      setDialogType(null);
      setIsLoading(false);
    }
  };

  const handleScoreChange = (event, newValue) => setScore(newValue);

  const actionItems = [
    { name: "New", icon: <BugReportIcon fontSize="small" /> },
    { name: "Verify", icon: <CheckCircleIcon fontSize="small" /> },
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
        toast.error("Failed to load report details");
      } finally {
        setIsLoading(false);
      }
    };
    getReport();
  }, [reportId]);

  // File type checkers
  const isImageFile = (filename) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
  const isVideoFile = (filename) => /\.(mp4|webm|ogg|mov|avi)$/i.test(filename);
  const handleFilePreview = (fileUrl) => window.open(fileUrl, "_blank");

  const renderRtlText = (text) => {
    if (!text) return null;
    return (
      <Box dir="rtl" sx={{ 
        textAlign: 'right', 
        whiteSpace: 'pre-line', 
        bgcolor: 'background.paper', 
        p: 2, 
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider'
      }}>
        {text.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Box>
    );
  };

  if (isLoading && !report) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!report) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '50vh',
        textAlign: 'center'
      }}>
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Report not found or unable to load
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: { xs: 2, sm: 4 } }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <BugReportIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            {report.label}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {report.labelfa}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StatusBadge status={report.state} />
          <SeverityBadge severity={report.severity} />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { md: '3fr 1fr' }, 
        gap: 4 
      }}>
        {/* Left Column - Report Details */}
        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 1,
          p: 4 
        }}>
          {/* Basic Info */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {report.description}
            </Typography>
          </Box>

          {/* Metadata Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { sm: 'repeat(3, 1fr)' }, 
            gap: 2,
            mb: 4,
            '& > div': {
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 1
            }
          }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">CVSS</Typography>
              <Typography variant="body1">{report.CVSS}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">CVE</Typography>
              <Typography variant="body1">{report.CVE || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">WSTG</Typography>
              <Typography variant="body1">{report.wstg || "N/A"}</Typography>
            </Box>
          </Box>

          {/* Impact Section */}
          {report.impact && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Impact
              </Typography>
              {renderRtlText(report.impact)}
            </Box>
          )}

          {/* Solutions Section */}
          {report.solutions && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Solution
              </Typography>
              {renderRtlText(report.solutions)}
            </Box>
          )}

          {/* Tools Section */}
          {report.tools?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Tools Used
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {report.tools.map((tool, index) => (
                  <Chip key={index} label={tool} variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          {/* PoCs Section */}
          {report.pocs?.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Proof of Concepts
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
                gap: 3 
              }}>
                {report.pocs.map((poc, index) => {
                  const backendURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
                  const fileUrl = backendURL + "/" + poc.path;
                  const isImage = isImageFile(poc.originalname);
                  const isVideo = isVideoFile(poc.originalname);

                  return (
                    <Box 
                      key={index} 
                      sx={{ 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => handleFilePreview(fileUrl)}
                    >
                      {isImage ? (
                        <Box sx={{ 
                          height: 180, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'background.default'
                        }}>
                          <img
                            src={fileUrl}
                            alt={poc.originalname}
                            style={{ 
                              maxHeight: '100%', 
                              maxWidth: '100%', 
                              objectFit: 'contain' 
                            }}
                          />
                        </Box>
                      ) : isVideo ? (
                        <Box sx={{ 
                          height: 180, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'background.default'
                        }}>
                          <video style={{ maxHeight: '100%', maxWidth: '100%' }} controls>
                            <source src={fileUrl} type={`video/${poc.originalname.split(".").pop()}`} />
                            Your browser does not support the video tag.
                          </video>
                        </Box>
                      ) : (
                        <Box sx={{ 
                          height: 180, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: 'background.default',
                          p: 2
                        }}>
                          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="body2" sx={{ 
                            textAlign: 'center', 
                            wordBreak: 'break-word',
                            color: 'text.secondary'
                          }}>
                            {poc.originalname}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" noWrap>
                          {poc.originalname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {poc.size ? `${(poc.size / 1024).toFixed(1)} KB` : "Size not available"}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Additional Sections */}
          {report.path && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Affected Path
              </Typography>
              <Typography variant="body1" sx={{ 
                fontFamily: 'monospace',
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                wordBreak: 'break-all'
              }}>
                {report.path}
              </Typography>
            </Box>
          )}

          {report.exploits && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Exploit Details
              </Typography>
              {renderRtlText(report.exploits)}
            </Box>
          )}

          {report.refrence && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Reference
              </Typography>
              <Typography variant="body1">
                <a 
                  href={report.refrence} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {report.refrence}
                </a>
              </Typography>
            </Box>
          )}

          {report.cvssVector && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                CVSS Vector
              </Typography>
              <Typography variant="body1" sx={{ 
                fontFamily: 'monospace',
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 1,
                wordBreak: 'break-all'
              }}>
                {report.cvssVector}
              </Typography>
            </Box>
          )}

          {/* Securing Options */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Securing Options
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { sm: 'repeat(3, 1fr)' }, 
              gap: 2,
              '& > div': {
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }
            }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Web Server Settings
                </Typography>
                <Typography variant="body1">
                  {report.securingByOptions.webServerSettings ? (
                    <Chip label="Available" color="success" size="small" />
                  ) : (
                    <Chip label="Not Available" color="error" size="small" />
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Code Modification
                </Typography>
                <Typography variant="body1">
                  {report.securingByOptions.modificationInProgramCode ? (
                    <Chip label="Required" color="success" size="small" />
                  ) : (
                    <Chip label="Not Required" color="error" size="small" />
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  WAF Possibility
                </Typography>
                <Typography variant="body1">
                  <Chip 
                    label={report.securingByWAF} 
                    color={
                      report.securingByWAF === 'Possible' ? 'success' : 
                      report.securingByWAF === 'Not Possible' ? 'error' : 'warning'
                    } 
                    size="small" 
                  />
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Metadata & Actions */}
        <Box>
          {/* Report Metadata Card */}
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1,
            p: 3,
            mb: 3
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Report Details
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">
                <PersianDateWithTooltip date={report.created_at} />
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">
                <PersianDateWithTooltip date={report.updated_at} />
              </Typography>
            </Box>
            
            {report.score && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Verification Score
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SeverityIndicator severity={report.severity} />
                  <Typography variant="body1">
                    {report.score}/100
                  </Typography>
                </Box>
                <Slider
                  value={report.score}
                  size="small"
                  sx={{ mt: 1 }}
                  disabled
                />
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Change Status
              </Typography>
              <IconButton
                aria-label="report-actions"
                onClick={handleMenuOpen}
                sx={{ color: 'primary.main' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    width: 220,
                    boxShadow: 3,
                  }
                }}
              >
                {actionItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    onClick={() => handleActionSelect(item.name)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.selected',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* Quick Stats Card */}
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1,
            p: 3
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Vulnerability Stats
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Severity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <SeverityIndicator severity={report.severity} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {report.severity}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                CVSS Score
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {report.CVSS}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Attack Vector
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {report.cvssVector?.split('/')[1]?.split(':')[1] || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Action Dialogs */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: dialogType === 'verify' ? 'success.light' : 'warning.light',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {dialogType === 'verify' ? (
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <NeedMoreInfoIcon color="warning" sx={{ mr: 1 }} />
            )}
            {dialogType === 'verify' ? 'Verify Report' : 'Request More Information'}
          </Box>
          <IconButton onClick={() => setIsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" paragraph>
            You are about to mark this report as <strong>{selectedAction}</strong>:
          </Typography>
          
          <Box sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'background.default', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {report.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.labelfa}
            </Typography>
          </Box>

          {dialogType === 'verify' && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Verification Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ mr: 2, minWidth: 40 }}>
                  {score}
                </Typography>
                <Slider
                  value={score}
                  onChange={handleScoreChange}
                  min={0}
                  max={100}
                  step={1}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 3 
              }}>
                {[0, 25, 50, 75, 100].map((value) => (
                  <Tooltip key={value} title={`Score ${value}`}>
                    <IconButton
                      onClick={() => setScore(value)}
                      color={score === value ? 'primary' : 'default'}
                    >
                      {score >= value ? (
                        <StarIcon color={score === value ? 'primary' : 'inherit'} />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                ))}
              </Box>
            </>
          )}

          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {dialogType === 'verify' ? 'Comments (Optional)' : 'Required Feedback'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder={
              dialogType === 'verify' 
                ? 'Add any notes about this verification...' 
                : 'Explain what additional information you need...'
            }
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            InputProps={{
              startAdornment: (
                <CommentIcon color="action" sx={{ mr: 1, mt: 1, alignSelf: 'flex-start' }} />
              ),
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={() => setIsDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (dialogType === 'needInfo' && !feedbackText.trim()) {
                toast.warning('Please provide feedback before submitting');
                return;
              }
              handleAction(selectedAction);
            }}
            variant="contained"
            color={dialogType === 'verify' ? 'success' : 'warning'}
            sx={{ borderRadius: 2 }}
            startIcon={dialogType === 'verify' ? <CheckCircleIcon /> : <NeedMoreInfoIcon />}
          >
            {dialogType === 'verify' ? 'Confirm Verification' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportDetailsManager;