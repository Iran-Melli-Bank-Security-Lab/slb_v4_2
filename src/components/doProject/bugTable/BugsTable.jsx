import React, { useState, useEffect } from 'react';
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
  Button,
  TextField,
  LinearProgress,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { convertToBugTree, findBugById } from '../../../utils/bugToTree';
import moment from 'moment-jalaali';
import {useUserId } from "../../../hooks/useUserId"
import { getBugs } from '../../../api/bugs/getBugs';
import { useParams } from "react-router";

const BugsTable = ({  projectManager }) => { 
      const { id } = useParams();
      const projectId = id ; 
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState('');
  const [progress, setProgress] = useState(0);
  const [bugs, setBugs] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [startDateDialogOpen, setStartDateDialogOpen] = useState(false);
  const [manualStartDate, setManualStartDate] = useState('');

  const userId = useUserId()
 
  console.log("id of project line 47 $$$$$$$$$ : " , id )
  useEffect(() => {
   
    const fetchBugs = async () => {
     
        console.log("projectId : " , projectId ) 
        console.log("user Id : " , userId )
        try {
        setLoading(true);
        // const { data } = await axiosPrivate.get(`${process.env.REACT_APP_SERVER_IP}project/bugscope/${projectId}/${userId}`);
        const {data} = await getBugs(projectId, userId,)
        console.log("data********************************** line 56  : " , data )
        const bugTree = convertToBugTree(data.bugScopes);
        const updatedBugTree = bugTree.map((bug) => ({ ...bug, status: bug.status || 'passed' }));
        setBugs(updatedBugTree);
        setComments(data.comments || '');
        if (data.startDate) {
          setStartDate(data.startDate);
        }
        updateProgress(updatedBugTree);
      } catch (error) {
        console.error('Failed to fetch bug status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, [projectId, userId]);

//   const handleSave = async () => {
//     try {
//       await axiosPrivate.patch(`${process.env.REACT_APP_SERVER_IP}project/saveProjectDetails`, {
//         projectId,
//         userId,
//         comments,
//         startDate: startDate === null ? new Date() : startDate,
//         progress,
//       });
//       console.log('Project details saved successfully');
//     } catch (error) {
//       console.error('Failed to save project details:', error);
//     }
//   };

  const handleStartTest = () => {
    setStartDateDialogOpen(true);
  };

//   const handleSetStartDate = async () => {
//     const gregorianDate = moment(manualStartDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
//     setStartDate(gregorianDate);
//     setStartDateDialogOpen(false);

//     try {
//       await axiosPrivate.patch(`${process.env.REACT_APP_SERVER_IP}project/savestartdate`, {
//         projectId,
//         userId,
//         startDate: gregorianDate,
//       });
//       console.log('Start date saved successfully');
//     } catch (error) {
//       console.error('Failed to save start date:', error);
//     }
//   };

  const handleRadioChange = async (id, status) => {
    const updatedBugs = updateBugState(bugs, id, { status });
    setBugs(updatedBugs);
    updateProgress(updatedBugs);

    // try {
    //   await axiosPrivate.patch(`${process.env.REACT_APP_SERVER_IP}project/updateBugStatus`, {
    //     projectId,
    //     userId,
    //     bugId: id,
    //     status,
    //     progress,
    //   });
    // } catch (error) {
    //   console.error('Failed to update bug status:', error);
    // }

    if (status === 'failed') {
      const bug = findBugById(updatedBugs, id);
      sessionStorage.setItem('bugDetails', JSON.stringify({ projectId, userId, bugId: id, bugDetails: bug, projectManager }));
      window.open(`/bugdetails`, '_blank');
    }
  };

  const handleStatusChange = async (id, status) => {
    const previousStatus = findBugById(bugs, id)?.status;
    const updatedBugs = updateBugState(bugs, id, { status });
    setBugs(updatedBugs);

    const totalBugs = countBugs(updatedBugs);
    const completedBugs = countBugs(updatedBugs, 'passed') + countBugs(updatedBugs, 'failed') + countBugs(updatedBugs, 'notAccessible') + countBugs(updatedBugs, 'notApplicable');

    if (status !== 'notAttempted' && previousStatus === 'notAttempted') {
      setProgress((prevProgress) => prevProgress + (100 / totalBugs));
    } else if (status === 'notAttempted' && previousStatus !== 'notAttempted') {
      setProgress((prevProgress) => prevProgress - (100 / totalBugs));
    }

    // try {
    //   await axiosPrivate.patch(`${process.env.REACT_APP_SERVER_IP}project/updateBugStatus`, {
    //     projectId,
    //     userId,
    //     bugId: id,
    //     status,
    //     progress,
    //   });
    // } catch (error) {
    //   console.error('Failed to update bug status:', error);
    // }
  };

  const handleReset = async (id) => {
    const updatedBugs = updateBugState(bugs, id, { status: 'notAttempted' });
    setBugs(updatedBugs);
    updateProgress(updatedBugs);

    // try {
    //   await axiosPrivate.patch(`${process.env.REACT_APP_SERVER_IP}project/updateBugStatus`, {
    //     projectId,
    //     userId,
    //     bugId: id,
    //     status: 'notAttempted',
    //     progress,
    //   });
    // } catch (error) {
    //   console.error('Failed to reset bug status:', error);
    // }
  };

  const updateProgress = (bugs) => {
    const totalBugs = countBugs(bugs);
    const completedBugs = countBugs(bugs, 'passed') + countBugs(bugs, 'failed') + countBugs(bugs, 'notAccessible') + countBugs(bugs, 'notApplicable');
    const newProgress = (completedBugs / totalBugs) * 100;
    setProgress(newProgress);
  };

  const countBugs = (bugs, status = null) => {
    let count = 0;
    bugs.forEach((bug) => {
      if (bug.children?.length === 0 || !bug.children) {
        if (!status || bug.status === status) count++;
      }
      if (bug.children) count += countBugs(bug.children, status);
    });
    return count;
  };

  const updateBugState = (bugs, id, updates) =>
    bugs.map((bug) =>
      bug.id === id
        ? { ...bug, ...updates }
        : bug.children
        ? { ...bug, children: updateBugState(bug.children, id, updates) }
        : bug
    );

  const toggleExpand = (id) => setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderBugRows = (bugs, level = 0) =>
    bugs.map((bug) => (
      <React.Fragment key={bug.id}>
        <TableRow>
          <TableCell style={{ paddingLeft: `${level * 20}px` }}>
            {bug.children?.length > 0 && (
              <IconButton size="small" onClick={() => toggleExpand(bug.id)}>
                {expandedRows[bug.id] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
            {bug.name}
          </TableCell>
          {bug.children?.length === 0 && (
            <>
              <TableCell>
                <Radio
                  checked={bug.status === 'failed'}
                  onChange={() => handleRadioChange(bug.id, 'failed')}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={bug.status || 'passed'}
                  onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                  size="small"
                  style={{ minWidth: '180px' }}
                >
                  <MenuItem value="passed" style={{ backgroundColor: '#d4edda' }}>Passed</MenuItem>
                  <MenuItem value="notAccessible" style={{ backgroundColor: '#f8d7da' }}>Not Accessible</MenuItem>
                  <MenuItem value="notApplicable" style={{ backgroundColor: '#fff3cd' }}>Not Applicable</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleReset(bug.id)}
                  disabled={false} // Enabled for all statuses
                >
                  <RestartAltOutlinedIcon fontSize="small" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  disabled={bug.status !== 'failed'}
                  onClick={() => handleRadioChange(bug.id, 'failed')}
                >
                  <EditNoteOutlinedIcon fontSize="small" />
                </Button>
              </TableCell>
            </>
          )}
        </TableRow>
        {bug.children && expandedRows[bug.id] && renderBugRows(bug.children, level + 1)}
      </React.Fragment>
    ));

  return (
    <Box>
      {console.log('startDate : ', startDate)}
      <Box className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <Typography variant="h6" className="text-lg font-bold text-yellow-700">
          In-Progress Project
        </Typography>

        <Box className="flex justify-between items-center mt-4">
          <Typography variant="body1" className="font-semibold">
            Progress: {Math.round(progress)}%
          </Typography>
          {startDate && (
            <Typography variant="body1" className="font-semibold">
              Started Test: {moment(startDate).format('jYYYY-jMM-jDD')}
              <Button
                style={{ border: 'none' }}
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleStartTest}
              >
                Start Test
              </Button>
            </Typography>
          )}
        </Box>

        <Box className="mt-2">
          <LinearProgress variant="determinate" value={progress} className="h-4 rounded-full bg-gray-300 bg-white" />
        </Box>
      </Box>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Failed</TableCell>
              <TableCell>Passed</TableCell>
              <TableCell>Reset</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderBugRows(bugs)}</TableBody>
        </Table>
      </TableContainer>

      {/* <TextField
        label="Comments"
        multiline
        rows={4}
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        variant="outlined"
        fullWidth
        className="mt-4 bg-white"
      /> */}

      {/* <Box className="flex justify-end mt-4">
        <Button variant="contained" color="primary" onClick={handleSave} className="mr-2">
          Save
        </Button>
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
      </Box> */}
{/* 
      <Dialog open={startDateDialogOpen} onClose={() => setStartDateDialogOpen(false)}>
        <DialogTitle>Set Start Date</DialogTitle>
        <DialogContent>
          <TextField
            style={{ marginTop: '10px' }}
            label="Start Date (YYYY-MM-DD)"
            fullWidth
            variant="outlined"
            value={manualStartDate}
            onChange={(e) => setManualStartDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDateDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSetStartDate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default BugsTable;
