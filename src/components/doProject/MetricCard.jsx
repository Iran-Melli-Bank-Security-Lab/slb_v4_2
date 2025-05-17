import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const MetricCard = ({ value, label, icon, color }) => {
  return (
    <Paper className="p-4 text-center rounded-lg shadow-sm hover:shadow-md transition-shadow h-full">
      <Box className={`inline-flex p-3 rounded-full mb-3 ${color}`}>
        {React.cloneElement(icon, { className: "text-xl" })}
      </Box>
      <Typography variant="h4" className="font-bold mb-1">
        {value}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        {label}
      </Typography>
    </Paper>
  );
};

export default MetricCard 