import React, { useEffect, useRef } from 'react'
import { FaCog, FaUser, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { searchRecords } from '../apis/api';
import { useNavigate } from 'react-router-dom';


const NavBar = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  const searchRef = useRef();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearch = async () => {
    console.log('Search Term:', searchTerm)
    const results = await searchRecords(searchTerm)
    console.log('Search Results:', results)
    setSearchResults(results)
  }

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SearchResults = ({ results }) => (
    <div className="absolute bg-white border rounded mt-2 w-full">
      {results.map((result, index) => (
       <div 
       key={index} 
       className="block p-2 hover:bg-gray-100 cursor-pointer" 
       onClick={() => navigate(`/edit-record`, { state: { id: result.id, readOnly: true } })}
     >
       <h2 className="font-bold">{result.question}</h2>
       <p>{result.solution}</p>
     </div>
      ))}
    </div>
  );

  return (
    <div>
      <header className="flex justify-between items-center pt-4 pb-4 relative z-50 bg-white ml-12 mr-12 mb-3 mt-2">
        <div className="flex items-center">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Revise Logo" className="w-28 h-auto" />
          </Link>
          <form className="relative">
            <div className="flex items-center lg:ml-10 sm:ml-2">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-96"
              />
            </div>
            {searchResults.length > 0 && <SearchResults results={searchResults} />}
          </form>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-pink-500 rounded-full p-2">
            <FaCog className="text-white w-6 h-6 cursor-pointer" />
          </div>
          <div className="bg-pink-500 rounded-full p-2">
            <FaUser className="text-white w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </header>
    </div>
  )
}

export default NavBar