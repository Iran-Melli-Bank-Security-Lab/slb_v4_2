import {
  Box,
 
} from "@mui/material";

import BugsTable from "./bugTable/BugsTable";

const InProgressContent = ({ progress }) => {
  return (
    <Box>
     
      <BugsTable projectManager="savadkuhi" />
      
    </Box>
  );
};

export default InProgressContent