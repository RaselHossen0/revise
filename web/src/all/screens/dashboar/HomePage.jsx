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
import { getRevisionDetails,searchRecords ,deleteARecord} from '../../apis/api.js';
import fetechCategory from '../../apis/allAPis.js';



import {baseUrl,cateGory,apiUrl} from "../../const.js"
import { FaEdit, FaTrash } from 'react-icons/fa';

const StyledTableCell = styled(TableCell)(({ theme }) => ({

  [`&.${tableCellClasses.head}`]: {
   backgroundColor: '#C0C0C0',

    //  color: theme.palette.common.white,
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
        const response = await getRevisionDetails();
        // const data = await response.json();
        setRecords(response);
        console.log(response);
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
// Step 1: Add a new state variable for sorting criteria
const [sortCriteria, setSortCriteria] = useState('category');

// Step 2: Modify the handleSubmit function to sort the search results based on the sorting criteria
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let searchModel = {
      searchstr: searchTerm,
      userName: localStorage.getItem("mail")
    }
    let results = await searchRecords(searchModel);
    
    // Sort the results based on the sortCriteria
    results.sort((a, b) => a[sortCriteria].localeCompare(b[sortCriteria]));

    setSearchResults(results);
    setSearchTerm('');
    setCurrentPage(1); // Reset to first page after each search

  } catch (error) {
    console.log('Error:', error.message);
  }
};

// Step 3: Add a function to handle changes in the sorting criteria
const handleSortChange = (e) => {
  setSortCriteria(e.target.value);
};

// Step 4: Modify the fetchTopRecords function to fetch only the top records based on a certain criteria
useEffect(() => {
  const fetchTopRecords = async () => {
    try {
      const records = await getRevisionDetails(); 
      
      // Sort the records and take the top 5
      records.sort((a, b) => b.daysPassedSinceLastVisit - a.daysPassedSinceLastVisit);
      setTopRecords(records.slice(0, 5));
      
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  fetchTopRecords();
}, []);
const handleEdit = (recordId) => {
  navigate(`/edit-record/${recordId}`);
};
const handleDelete = (recordId) => {
  return async () => {
    try {
      const response = await deleteARecord(recordId);
      console.log('Record deleted:', response);
      // Fetch records again to update the list
      setRecords(records.filter((record) => record.id !== recordId));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
};


// Modify the select element in the render method to call handleSortChange when its value changes

  const sortedRecords = records.sort((a, b) => {
    let comparison = 0;
    // if (orderBy === 'category') {
    //    comparison = a.category.localeCompare(b.category);
    // } else if (orderBy === 'title') {
    //   comparison = a.title.localeCompare(b.title);
    // } else if (orderBy === 'lastRevised') {
    //   comparison = new Date(b.lastRevised) - new Date(a.lastRevised);
    // }
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
            <select className="border border-gray-300 rounded-md py-1 px-2" value={sortCriteria} onChange={handleSortChange}>
  <option value="category">Category</option>
  <option value="question">Question</option>
  <option value="solution">Solution</option>
  <option value="lastRevised">Last Revised</option>

</select>
          </div>
        </div>
        <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <StyledTableCell>Category</StyledTableCell>
        <StyledTableCell>Question</StyledTableCell>
        <StyledTableCell>Solution</StyledTableCell>
        <StyledTableCell>Last Revised</StyledTableCell>
        <StyledTableCell>Logic</StyledTableCell>
        {/* <StyledTableCell>Created By</StyledTableCell> */}
        <StyledTableCell >Action</StyledTableCell>
        {/* <StyledTableCell>Days Passed Since Last Visit</StyledTableCell> */}
      </TableRow>
    </TableHead>
    <TableBody>
      {sortedRecords
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((record) => (
          <StyledTableRow key={record.id}>
            <StyledTableCell>
              {record.categories.map((cat) => cat.categoryName).join(', ')}
            </StyledTableCell>
            <StyledTableCell>{record.question}</StyledTableCell>
            <StyledTableCell>{record.solution}</StyledTableCell>
            <StyledTableCell>{new Date(...record.metaData.lastVisited).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  )}</StyledTableCell>
            <StyledTableCell>{record.logic}</StyledTableCell>
            <StyledTableCell>
              <div className="flex items-center space-x-2">
              <FaEdit  onClick={handleEdit(record.id)}/>
              <FaTrash onClick={handleDelete(record.id)}/>
              </div>
              </StyledTableCell>
            {/* <StyledTableCell>{record.createdByUser.email}</StyledTableCell> */}
            {/* <StyledTableCell>{record.daysPassedSinceLastVisit}</StyledTableCell> */}
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