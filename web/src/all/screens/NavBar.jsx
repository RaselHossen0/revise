import React from 'react'
import { FaCog, FaUser,FaSearch } from 'react-icons/fa'; // Ensure you have react-icons installed
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
       <header className="flex justify-between items-center p-4  fixed top-0 left-0 right-0 z-50  mb-2">
      <div className="flex items-center">
      <Link to="/dashboard">
  <span className="text-pink-500 font-bold mr-4">REVISE</span>
</Link>
        <div className="flex items-cente justify-center">
          <input
            type="text"
            placeholder="Search"
            className="py-2 px-4  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button className="bg-pink-500 text-pink-100 py-2 ml-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300 shadow-sm">
            <FaSearch className="text-white w-6 h-6 cursor-pointer " />
            </button>
         
        </div>

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
