// src/components/doProject/ProjectStatus.jsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  PendingActions as PendingActionsIcon,
  Build as BuildIcon,
  LockOpen as LockOpenIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccessTime as TimeIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import StatusButton from "../../doProject/StatusButton";
import TimerDisplay from "../../doProject/timework/TimerDisplay";
import SessionWorkModal from "../../doProject/sessionWork/SessionWorkModal";

const ProjectStatus = ({
  projectStatus,
  toggleExpand,
  expanded,
  handleStatusChange,
  totalWorkTime,
  isTracking,
  lastStatusChange,
  timeEntries,
  openHistoryModal,
  setOpenHistoryModal,
  statusComponents,
}) => (
  <Card className="mb-8 shadow-lg rounded-xl overflow-hidden">
    <Box className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
        {/* Status Buttons */}
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

        {/* Work Time Tracking */}
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
                <span className="font-medium capitalize">{projectStatus}</span>
              </Typography>
              <TimerDisplay
                initialTime={totalWorkTime}
                isTracking={isTracking}
                lastStatusChange={lastStatusChange}
              />
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

        {/* History Modal */}
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
            <SessionWorkModal
              open={openHistoryModal}
              onClose={() => setOpenHistoryModal(false)}
              timeEntries={timeEntries}
            />
          </>
        )}

        <Divider className="my-6 border-gray-200" />

        {/* Phase‐specific Content */}
        <Box className="mt-6">{statusComponents[projectStatus]}</Box>
      </CardContent>
    </Collapse>
  </Card>
);

export default ProjectStatus;
