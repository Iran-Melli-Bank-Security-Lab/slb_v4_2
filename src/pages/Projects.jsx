import React, { useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  LinearProgress,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  TableSortLabel,
  TablePagination,
  Box,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  Pending,
  Warning,
  ArrowDropDown,
  ArrowDropUp
} from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  background: theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? '#2D3748' : '#f8fafc',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.03),
  },
  '&:last-child td': {
    borderBottom: 0,
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: 
      value === 100 ? theme.palette.success.main :
      value > 75 ? theme.palette.primary.main :
      value > 50 ? theme.palette.warning.main :
      theme.palette.error.main,
  },
}));

// Define your table columns with sorting capability
const columns = [
  { id: 'manager', label: 'Manager', sortable: true },
  { id: 'name', label: 'Project Name', sortable: true },
  { id: 'progress', label: 'Progress', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'letter', label: 'Reference', sortable: true },
  { id: 'version', label: 'Version', sortable: true },
  { id: 'date', label: 'Due Date', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false },
];

// Sample data rows with additional fields
const initialRows = [
  {
    id: 1,
    manager: 'Alice Smith',
    managerAvatar: 'AS',
    name: 'Website Redesign',
    progress: 75,
    status: 'In Progress',
    priority: 'high',
    letter: 'A-123',
    version: '1.0.2',
    date: '2025-04-20',
    teamSize: 5,
  },
  {
    id: 2,
    manager: 'Bob Johnson',
    managerAvatar: 'BJ',
    name: 'Mobile App Development',
    progress: 100,
    status: 'Completed',
    priority: 'medium',
    letter: 'B-456',
    version: '2.0.0',
    date: '2025-03-15',
    teamSize: 8,
  },
  {
    id: 3,
    manager: 'Carol Williams',
    managerAvatar: 'CW',
    name: 'Marketing Campaign',
    progress: 30,
    status: 'Delayed',
    priority: 'high',
    letter: 'C-789',
    version: '1.2.1',
    date: '2025-05-10',
    teamSize: 6,
  },
  {
    id: 4,
    manager: 'David Brown',
    managerAvatar: 'DB',
    name: 'Database Migration',
    progress: 90,
    status: 'In Progress',
    priority: 'low',
    letter: 'D-012',
    version: '3.1.4',
    date: '2025-04-05',
    teamSize: 3,
  },
  {
    id: 5,
    manager: 'Eva Davis',
    managerAvatar: 'ED',
    name: 'UI/UX Research',
    progress: 45,
    status: 'In Progress',
    priority: 'medium',
    letter: 'E-345',
    version: '0.9.8',
    date: '2025-05-25',
    teamSize: 4,
  },
];

// Status chip configuration
const statusConfig = {
  'Completed': { icon: <CheckCircle fontSize="small" />, color: 'success' },
  'In Progress': { icon: <Pending fontSize="small" />, color: 'primary' },
  'Delayed': { icon: <Warning fontSize="small" />, color: 'warning' },
};

// Priority indicator
const PriorityIndicator = ({ priority }) => {
  const colors = {
    high: 'error',
    medium: 'warning',
    low: 'success',
  };
  
  return (
    <Box
      component="span"
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: `${colors[priority]}.main`,
        display: 'inline-block',
        mr: 1,
      }}
    />
  );
};

export default function ProjectsTable() {
  const [rows, setRows] = useState(initialRows);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    Object.keys(row).some(
      (key) =>
        typeof row[key] === 'string' &&
        row[key].toLowerCase().includes(searchText)
    )
  );

  const sortedRows = filteredRows.sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'date') {
      return isAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    return isAsc
      ? a[orderBy]?.toString().localeCompare(b[orderBy]?.toString())
      : b[orderBy]?.toString().localeCompare(a[orderBy]?.toString());
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <Paper sx={{ p: 2, borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Project Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search projects..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <Tooltip title="Filters">
            <IconButton
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                      IconComponent={orderBy === column.id ? 
                        (order === 'asc' ? ArrowDropUp : ArrowDropDown) : 
                        () => <span style={{ width: 24 }} />}
                      sx={{
                        '& .MuiTableSortLabel-icon': {
                          opacity: 1,
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </StyledTableCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow key={row.id} hover>
                  <StyledTableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {row.managerAvatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {row.manager}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.teamSize} members
                        </Typography>
                      </Box>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box>
                      <Typography fontWeight={500}>{row.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {row.id}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 180 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PriorityIndicator priority={row.priority} />
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <ProgressBar variant="determinate" value={row.progress} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {row.progress}%
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      icon={statusConfig[row.status]?.icon}
                      label={row.status}
                      size="small"
                      color={statusConfig[row.status]?.color}
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Chip
                      label={row.letter}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 1,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      v{row.version}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography variant="body2">
                      {new Date(row.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(row.date) < new Date() && row.status !== 'Completed' 
                        ? `${Math.ceil((new Date() - new Date(row.date)) / (1000 * 60 * 60 * 24))} days overdue` 
                        : ''}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      />
    </Paper>
  );
}