import React from "react";
import {
  Button,
} from "@mui/material";

const StatusButton = ({ icon, label, active, onClick, color }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      activeBg: "bg-blue-600",
      activeText: "text-white",
      hoverBg: "bg-blue-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      activeBg: "bg-amber-600",
      activeText: "text-white",
      hoverBg: "bg-amber-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      activeBg: "bg-indigo-600",
      activeText: "text-white",
      hoverBg: "bg-indigo-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      activeBg: "bg-green-600",
      activeText: "text-white",
      hoverBg: "bg-green-100",
    },
  };

  return (
    <Button
      variant={active ? "contained" : "outlined"}
      startIcon={React.cloneElement(icon, { className: `text-${color}-500` })}
      onClick={onClick}
      sx={{
        "&.MuiButton-contained": {
          backgroundColor: colorMap[color].activeBg,
          color: colorMap[color].acti,
          "&:hover": {
            backgroundColor: colorMap[color].activeBg,
            opacity: 0.9,
            transform: "translateY(-2px)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        "&.MuiButton-outlined": {
          "&:hover": {
            backgroundColor: colorMap[color].hoverBg,
            transform: "translateY(-2px)",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        minWidth: "160px",
      }}
    >
      {label}
    </Button>
  );
};

export default StatusButton