import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  Build as BuildIcon,
} from "@mui/icons-material";
import BugsTable from "./bugTable/BugsTable";

const InProgressContent = ({ progress }) => {
  return (
    <Box>
     
      <BugsTable projectManager="savadkuhi" />
      
    </Box>
  );
};

export default InProgressContent