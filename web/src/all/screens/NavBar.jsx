import React from 'react'
import { FaCog, FaUser,FaSearch } from 'react-icons/fa'; // Ensure you have react-icons installed
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
    <header className="flex justify-between items-center pt-4 pb-4 relative z-50  bg-white ml-12 mr-12 mb-3 mt-2">
      <div className="flex items-center">
        <Link to="/dashboard">
          <img
            src="/logo.png" 
            alt="Revise Logo"
            className="w-28 h-auto"
          />
        </Link>
        <div className="flex items-center lg:ml-10 sm:ml-2">
          <input
            type="text"
            placeholder="Search"
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button className="bg-pink-500 text-white py-2 ml-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300 shadow-sm">
            <FaSearch className="w-6 h-6" />
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
