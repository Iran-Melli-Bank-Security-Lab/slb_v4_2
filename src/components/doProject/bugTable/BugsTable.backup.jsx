import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Select,
  MenuItem,
  LinearProgress,
  Box,
  IconButton,
  Button,
  styled,
} from '@mui/material';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { findBugById } from '../../../utils/bugToTree';
import moment from 'moment-jalaali';
import { useUserId } from "../../../hooks/useUserId";
import { getBugs } from '../../../api/bugs/getBugs';
import { useParams } from "react-router";
const STATUS_OPTIONS = [
  { value: 'passed', label: 'Passed', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'notAccessible', label: 'Not Accessible', color: 'warning' },
  { value: 'notApplicable', label: 'Not Applicable', color: 'info' },
];

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
}));

const StatusIndicator = styled(Box)(({ status, theme }) => ({
  display: 'inline-block',
  width: 12,
  height: 12,
  borderRadius: '50%',
  marginRight: 8,
  backgroundColor: 
    status === 'passed' ? theme.palette.success.main :
    status === 'failed' ? theme.palette.error.main :
    status === 'notAccessible' ? theme.palette.warning.main :
    status === 'notApplicable' ? theme.palette.info.main :
    theme.palette.grey[500],
}));

const BugsTable = ({ projectManager }) => {
  const { id: projectId } = useParams();
  const userId = useUserId();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [bugs, setBugs] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [startDate, setStartDate] = useState(null);

  const countBugs = useCallback((bugs, status = null) => {
    let count = 0;
    const stack = [...bugs];
    
    while (stack.length) {
      const bug = stack.pop();
      if ((!bug.children || bug.children.length === 0) && (!status || bug.status === status)) {
        count++;
      }
      if (bug.children) {
        stack.push(...bug.children);
      }
    }
    
    return count;
  }, []);


  const updateBugState = useCallback((bugs, id, updates) => {
    return bugs.map(bug => {
      if (bug.id === id) {
        return { ...bug, ...updates };
      }
      if (bug.children) {
        return { ...bug, children: updateBugState(bug.children, id, updates) };
      }
      return bug;
    });
  }, []);

  const calculateProgress = useCallback((bugs) => {
    const totalBugs = countBugs(bugs);
    const completedBugs = STATUS_OPTIONS.reduce(
      (sum, option) => sum + countBugs(bugs, option.value), 
      0
    );
    return totalBugs > 0 ? (completedBugs / totalBugs) * 100 : 0;
  }, [countBugs]);


 const handleSelectAllPassed = useCallback(() => {
    setBugs(prevBugs => {
      const updateAllBugs = (bugs) => {
        return bugs.map(bug => {
          if (!bug.children || bug.children.length === 0) {
            // Check if bug has any explicit non-passed status
            const hasExplicitStatus = ['failed', 'notAccessible', 'notApplicable'].includes(bug.status);
            
            // Only update if it doesn't have an explicit status
            return hasExplicitStatus 
              ? bug 
              : { ...bug, status: 'passed' };
          }
          return {
            ...bug,
            children: updateAllBugs(bug.children)
          };
        });
      };

      const updatedBugs = updateAllBugs(prevBugs);
      const newProgress = calculateProgress(updatedBugs);
      setProgress(newProgress);
      return updatedBugs;
    });
  }, [calculateProgress]);


  const handleDeselectAll = useCallback(() => {
    setBugs(prevBugs => {
      const resetAllBugs = (bugs) => {
        return bugs.map(bug => {
          if (!bug.children || bug.children.length === 0) {
            return { ...bug, status: undefined };
          }
          return {
            ...bug,
            children: resetAllBugs(bug.children)
          };
        });
      };

      const updatedBugs = resetAllBugs(prevBugs);
      const newProgress = calculateProgress(updatedBugs);
      setProgress(newProgress);
      return updatedBugs;
    });
  }, [calculateProgress]);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        setLoading(true);
        const data = await getBugs(projectId, userId);
        const bugTree = data[0].bugScopes; 
        console.log("bugTree : " , bugTree )
        const updatedBugTree = bugTree.map(bug => ({ 
          ...bug, 
          status: STATUS_OPTIONS.some(opt => opt.value === bug.status) ? bug.status : undefined
        }));
        setBugs(updatedBugTree);
        if (data.startDate) {
          setStartDate(data.startDate);
        }
        setProgress(calculateProgress(updatedBugTree));
      } catch (error) {
        console.error('Failed to fetch bug status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBugs();
  }, [projectId, userId, calculateProgress]);

  const handleRadioChange = useCallback((id, status) => {
    setBugs(prevBugs => {
      const updatedBugs = updateBugState(prevBugs, id, { status });
      const newProgress = calculateProgress(updatedBugs);
      setProgress(newProgress);
      
      if (status === 'failed') {
        const bug = findBugById(updatedBugs, id);
        sessionStorage.setItem('bugDetails', JSON.stringify({ 
          projectId, 
          userId, 
          bugId: id, 
          bugDetails: bug, 
          projectManager 
        }));
        window.open(`/bugdetails`, '_blank');
      }
      
      return updatedBugs;
    });
  }, [projectId, userId, projectManager, updateBugState, calculateProgress]);

  const handleStatusChange = useCallback((id, status) => {
    if (!STATUS_OPTIONS.some(opt => opt.value === status)) return;
    
    setBugs(prevBugs => {
      const updatedBugs = updateBugState(prevBugs, id, { status });
      const newProgress = calculateProgress(updatedBugs);
      setProgress(newProgress);
      return updatedBugs;
    });
  }, [updateBugState, calculateProgress]);

  const handleReset = useCallback((id) => {
    setBugs(prevBugs => {
      const updatedBugs = updateBugState(prevBugs, id, { status: undefined });
      const newProgress = calculateProgress(updatedBugs);
      setProgress(newProgress);
      return updatedBugs;
    });
  }, [updateBugState, calculateProgress]);

  const toggleExpand = useCallback((id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const StatusSelect = useMemo(() => styled(Select)(({ theme }) => ({
    minWidth: '180px',
    '& .MuiMenuItem-root': {
      fontWeight: 500,
    },
    '& .MuiSelect-select': {
      color: (props) => props.value ? theme.palette.text.primary : theme.palette.text.disabled,
    },
  })), []);

  const BugRow = memo(({ bug, level, expandedRows, onRadioChange, onStatusChange, onReset, onToggleExpand }) => {
    const hasStatus = STATUS_OPTIONS.some(opt => opt.value === bug.status);
    const currentStatus = hasStatus ? bug.status : undefined;
console.log("render in Bug Row *************************************")
    return (
      <React.Fragment>
        <TableRow sx={{ 
          backgroundColor: level % 2 === 0 ? 'background.paper' : 'action.hover',
          '&:hover': {
            backgroundColor: 'action.selected',
          }
        }}>
          <TableCell sx={{ pl: level * 4 }}>
            {bug.children?.length > 0 && (
              <IconButton 
                size="small" 
                onClick={() => onToggleExpand(bug.id)}
                aria-label={expandedRows[bug.id] ? 'Collapse' : 'Expand'}
              >
                {expandedRows[bug.id] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            <StatusIndicator status={currentStatus} />
            {bug.label}
          </TableCell>
          {bug.children?.length === 0 && (
            <>
              <TableCell>
                <Radio
                  checked={currentStatus === 'failed'}
                  onChange={() => onRadioChange(bug.id, 'failed')}
                  color="error"
                />
              </TableCell>
              <TableCell>
                <StatusSelect
                  value={currentStatus || ''}
                  onChange={(e) => onStatusChange(bug.id, e.target.value)}
                  size="small"
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em>Select status</em>;
                    }
                    const option = STATUS_OPTIONS.find(opt => opt.value === selected);
                    return (
                      <Box display="flex" alignItems="center">
                        <StatusIndicator status={option.value} />
                        {option.label}
                      </Box>
                    );
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Select status</em>
                  </MenuItem>
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <StatusIndicator status={option.value} />
                      {option.label}
                    </MenuItem>
                  ))}
                </StatusSelect>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => onReset(bug.id)}
                  color="secondary"
                  size="small"
                  disabled={!currentStatus}
                >
                  <RestartAltOutlinedIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                  disabled={currentStatus !== 'failed'}
                  onClick={() => onRadioChange(bug.id, 'failed')}
                  color="primary"
                  size="small"
                >
                  <EditNoteOutlinedIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </>
          )}
        </TableRow>
        {bug.children && expandedRows[bug.id] && (
          <BugRows 
            bugs={bug.children} 
            level={level + 1}
            expandedRows={expandedRows}
            onRadioChange={onRadioChange}
            onStatusChange={onStatusChange}
            onReset={onReset}
            onToggleExpand={onToggleExpand}
          />
        )}
      </React.Fragment>
    );
  });

  const BugRows = memo(({ bugs, level = 0, expandedRows, onRadioChange, onStatusChange, onReset, onToggleExpand }) => {
    
    return bugs.map(bug => (
      <BugRow
        key={bug.id}
        bug={bug}
        level={level}
        expandedRows={expandedRows}
        onRadioChange={onRadioChange}
        onStatusChange={onStatusChange}
        onReset={onReset}
        onToggleExpand={onToggleExpand}
      />
    ));
  });

  const ProgressBox = useMemo(() => {
    return (
      <Box sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: 'warning.light', 
        borderLeft: 4, 
        borderColor: 'warning.main',
        borderRadius: 1
      }}>
        <Typography variant="h6" color="warning.dark" fontWeight="bold">
          In-Progress Project
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body1" fontWeight="medium">
            Progress: {Math.round(progress)}%
          </Typography>
          {startDate && (
            <Typography variant="body1" fontWeight="medium">
              Started Test: {moment(startDate).format('jYYYY-jMM-jDD')}
            </Typography>
          )}
        </Box>

        <Box mt={2}>
          <ProgressBar variant="determinate" value={progress} />
        </Box>
      </Box>
    );
  }, [progress, startDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {ProgressBox}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          color="success"
          onClick={handleSelectAllPassed}
          startIcon={<CheckCircleOutlineIcon />}
          sx={{ textTransform: 'none' }}
        >
          Mark ALL as Passed
        </Button>
        <Button 
          variant="outlined" 
          color="secondary"
          onClick={handleDeselectAll}
          startIcon={<RestartAltOutlinedIcon />}
          sx={{ textTransform: 'none' }}
        >
          Reset All Statuses
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'common.white' }}>Bug Name</TableCell>
              <TableCell sx={{ color: 'common.white' }}>Failed</TableCell>
              <TableCell sx={{ color: 'common.white' }}>Status</TableCell>
              <TableCell sx={{ color: 'common.white' }}>Reset</TableCell>
              <TableCell sx={{ color: 'common.white' }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bugs.length > 0 ? (
              <BugRows 
                bugs={bugs} 
                expandedRows={expandedRows}
                onRadioChange={handleRadioChange}
                onStatusChange={handleStatusChange}
                onReset={handleReset}
                onToggleExpand={toggleExpand}
              />
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No bugs found for this project
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default memo(BugsTable);