import {
  Box,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import {
  PendingActions as PendingActionsIcon,
} from "@mui/icons-material";

const PendingStatusContent = () => {
  return (
    <Box>
      <Box className="flex flex-col items-center mb-8">
        <Box className="inline-flex p-4 bg-amber-50 rounded-full mb-3">
          <PendingActionsIcon className="text-amber-500 text-4xl" />
        </Box>
        <Typography variant="h4" className="font-bold text-gray-800">
          Pending 
        </Typography>
        {/* <Typography variant="subtitle1" className="text-amber-600 font-medium">
          Action required from stakeholders
        </Typography> */}
      </Box>

    
    </Box>
  );
};

export default PendingStatusContent