import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Paper,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Cvss4P0 } from "ae-cvss-calculator";

const CVSSv4Calculator = ({ open, onClose, onScoreSelect }) => {
  // Metric states
  const [metrics, setMetrics] = useState({
    AV: "N", // Attack Vector
    AC: "L", // Attack Complexity
    AT: "N", // Attack Requirements
    PR: "N", // Privileges Required
    UI: "N", // User Interaction
    //Vulnerable System Impact Metrics
    VC: "N", // Confidentiality
    VI: "N", // Integrity
    VA: "N", // Availability

    SC: "N", //  Confidentiality
    SI: "N", //integrity
    SA: "N",

    E: "A", // Exploit Maturity
    RL: "O", // Remediation Level
    RC: "C", // Report Confidence
    CR: "H", // Confidentiality Req
    IR: "H", // Integrity Req
    AR: "H", // Availability Req
  });

  console.log("rerender when input changes ****** ");

  const [score, setScore] = useState(0.0);
  const [severity, setSeverity] = useState(null);
  const [vector, setVector] = useState("");

  const [cvss, setCvss] = useState(
    `CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:N/VI:N/VA:N/SC:N/SI:N/SA:N`
  );

  const [base, setBase] = useState({});

  // Update the CVSS string when selectedMetrics changes
  useEffect(() => {
    const newCvss = `CVSS:4.0/AV:${metrics.AV}/AC:${metrics.AC}/AT:${metrics.AT}/PR:${metrics.PR}/UI:${metrics.UI}/VC:${metrics.VC}/VI:${metrics.VI}/VA:${metrics.VA}/SC:${metrics.SC}/SI:${metrics.SI}/SA:${metrics.SA}`;
    setCvss(newCvss);
  }, [metrics]);



    useEffect(()=>{
        const cvss4 = new Cvss4P0();
        cvss4.applyVector(cvss);
        const jSchema = cvss4.createJsonSchema()
        console.log("JSchema : " , jSchema)
        setBase(jSchema)
        const {baseScore , baseSeverity , vectorString  } = jSchema 
        console.log("base Score : " , baseScore , baseSeverity , vectorString)

        setScore(parseFloat(baseScore))

setSeverity(baseSeverity)
setVector(vectorString)
        // sessionStorage.setItem('cvss' , JSON.stringify(jSchema))
    } , [cvss])



 
 

  const handleApply = () => {
    onScoreSelect({
      score,
      severity,
      vector,
    });
    onClose();
  };

  const updateMetric = (metric, value) => {
    setMetrics((prev) => ({
      ...prev,
      [metric]: value,
    }));
  };

  const MetricButtonGroup = ({ label, metric, options }) => (
    <Grid
      item
      xs={12}
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        {label} ({metric})
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            variant={
              metrics[metric] === option.value ? "contained" : "outlined"
            }
            color={metrics[metric] === option.value ? "primary" : "inherit"}
            size="small"
            onClick={() => updateMetric(metric, option.value)}
            sx={{
              textTransform: "none",
              minWidth: "unset",
              py: 0.5,
              px: 1.5,
              fontSize: "0.75rem",
              backgroundColor:
                metrics[metric] === option.value
                  ? option.color || "#4caf50"
                  : "transparent",
              "&:hover": {
                backgroundColor:
                  metrics[metric] === option.value
                    ? option.color || "#4caf50"
                    : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {option.label} ({option.value})
          </Button>
        ))}
      </Box>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          CVSS v4.0 Calculator
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#fafafa", p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Score Display */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "#e3f2fd",
              borderLeft: "4px solid",
              borderColor:
                severity === "CRITICAL"
                  ? "#d32f2f"
                  : severity === "HIGH"
                    ? "#f57c00"
                    : severity === "MEDIUM"
                      ? "#fbc02d"
                      : "#388e3c",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Base Score:</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {score || 0.0}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Severity:</Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    color:
                      severity === "CRITICAL"
                        ? "#d32f2f"
                        : severity === "HIGH"
                          ? "#f57c00"
                          : severity === "MEDIUM"
                            ? "#fbc02d"
                            : "#388e3c",
                  }}
                >
                  {severity || "--"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Vector String:</Typography>
                <Typography variant="body2" fontFamily="monospace" noWrap>
                  {vector || "CVSS:4.0/..."}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Base Metrics */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Base Metrics
            </Typography>

            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <MetricButtonGroup
                label="Attack Vector"
                metric="AV"
                options={[
                  { value: "N", label: "Network", color: "#4caf50" },
                  { value: "A", label: "Adjacent", color: "#8bc34a" },
                  { value: "L", label: "Local", color: "#cddc39" },
                  { value: "P", label: "Physical", color: "#ffeb3b" },
                ]}
              />

              <MetricButtonGroup
                label="Attack Complexity"
                metric="AC"
                options={[
                  { value: "L", label: "Low", color: "#4caf50" },
                  { value: "H", label: "High", color: "#f44336" },
                ]}
              />
              <MetricButtonGroup
                label="Attack Requirement"
                metric="AT"
                options={[
                  { value: "N", label: "None", color: "#4caf50" },
                  { value: "P", label: "Present", color: "#8bc34a" },
                ]}
              />
              <MetricButtonGroup
                label="Privileges Required"
                metric="PR"
                options={[
                  { value: "N", label: "None", color: "#4caf50" },
                  { value: "L", label: "Low", color: "#8bc34a" },
                  { value: "H", label: "High", color: "#f44336" },
                ]}
              />
              <MetricButtonGroup
                label="User Interaction"
                metric="UI"
                options={[
                  { value: "N", label: "None", color: "#4caf50" },
                  { value: "P", label: "Passive", color: "#f44336" },
                  { value: "A", label: "Active", color: "#f44336" },
                ]}
              />
            </Grid>
          </Paper>

          {/* Vulnerability System Impact  */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Vulnerable System Impact Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <MetricButtonGroup
                label="Confidentiality"
                metric="VC"
                options={[
                  { value: "H", label: "High", color: "#f44336" },
                  { value: "L", label: "Low", color: "#ff9800" },
                  { value: "N", label: "None", color: "#4caf50" },
                ]}
              />
              <MetricButtonGroup
                label="Integrity"
                metric="VI"
                options={[
                  { value: "H", label: "High", color: "#f44336" },
                  { value: "L", label: "Low", color: "#ff9800" },
                  { value: "N", label: "None", color: "#4caf50" },
                ]}
              />
              <MetricButtonGroup
                label="Availability"
                metric="VA"
                options={[
                  { value: "H", label: "High", color: "#f44336" },
                  { value: "L", label: "Low", color: "#ff9800" },
                  { value: "N", label: "None", color: "#4caf50" },
                ]}
              />
            </Grid>
          </Paper>


  {/* Subsequent System Impact Metrics  */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Subsequent System Impact Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <MetricButtonGroup
                label="Confidentiality"
                metric="SC"
                options={[
                  { value: "H", label: "High", color: "#f44336" },
                  { value: "L", label: "Low", color: "#ff9800" },
                  { value: "N", label: "None", color: "#4caf50" },
                ]}
              />
              <MetricButtonGroup
                label="Integrity"
                metric="SI"
                options={[
                  { value: "H", label: "High", color: "#f44336" },
                  { value: "L", label: "Low", color: "#ff9800" },
                  { value: "N", label: "None", color: "#4caf50" },
                ]}
              />
              <MetricButtonGroup
                label="Availability"
                metric="SA"
                options={[
                  { value: "H", label: "High", color: "#f44336" },
                  { value: "L", label: "Low", color: "#ff9800" },
                  { value: "N", label: "None", color: "#4caf50" },
                ]}
              />
            </Grid>
          </Paper>

        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: "#f5f5f5",
          borderTop: "1px solid #ddd",
          p: 2,
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          
        >
          Apply CVSS Score
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CVSSv4Calculator;
