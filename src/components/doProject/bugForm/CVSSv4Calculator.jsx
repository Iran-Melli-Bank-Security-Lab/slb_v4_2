import React, { useState, useEffect } from 'react';
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
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CVSSv4Calculator = ({ open, onClose, onScoreSelect }) => {
  // Metric states
  const [metrics, setMetrics] = useState({
    AV: 'N', // Attack Vector
    AC: 'L', // Attack Complexity
    AT: 'N', // Attack Requirements
    PR: 'N', // Privileges Required
    UI: 'N', // User Interaction
    VC: 'H', // Confidentiality
    VI: 'H', // Integrity
    VA: 'H', // Availability
    SC: 'U', // Scope
    E: 'A',  // Exploit Maturity
    RL: 'O', // Remediation Level
    RC: 'C', // Report Confidence
    CR: 'H', // Confidentiality Req
    IR: 'H', // Integrity Req
    AR: 'H'  // Availability Req
  });

 console.log("rerender when input changes ****** " ) ;
  
  const [score, setScore] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [vector, setVector] = useState('');

  // Calculate score when metrics change
  useEffect(() => {
    calculateScore();
  }, [metrics]);

  const calculateScore = () => {
    // Simplified calculation - implement official CVSS v4 formulas here
    let baseScore = 0;
    
    // Base metric calculations
    if (metrics.AV === 'N') baseScore += 0.85;
    if (metrics.AC === 'L') baseScore += 0.77;
    if (metrics.PR === 'N') baseScore += 0.85;
    if (metrics.UI === 'N') baseScore += 0.85;
    if (metrics.SC === 'C') baseScore *= 1.2;
    
    // Impact calculations
    if (metrics.VC === 'H') baseScore += 0.56;
    if (metrics.VI === 'H') baseScore += 0.56;
    if (metrics.VA === 'H') baseScore += 0.56;
    
    // Temporal adjustments
    if (metrics.E === 'A') baseScore *= 1.0;
    if (metrics.RL === 'O') baseScore *= 0.97;
    if (metrics.RC === 'C') baseScore *= 1.0;
    
    // Environmental adjustments
    if (metrics.CR === 'H') baseScore *= 1.5;
    if (metrics.IR === 'H') baseScore *= 1.5;
    if (metrics.AR === 'H') baseScore *= 1.5;
    
    // Cap at 10
    const finalScore = Math.min(baseScore * 1.5, 10).toFixed(1);
    
    // Determine severity
    let finalSeverity;
    if (finalScore >= 9.0) finalSeverity = 'CRITICAL';
    else if (finalScore >= 7.0) finalSeverity = 'HIGH';
    else if (finalScore >= 4.0) finalSeverity = 'MEDIUM';
    else finalSeverity = 'LOW';
    
    // Build vector string
    const vectorString = `CVSS:4.0/AV:${metrics.AV}/AC:${metrics.AC}` +
      `/AT:${metrics.AT}/PR:${metrics.PR}/UI:${metrics.UI}` +
      `/VC:${metrics.VC}/VI:${metrics.VI}/VA:${metrics.VA}` +
      `/SC:${metrics.SC}/E:${metrics.E}/RL:${metrics.RL}` +
      `/RC:${metrics.RC}/CR:${metrics.CR}/IR:${metrics.IR}/AR:${metrics.AR}`;
    
    setScore(finalScore);
    setSeverity(finalSeverity);
    setVector(vectorString);
  };

  const handleApply = () => {
    onScoreSelect({
      score,
      severity,
      vector
    });
    onClose();
  };

  const updateMetric = (metric, value) => {
    setMetrics(prev => ({
      ...prev,
      [metric]: value
    }));
  };

  const MetricButtonGroup = ({ label, metric, options }) => (
    <Grid item xs={12}>
      <Typography variant="subtitle2" gutterBottom>
        {label} ({metric})
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {options.map((option) => (
          <Button
            key={option.value}
            variant={metrics[metric] === option.value ? 'contained' : 'outlined'}
            color={metrics[metric] === option.value ? 'primary' : 'inherit'}
            size="small"
            onClick={() => updateMetric(metric, option.value)}
            sx={{
              textTransform: 'none',
              minWidth: 'unset',
              py: 0.5,
              px: 1.5,
              fontSize: '0.75rem',
              backgroundColor: metrics[metric] === option.value ? 
                option.color || '#4caf50' : 'transparent',
              '&:hover': {
                backgroundColor: metrics[metric] === option.value ? 
                  option.color || '#4caf50' : 'rgba(0, 0, 0, 0.04)'
              }
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
      <DialogTitle sx={{ 
        bgcolor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          CVSS v4.0 Calculator
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ bgcolor: '#fafafa', p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Score Display */}
          <Paper elevation={3} sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: '#e3f2fd',
            borderLeft: '4px solid',
            borderColor: severity === 'CRITICAL' ? '#d32f2f' :
                        severity === 'HIGH' ? '#f57c00' :
                        severity === 'MEDIUM' ? '#fbc02d' : '#388e3c'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Base Score:</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {score || '--'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Severity:</Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{ 
                    color: severity === 'CRITICAL' ? '#d32f2f' :
                          severity === 'HIGH' ? '#f57c00' :
                          severity === 'MEDIUM' ? '#fbc02d' : '#388e3c'
                  }}
                >
                  {severity || '--'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">Vector String:</Typography>
                <Typography variant="body2" fontFamily="monospace" noWrap>
                  {vector || 'CVSS:4.0/...'}
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
                  { value: 'N', label: 'Network', color: '#4caf50' },
                  { value: 'A', label: 'Adjacent', color: '#8bc34a' },
                  { value: 'L', label: 'Local', color: '#cddc39' },
                  { value: 'P', label: 'Physical', color: '#ffeb3b' }
                ]}
              />
              <MetricButtonGroup
                label="Attack Complexity"
                metric="AC"
                options={[
                  { value: 'L', label: 'Low', color: '#4caf50' },
                  { value: 'H', label: 'High', color: '#f44336' }
                ]}
              />
              <MetricButtonGroup
                label="Privileges Required"
                metric="PR"
                options={[
                  { value: 'N', label: 'None', color: '#4caf50' },
                  { value: 'L', label: 'Low', color: '#8bc34a' },
                  { value: 'H', label: 'High', color: '#f44336' }
                ]}
              />
              <MetricButtonGroup
                label="User Interaction"
                metric="UI"
                options={[
                  { value: 'N', label: 'None', color: '#4caf50' },
                  { value: 'R', label: 'Required', color: '#f44336' }
                ]}
              />
              <MetricButtonGroup
                label="Scope"
                metric="SC"
                options={[
                  { value: 'U', label: 'Unchanged', color: '#4caf50' },
                  { value: 'C', label: 'Changed', color: '#f44336' }
                ]}
              />
            </Grid>
          </Paper>

          {/* Vulnerability Metrics */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Vulnerability Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <MetricButtonGroup
                label="Confidentiality"
                metric="VC"
                options={[
                  { value: 'H', label: 'High', color: '#f44336' },
                  { value: 'L', label: 'Low', color: '#ff9800' },
                  { value: 'N', label: 'None', color: '#4caf50' }
                ]}
              />
              <MetricButtonGroup
                label="Integrity"
                metric="VI"
                options={[
                  { value: 'H', label: 'High', color: '#f44336' },
                  { value: 'L', label: 'Low', color: '#ff9800' },
                  { value: 'N', label: 'None', color: '#4caf50' }
                ]}
              />
              <MetricButtonGroup
                label="Availability"
                metric="VA"
                options={[
                  { value: 'H', label: 'High', color: '#f44336' },
                  { value: 'L', label: 'Low', color: '#ff9800' },
                  { value: 'N', label: 'None', color: '#4caf50' }
                ]}
              />
            </Grid>
          </Paper>

          {/* Threat Metrics */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Threat Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <MetricButtonGroup
                label="Exploit Maturity"
                metric="E"
                options={[
                  { value: 'A', label: 'Attacked', color: '#f44336' },
                  { value: 'P', label: 'POC', color: '#ff9800' },
                  { value: 'U', label: 'Unreported', color: '#4caf50' },
                  { value: 'X', label: 'Not Defined', color: '#9e9e9e' }
                ]}
              />
              <MetricButtonGroup
                label="Remediation Level"
                metric="RL"
                options={[
                  { value: 'O', label: 'Official', color: '#4caf50' },
                  { value: 'T', label: 'Temporary', color: '#8bc34a' },
                  { value: 'W', label: 'Workaround', color: '#ff9800' },
                  { value: 'U', label: 'Unavailable', color: '#f44336' },
                  { value: 'X', label: 'Not Defined', color: '#9e9e9e' }
                ]}
              />
              <MetricButtonGroup
                label="Report Confidence"
                metric="RC"
                options={[
                  { value: 'C', label: 'Confirmed', color: '#4caf50' },
                  { value: 'R', label: 'Reasonable', color: '#8bc34a' },
                  { value: 'U', label: 'Unknown', color: '#f44336' },
                  { value: 'X', label: 'Not Defined', color: '#9e9e9e' }
                ]}
              />
            </Grid>
          </Paper>

          {/* Environmental Metrics */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Environmental Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <MetricButtonGroup
                label="Confidentiality Req"
                metric="CR"
                options={[
                  { value: 'H', label: 'High', color: '#f44336' },
                  { value: 'M', label: 'Medium', color: '#ff9800' },
                  { value: 'L', label: 'Low', color: '#4caf50' },
                  { value: 'X', label: 'Not Defined', color: '#9e9e9e' }
                ]}
              />
              <MetricButtonGroup
                label="Integrity Req"
                metric="IR"
                options={[
                  { value: 'H', label: 'High', color: '#f44336' },
                  { value: 'M', label: 'Medium', color: '#ff9800' },
                  { value: 'L', label: 'Low', color: '#4caf50' },
                  { value: 'X', label: 'Not Defined', color: '#9e9e9e' }
                ]}
              />
              <MetricButtonGroup
                label="Availability Req"
                metric="AR"
                options={[
                  { value: 'H', label: 'High', color: '#f44336' },
                  { value: 'M', label: 'Medium', color: '#ff9800' },
                  { value: 'L', label: 'Low', color: '#4caf50' },
                  { value: 'X', label: 'Not Defined', color: '#9e9e9e' }
                ]}
              />
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        bgcolor: '#f5f5f5', 
        borderTop: '1px solid #ddd', 
        p: 2 
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained" 
          color="primary"
          disabled={!score}
        >
          Apply CVSS Score
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CVSSv4Calculator;