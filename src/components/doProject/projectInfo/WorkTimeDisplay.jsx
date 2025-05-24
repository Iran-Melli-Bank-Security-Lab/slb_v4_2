import { Box , Typography , Tooltip  } from "@mui/material";
import { formatTime } from "../../../utils/formatTime";
import {
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import StatusIndicator from "./StatusIndicator";
import { memo } from "react";

function WorkTimeDisplay({totalWorkTime , isTracking}){

    return <>
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
    </>
}

export default memo(WorkTimeDisplay)