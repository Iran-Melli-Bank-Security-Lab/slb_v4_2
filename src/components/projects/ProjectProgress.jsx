import { LinearProgress, Typography } from "@mui/material";

export default function ProjectProgress({row , col }){

    return <>
     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={row[col.id]}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 5,
                                                        flexGrow: 1,
                                                        backgroundColor: (theme) => theme.palette.grey[300],
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: (theme) =>
                                                                row[col.id] < 50
                                                                    ? theme.palette.error.main
                                                                    : row[col.id] < 80
                                                                        ? theme.palette.warning.main
                                                                        : theme.palette.success.main,
                                                        },
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ minWidth: 30 }}>
                                                    {`${row[col.id]}%`}
                                                </Typography>
                                            </div>
    
    </>
}