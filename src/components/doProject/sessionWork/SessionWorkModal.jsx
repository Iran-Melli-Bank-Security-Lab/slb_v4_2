import { Box, Button, Chip, Modal, Paper, Typography } from "@mui/material";
import { formatTime } from "../../../utils/formatTime";
import { memo } from "react";
import {
  AccessTime as TimeIcon,
} from "@mui/icons-material";


function SessionWorkModal({ open, onClose, timeEntries, onClick }) {

    return <>

        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="work-history-modal"
            aria-describedby="work-sessions-history"
        >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[80vh] overflow-y-auto">
                <Typography variant="h5" className="font-bold mb-4">
                    Work Sessions History
                </Typography>
                <Box className="space-y-3">
                    {timeEntries.map((entry, index) => (
                        <Paper key={index} className="p-4 hover:shadow-md transition-shadow">
                            <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <Box>
                                    <Typography variant="subtitle1" className="font-medium">
                                        Session {index + 1}
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-500">
                                        {new Date(entry.start).toLocaleDateString()} • {new Date(entry.start).toLocaleTimeString()} - {new Date(entry.end).toLocaleTimeString()}
                                    </Typography>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <Chip
                                        label={formatTime(entry.duration)}
                                        className="bg-blue-100 text-blue-800 font-medium"
                                        size="small"
                                        icon={<TimeIcon className="text-blue-600" />}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
                <Button
                    variant="outlined"
                    className="mt-4"
                    onClick={onClick}
                >
                    Close
                </Button>
            </Box>
        </Modal>


    </>
}

export default memo(SessionWorkModal)