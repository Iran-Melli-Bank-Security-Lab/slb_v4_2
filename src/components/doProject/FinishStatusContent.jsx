import {
    Box,
    Typography,
    Grid,
} from "@mui/material";

import {
    CheckCircleOutline as CheckCircleOutlineIcon,
    Description as DescriptionIcon,
    Group as GroupIcon,
} from "@mui/icons-material";

import MetricCard from "./MetricCard"


const FinishStatusContent = () => {

    return (
        <Box className="text-center py-6 px-4">
            <Box className="inline-flex p-5 bg-green-50 rounded-full mb-5">
                <CheckCircleOutlineIcon className="text-green-500 text-5xl" />
            </Box>
            <Typography variant="h3" className="font-bold mb-4 text-gray-800">
                Project Completed Successfully!
            </Typography>
            <Grid container spacing={3} className="mb-8">
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        value="32"
                        label="Completed Tasks"
                        icon={<DescriptionIcon className="text-blue-500" />}
                        color="bg-blue-50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        value="15"
                        label="Team Members"
                        icon={<GroupIcon className="text-purple-500" />}
                        color="bg-purple-50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        value="98%"
                        label="Satisfaction"
                        icon={<CheckCircleOutlineIcon className="text-green-500" />}
                        color="bg-green-50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard
                        value="0"
                        label="Critical Issues"
                        icon={<CheckCircleOutlineIcon className="text-amber-500" />}
                        color="bg-amber-50"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default FinishStatusContent