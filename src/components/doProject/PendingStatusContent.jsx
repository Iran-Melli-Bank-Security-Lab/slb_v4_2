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
          Awaiting Approval
        </Typography>
        <Typography variant="subtitle1" className="text-amber-600 font-medium">
          Action required from stakeholders
        </Typography>
      </Box>

      <Box className="bg-amber-50 p-4 rounded-lg mb-6 border-l-4 border-amber-500">
        <Typography variant="body1" className="text-amber-800 mb-3">
          This project is currently pending approval from the stakeholders. The
          following items need to be completed before we can proceed:
        </Typography>

        <List className="space-y-1">
          {[
            "Final budget approval from finance department",
            "Legal review of vendor contracts",
            "Resource allocation confirmation from HR",
            "Infrastructure provisioning approval",
          ].map((item, index) => (
            <ListItem key={index} className="pl-0">
              <Box className="mr-2 text-amber-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Box>
              <Typography className="text-amber-800">{item}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PendingStatusContent