import { useState, useEffect } from 'react';
import {
  TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  TablePagination, TableSortLabel, TextField, Toolbar, Typography, Box, InputAdornment
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ProjectProgress from './ProjectProgress';
import { getProjects } from '../../api/projects/getProject';
import { useSession  } from '../../SessionContext';

export default function DataTable({ columns, fetchUserType = "manager", title = "Projects" , overrideRows ,
    doubleClickable = false,
    onRowDoubleClick,

 }) {

  const {user} = useSession().session
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {

    if(overrideRows){
      setTableRows(overrideRows)
      return ; 
    }

    const fetchProjects = async () => {
      try {
        const res = await getProjects(fetchUserType , user.id  );
        setTableRows(res.projects);
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    fetchProjects();
  }, [overrideRows ,  fetchUserType]);


  const handleSortRequest = (columnId) => {
    const isAsc = orderBy === columnId && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter, sort, paginate
  const filtered = tableRows.filter(row =>
    Object.values(row).some(val =>
      val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return orderDirection === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return orderDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      sx={(theme) => ({
        width: '100%',
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(180deg, ${alpha(
          theme.palette.background.paper,
          0.92
        )} 0%, ${theme.palette.background.paper} 100%)`,
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
      })}
    >
      <Toolbar
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          px: 3,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: '0.02em' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project overview and key activity at a glance
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search projects…"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={(theme) => ({
            minWidth: 240,
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
            },
          })}
        />
      </Toolbar>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={(theme) => ({
                '& th': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: theme.palette.text.secondary,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              })}
            >
              {columns.map(col => (
                <TableCell key={col.id}>
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? orderDirection : 'asc'}
                      onClick={() => handleSortRequest(col.id)}
                      sx={(theme) => ({
                        color: theme.palette.text.secondary,
                        '&.Mui-active': { color: theme.palette.text.primary },
                        '& .MuiTableSortLabel-icon': {
                          color: `${theme.palette.text.secondary} !important`,
                        },
                      })}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No projects found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, index) => (
                <TableRow 
                key={row._id} 
                hover 
                onDoubleClick={() => {
                  if (doubleClickable && onRowDoubleClick) {
                    onRowDoubleClick(row);
                  }
                }}
                sx={(theme) => ({
                  cursor: doubleClickable ? 'pointer' : 'default',
                  backgroundColor:
                    index % 2 === 0
                      ? theme.palette.background.paper
                      : alpha(theme.palette.primary.main, 0.02),
                  transition: 'background-color 150ms ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                  },
                  '& td': {
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                    py: 1.75,
                  },
                })}
                >
                  {columns.map(col => (
                    <TableCell key={col.id}>
                      {col.render 
                        ? col.render(row) 
                        : col.id === 'progress' 
                          ? <ProjectProgress row={row} col={col} />
                          : row[col.id]
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={(theme) => ({
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 2,
        })}
      />
    </Paper>
  );
}
