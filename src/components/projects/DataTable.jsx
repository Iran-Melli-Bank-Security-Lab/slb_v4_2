import { useState, useEffect } from 'react';
import {
  TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  TablePagination, TableSortLabel, TextField, Toolbar, Typography
} from '@mui/material';
import ProjectProgress from './ProjectProgress';
import { useSocket } from '../../context/SocketContext';
import { getProjects } from '../../api/projects/getProject';

export default function DataTable({ 
    columns, 
    fetchUserType = "manager", 
    title = "Projects" }) {

  const socket = useSocket();
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects(fetchUserType);
        setTableRows(res.projects);
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    fetchProjects();

    const handleNewProject = (project) => {
      setTableRows(prev => [project, ...prev]);
    };
    socket.on('projectCreated', handleNewProject);

    return () => {
      socket.off('projectCreated', handleNewProject);
    };
  }, [socket, fetchUserType]);


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
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, p: 2 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search…"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Toolbar>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.id}>
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? orderDirection : 'asc'}
                      onClick={() => handleSortRequest(col.id)}
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
            {paginated.map(row => (
              <TableRow key={row.id} hover>
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
            ))}
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
      />
    </Paper>
  );
}
