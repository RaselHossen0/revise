import React, { useEffect } from 'react';
import { FaCog, FaUser } from 'react-icons/fa'; // Ensure you have react-icons installed
import NavBar from '../NavBar';
import fetechCategory from '../../apis/allAPis.js';
import { useState } from 'react';
import ReactSelect from 'react-select';
import { apiUrl } from '../../const.js';
const AddNewRecordPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [category, setCategory] = useState([]);
  console.log(user);

  useEffect(() => {
    fetechCategory().then(data => setCategory(data)).catch(error => console.error(error));
    console.log(category);
  }
  , []);
  const [preview, setPreview] = useState();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAdd = async() => {
    try {
      const response = await fetch(apiUrl+'/file/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "file": preview,
          "fileName": "string",
          "recordId": "string",
          "userId": "string"
        }),
        'mode': 'cors',

      });
      
    }
    catch(error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-20">
      <NavBar />
      <div className='w-full max-h-screen  border px-10 py-10'>
    <div className="max-w-4xl  pt-20 p-6 bg-white mx-auto rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Record</h1>
        <h4 className='mb-2'>Record your findings / experiences for revision as it may help you solving doubts in the future.</h4>
     
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Category</label>
          <ReactSelect
            isMulti
            name="categories"
            options={category.map((cat) => ({ value: cat, label: cat.categoryName }))}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            placeholder="Input Title"
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Question</label>
          <textarea
            placeholder="Enter a Question..."
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Solution</label>
          <textarea
            placeholder="Enter a Solution..."
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Logic</label>
          <input
            type="text"
            placeholder="Input Logic"
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button className="mt-2 text-pink-500">Add More Logic</button>
        </div>
        <div className="mb-6">
      <label className="block text-gray-700 mb-2">Upload Files</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500">
        <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="cursor-pointer">
          <p>Drag files here or click to upload</p>
        </label>
      </div>
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="File preview" className="w-64 h-64 object-cover" />
        </div>
      )}
    </div>
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 mr-4">Part of Mail Reminders?</label>
          <input type="checkbox" className="form-checkbox h-5 w-5 text-pink-500" />
        </div>
        <div className="flex justify-end">
          <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-4 hover:bg-gray-400 transition-colors duration-300">
            Cancel
          </button>
          <button className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300">
            Save changes
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AddNewRecordPage;
