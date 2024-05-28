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
import { getRevisionDetails, searchRecords, deleteARecord } from '../../apis/api.js';
import fetechCategory from '../../apis/allAPis.js';
import ConfirmationModal from '../components/ConfirmationModal.jsx';
import { baseUrl, cateGory, apiUrl } from "../../const.js";
import { FaArrowCircleRight, FaEdit, FaLink, FaThLarge, FaTrash  } from 'react-icons/fa';
import RecordCard from '../components/RecordCard.jsx';




const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#C0C0C0',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 0,
    width: '100px',
    
   
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toDeleteID, setToDeleteID] = useState(null);

  const navigate = useNavigate();

  const handleAdd = () => {
    navigate('/add-record');
  };

  useEffect(() => {
    fetechCategory();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await getRevisionDetails();
        setRecords(response);
  
        const topCategoryCounts = response.reduce((acc, record) => {
          record.categories.forEach((category) => {
            acc[category.categoryName] = acc[category.categoryName] + 1 || 1;
          });
          return acc;
        }, {});
  
        const topCategories = Object.entries(topCategoryCounts)
          .sort(([, aCount], [, bCount]) => bCount - aCount)
          .slice(0, 5)
          .map(([categoryName, count]) => ({ categoryName, count }));
  
        setTopRecords(topCategories);
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
  
  const sortedRecords = records.sort((a, b) => {
    let comparison = 0;
    if (a[orderBy] < b[orderBy]) {
      comparison = -1;
    } else if (a[orderBy] > b[orderBy]) {
      comparison = 1;
    }
    return order === 'asc' ? comparison : -comparison;
  });

  const [sortCriteria, setSortCriteria] = useState('category');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let searchModel = {
        searchstr: searchTerm,
        userName: localStorage.getItem("mail")
      }
      let results = await searchRecords(searchModel);
      
      results.sort((a, b) => a[sortCriteria].localeCompare(b[sortCriteria]));

      setSearchResults(results);
      setSearchTerm('');
      setCurrentPage(1);

    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };
  const [topRecords, setTopRecords] = useState([]);
  
  
  const handleDelete = (recordId) => {
    setIsModalOpen(true);
    setToDeleteID(recordId);
  };

  const handleConfirm = async () => {
    try {
      const response = await deleteARecord(toDeleteID);
      console.log('Record deleted:', response);
      setRecords(records.filter((record) => record.id !== toDeleteID));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleEditRecord = (recordId,readOnly) => {
    navigate('/edit-record', { state: { id: recordId,readOnly:readOnly } });
  };



  const [showAllRecords, setShowAllRecords] = useState(false);
  const handleShowMoreTopRecords = () => {
    setShowAllRecords(true);
  };

  return (
    <div className="w-full h-screen">
      <NavBar />
      <ConfirmationModal
        open={isModalOpen}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      />
      <div className="flex-grow  ml-12 mr-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">My Records</h2>
          <button
            className="bg-pink-500 text-white py-1 px-10 rounded-md hover:bg-pink-600 transition-colors duration-300 shadow-sm"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        
        <hr className="mb-6" />
<div className='flex flex-row'>
  <div className="text-lg font-semibold mb-4 w-full text-grey">Top 5 Records:</div>
</div>
<div className="flex flex-nowrap justify-start items-start">
  {topRecords.length === 0 && (
    <div className="text-gray-500 text-lg">No records found</div>
  )}
  {topRecords.slice(0, topRecords.length).map((record, index) => (
    <RecordCard record={record} index={index} />
  ))}
</div>

    <div className="flex justify-between items-center mb-4">
         <span >All Files</span>
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
    <StyledTableCell>
      <TableSortLabel
        active={orderBy === 'category'}
        direction={orderBy === 'category' ? order : 'asc'}
        onClick={() => handleSortRequest('category')}
      >
        Category
      </TableSortLabel>
    </StyledTableCell>
    <StyledTableCell>
      <TableSortLabel
        active={orderBy === 'question'}
        direction={orderBy === 'question' ? order : 'asc'}
        onClick={() => handleSortRequest('question')}
      >
        Question
      </TableSortLabel>
    </StyledTableCell>
    <StyledTableCell>
      <TableSortLabel
        active={orderBy === 'solution'}
        direction={orderBy === 'solution' ? order : 'asc'}
        onClick={() => handleSortRequest('solution')}
      >
        Solution
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
    <StyledTableCell>
      <TableSortLabel
        active={orderBy === 'logic'}
        direction={orderBy === 'logic' ? order : 'asc'}
        onClick={() => handleSortRequest('logic')}
      >
        Logic
      </TableSortLabel>
    </StyledTableCell>
    <StyledTableCell>Action</StyledTableCell>
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
                    <StyledTableCell >
            {record.question}
          </StyledTableCell>
          <StyledTableCell >
            {record.solution}
          </StyledTableCell>
          <StyledTableCell >
            {new Date(...record.metaData.lastVisited).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }
            )}
          </StyledTableCell>
          <StyledTableCell >
            {record.logic}
          </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center space-x-2">
                        <FaEdit onClick={() => handleEditRecord(record.id,false)} />
                        <FaTrash onClick={() => handleDelete(record.id)} />
                        <FaArrowCircleRight onClick={() => handleEditRecord(record.id,true)} />
                        {/* <FaLink onClick={()=>handleFileView(record.id)} /> */}
                      </div>
                    </StyledTableCell>
                   
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
