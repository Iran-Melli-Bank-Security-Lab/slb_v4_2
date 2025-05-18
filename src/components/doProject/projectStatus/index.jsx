import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  Button,
  IconButton,
  Collapse,
  Modal,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  PendingActions as PendingActionsIcon,
  Build as BuildIcon,
  LockOpen as LockOpenIcon,
  AccessTime as TimeIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

function ProjectStatus(){

    return <>
    
      <Card className="mb-8 shadow-lg rounded-xl overflow-hidden">
        <Box className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" className="font-bold text-white">
                Project Status
              </Typography>
              <Typography variant="subtitle1" className="text-gray-300 mt-1">
                Current phase and progress tracking
              </Typography>
            </Box>
            <IconButton color="info" onClick={toggleExpand} className="text-white">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <CardContent className="p-6">
            <Box className="flex flex-wrap justify-center gap-4 mb-8">
              <StatusButton
                icon={<LockOpenIcon />}
                label="Open"
                active={projectStatus === "open"}
                onClick={() => handleStatusChange("open")}
                color="blue"
              />
              <StatusButton
                icon={<PendingActionsIcon />}
                label="Pending"
                active={projectStatus === "pending"}
                onClick={() => handleStatusChange("pending")}
                color="amber"
              />
              <StatusButton
                icon={<BuildIcon />}
                label="In Progress"
                active={projectStatus === "in-progress"}
                onClick={() => handleStatusChange("in-progress")}
                color="indigo"
              />
              <StatusButton
                icon={<CheckCircleOutlineIcon />}
                label="Finish"
                active={projectStatus === "finish"}
                onClick={() => handleStatusChange("finish")}
                color="green"
              />
            </Box>

            {/* Time Tracking Section */}
            <Box className="bg-indigo-50 p-5 rounded-lg mb-6 border-l-4 border-indigo-500">
              <Typography
                variant="h6"
                className="font-semibold mb-3 text-indigo-800 flex items-center"
              >
                <TimeIcon className="mr-2" />
                Work Time Tracking
              </Typography>

              <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <Box>
                  <Typography variant="body1" className="text-indigo-800 mb-1">
                    Current Status:{" "}
                    <span className="font-medium capitalize">
                      {projectStatus}
                    </span>
                  </Typography>
                  <Typography variant="body1" className="text-indigo-800">
                    Total Work Time:{" "}
                    <span className="font-medium">
                      {formatTime(totalWorkTime)}
                    </span>
                  </Typography>
                </Box>

                <Box className="flex flex-wrap gap-2 justify-center md:justify-end">
                  {projectStatus === "in-progress" ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      className="rounded-full min-w-[120px]"
                      startIcon={<PauseIcon />}
                      onClick={() => handleStatusChange("pending")}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className="rounded-full min-w-[120px]"
                      startIcon={<StartIcon />}
                      disabled={projectStatus === "finish"}
                      onClick={() => handleStatusChange("in-progress")}
                    >
                      Start
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="rounded-full min-w-[120px]"
                    startIcon={<StopIcon />}
                    disabled={projectStatus !== "in-progress"}
                    onClick={() => handleStatusChange("finish")}
                  >
                    Complete
                  </Button>
                </Box>
              </Box>
            </Box>

            {timeEntries.length > 0 && (
              <>
                <Button
                  variant="text"
                  color="primary"
                  className="mb-4"
                  onClick={() => setOpenHistoryModal(true)}
                >
                  View Full Work History
                </Button>

                <Modal
                  open={openHistoryModal}
                  onClose={() => setOpenHistoryModal(false)}
                  aria-labelledby="work-history-modal"
                  aria-describedby="work-sessions-history"
                >
                  <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
                    <Typography variant="h5" className="font-bold mb-4">
                      Work Sessions History
                    </Typography>
                    <Box className="space-y-3">
                      {timeEntries.map((entry, index) => (
                        <Paper key={index} className="p-4 hover:shadow-md transition-shadow">
                          <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <Box>
                              <Typography variant="subtitle1" className="font-medium">
                                Session {index + 1}
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                {new Date(entry.start).toLocaleDateString()} • {new Date(entry.start).toLocaleTimeString()} - {new Date(entry.end).toLocaleTimeString()}
                              </Typography>
                            </Box>
                            <Box className="flex items-center gap-2">
                              <Chip
                                label={formatTime(entry.duration)}
                                className="bg-blue-100 text-blue-800 font-medium"
                                size="small"
                                icon={<TimeIcon className="text-blue-600" />}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      className="mt-4"
                      onClick={() => setOpenHistoryModal(false)}
                    >
                      Close
                    </Button>
                  </Box>
                </Modal>
              </>
            )}

            <Divider className="my-6 border-gray-200" />

            {/* Section 3: Status-specific Content */}
            <Box className="mt-6">{statusComponents[projectStatus]}</Box>
          </CardContent>
        </Collapse>
      </Card>
    
    
    </>
}

export default ProjectStatus