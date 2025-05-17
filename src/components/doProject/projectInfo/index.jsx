import { Avatar, Box, Card, Chip, Divider, Grid, List,ListItem, ListItemText,
    CardContent,  ListItemAvatar, Typography, 
    Tooltip} from "@mui/material"
import DetailItem from "../DetailItem"
import {
  Person as PersonIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import StatusIndicator from "./StatusIndicator";
// Utility function to format time
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

function ProjectInfo({projectData , devOpsInfo , totalWorkTime  , isTracking}){

    return <>
    
    <Card className="mb-8 shadow-lg rounded-xl overflow-hidden">
        <Box className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <Typography variant="h5" className="font-bold text-white">
            {projectData.title}
          </Typography>
          <Typography variant="subtitle1" className="text-blue-100 mt-2">
            Project Overview
          </Typography>
        </Box>

        <CardContent className="p-6">
          <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Typography
              variant="body1"
              className="text-gray-600 text-lg leading-relaxed mb-4 md:mb-0"
            >
              {/* {projectData.description} */}
            </Typography>

            {/* Work Time Display */}
            <Box className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <TimeIcon className="text-blue-500 mr-2" />
              <Typography variant="h6" className="font-medium text-gray-800">
                Work Time: {formatTime(totalWorkTime)}
              </Typography>
              {isTracking && (
                <Tooltip title="Work in progress">
                  <StatusIndicator color="success" />
                </Tooltip>
              )}
            </Box>
          </Box>

          <Divider className="my-6 border-gray-200" />

          <Grid container spacing={4}>
            {/* Project Details */}
            <Grid item xs={12} md={4}>
              <Box className="p-4 bg-gray-50 rounded-lg h-full">
                <Typography
                  variant="h5"
                  className="font-semibold mb-4 text-gray-800 flex items-center"
                >
                  <StarIcon className="text-amber-500 mr-2" />
                  Project Details
                </Typography>

                <Box className="space-y-3">
                  <DetailItem
                    icon={<CalendarIcon className="text-blue-500" />}
                    title="Timeline"
                    value={`${projectData.startDate} to ${projectData.endDate}`}
                  />

                  <DetailItem
                    icon={<PersonIcon className="text-purple-500" />}
                    title="Owner"
                    value={projectData.owner}
                  />
                </Box>
              </Box>
            </Grid>

            {/* DevOps Information */}
            <Grid item xs={12} md={4}>
              <Box className="p-4 bg-gray-50 rounded-lg h-full">
                <Typography
                  variant="h5"
                  className="font-semibold mb-4 text-gray-800 flex items-center"
                >
                  <SettingsIcon className="text-indigo-500 mr-2" />
                  DevOps Information
                </Typography>

                <Box className="space-y-3">
                  <DetailItem
                    icon={<CodeIcon className="text-red-500" />}
                    title="Repository"
                    value={
                      <a
                        href={devOpsInfo.repoUrl}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {devOpsInfo.repoUrl}
                      </a>
                    }
                  />

                  <DetailItem
                    icon={<SettingsIcon className="text-amber-500" />}
                    title="CI Tool"
                    value={devOpsInfo.ciTool}
                  />

                  <DetailItem
                    icon={<CloudIcon className="text-teal-500" />}
                    title="Deployment Target"
                    value={devOpsInfo.deploymentTarget}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Team Members */}
            <Grid item xs={12} md={4}>
              <Box className="p-4 bg-gray-50 rounded-lg h-full">
                <Typography
                  variant="h5"
                  className="font-semibold mb-4 text-gray-800 flex items-center"
                >
                  <GroupIcon className="text-green-500 mr-2" />
                  Team Members
                </Typography>
                <List className="p-0">
                  {projectData.team.map((member, index) => (
                    <ListItem key={index} className="pl-0 pr-0 py-2">
                      <ListItemAvatar>
                        <Avatar
                          className={`${member.status === "active" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"} font-medium`}
                        >
                          {member.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <span className="font-medium">{member.name}</span>
                        }
                        secondary={member.role}
                        secondaryTypographyProps={{
                          className: "text-gray-500",
                        }}
                      />
                      <Chip
                        label={
                          member.status === "active" ? "Active" : "Inactive"
                        }
                        size="small"
                        className={
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>

          {/* Technologies */}
          <Box className="mt-6">
            <Typography
              variant="subtitle1"
              className="font-medium text-gray-700 mb-3 flex items-center"
            >
              <CodeIcon className="text-gray-500 mr-2" />
              Technologies
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {projectData.technologies.map((tech, index) => (
                <Chip
                  key={index}
                  label={tech}
                  className="bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    
    
    </>
}

export default ProjectInfo 