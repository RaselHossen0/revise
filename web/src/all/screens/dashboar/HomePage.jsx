import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import fetechCategory from '../../apis/allAPis.js';

import {baseUrl,cateGory,apiUrl} from "../../const.js"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HomePage = () => {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('category');
  const email = localStorage.getItem('email');
  const [category, setCategory] = useState([]);

  const handleAdd = () => {
    navigate('/add-record');
  };
  
  useEffect(() => {
    fetechCategory();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch records from API
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/records');
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
    fetchRecords();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRecords = records.sort((a, b) => {
    let comparison = 0;
    if (orderBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (orderBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (orderBy === 'lastRevised') {
      comparison = new Date(b.lastRevised) - new Date(a.lastRevised);
    }
    return order === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="w-full h-screen">
      <NavBar />
      <div className="flex-grow pt-20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Records</h2>
          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300 shadow-sm"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        <hr className="mb-6" />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-purple-700 mr-4">Top Records</h3>
            <div className="grid grid-cols-4 gap-4">
              {category.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-purple-100 text-purple-700 py-1 px-2 rounded-md text-center"
                >
                  {cat.categoryName}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Sort by</span>
            <select className="border border-gray-300 rounded-md py-1 px-2">
              <option value="category">Category</option>
              <option value="title">Title</option>
              <option value="lastRevised">Last Revised</option>
            </select>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'category'}
                    direction={orderBy === 'category' ? order : 'asc'}
                    onClick={() => handleSortRequest('category')}
                  >
                    Category
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>Questions</StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSortRequest('title')}
                  >
                    Title
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={orderBy === 'lastRevised'}
                    direction={orderBy === 'lastRevised' ? order : 'asc'}
                    onClick={() => handleSortRequest('lastRevised')}
                  >
                    Last Revised
                  </TableSortLabel>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRecords
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((record) => (
                  <StyledTableRow key={record.id}>
                    <StyledTableCell>{record.category}</StyledTableCell>
                    <StyledTableCell>{record.question}</StyledTableCell>
                    <StyledTableCell>{record.title}</StyledTableCell>
                    <StyledTableCell>{record.lastRevised}</StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={records.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </div>
          </div>
          );
          };
          export default HomePage;