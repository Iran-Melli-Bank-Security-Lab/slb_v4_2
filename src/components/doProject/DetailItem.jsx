import { Box, Typography } from "@mui/material";

// Detail Item Component
const DetailItem = ({ icon, title, value }) => {
  return (
    <Box className="flex items-start mb-2 last:mb-0">
      <Box className="mr-3 text-gray-500">{icon}</Box>
      <Box>
        <Typography variant="subtitle2" className="font-medium text-gray-500">
          {title}
        </Typography>
        <Typography variant="body1" className="text-gray-800">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailItem 
