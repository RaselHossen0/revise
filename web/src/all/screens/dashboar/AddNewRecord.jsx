import React, { useEffect, useState } from 'react';
import { FaCog, FaUser } from 'react-icons/fa'; // Ensure you have react-icons installed
import NavBar from '../NavBar';
import ReactSelect from 'react-select';
import { addRecordToDB, getAllCategories, uploadFile, deleteReferenceFromRecord } from '../../apis/api.js';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../const.js';

const AddNewRecordPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [category, setCategory] = useState([]);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState({
    categories: '',
    question: '',
    solution: ''
  });
  const [record, setRecord] = useState({
    categories: [],
    question: '',
    solution: '',
    logic: '',
    references: [],
    checkedForMail: true
  });
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedForMail, setCheckedForMail] = useState(true);
  const [isSubmitted, setIssubmitted] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordId, setRecordId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getAllCategories();
        setAllCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchAllCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 

  const handleCreateAnotherRecord = () => {
    // Reset the form and navigate to the new record page
    setRecord({
      categories: [],
      question: '',
      solution: '',
      logic: '',
      references: [],
      checkedForMail: true,
    });
    setSelectedCategories([]);
    setCheckedForMail(true);
    setIssubmitted(false);
    setFormFilled(false);
    setSelectedFile(null);
    setRecordId(null);
    navigate('/add-record');
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const updateRecord = await uploadFile(selectedFile, recordId);
      setRecord(updateRecord);
      setIssubmitted(false);
    } catch (error) {
      console.error(error);
    }
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() !== '') {
      setErrorMsg((prevErrorMsg) => ({ ...prevErrorMsg, [name]: '' }));
    }
    setRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    const categories = selectedOptions.map(option => option.value);
    setSelectedCategories(categories);
    setErrorMsg((prevErrorMsg) => ({ ...prevErrorMsg, categories: '' }));
  };

  const handleCheckBoxChange = (event) => {
    setCheckedForMail(event.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = {};
    if (selectedCategories.length > 3) {
      errorMsg.categories = 'Please attach only three categories';
    }
    if (selectedCategories.length < 1) {
      errorMsg.categories = 'Please select or add at least one category';
    }
    if (record.question.trim() === '') {
      errorMsg.question = 'Please add at least 1 question';
    }
    if (record.solution.trim() === '') {
      errorMsg.solution = 'Please add at least 1 solution';
    }

    if (Object.keys(errorMsg).length > 0) {
      setErrorMsg(errorMsg);
      return;
    }

    try {
      const user = { email: localStorage.getItem('email') };
      const recordData = {
        id: null,
        categories: selectedCategories,
        question: record.question,
        solution: record.solution,
        logic: record.logic,
        references: record.references,
        createdByUser: user,
        checkedForMail: checkedForMail
      };

      const id = await addRecordToDB(recordData);
      setRecordId(id);
      setIssubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveReference = async (referenceIndex) => {
    const referenceId = record.references[referenceIndex].id;
    try {
      await deleteReferenceFromRecord(recordId, referenceId);
      setRecord((prevRecord) => ({
        ...prevRecord,
        references: prevRecord.references.filter((_, index) => index !== referenceIndex)
      }));
    } catch (error) {
      console.error('Error removing reference:', error);
    }
  };

  return (
    <div className="mt-20">
      <NavBar />
      {errorMsg.categories && <p className="text-red-500 text-xs italic">{errorMsg.categories}</p>}
      {errorMsg.question && <p className="text-red-500 text-xs italic">{errorMsg.question}</p>}
      {errorMsg.solution && <p className="text-red-500 text-xs italic">{errorMsg.solution}</p>}

      {isSubmitted && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Added Successfully</h2>
            <p className="mb-6">Do you want to upload a file?</p>
            <div className="flex justify-end">
              <button

                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-4 hover:bg-gray-400 transition-colors duration-300"
                onClick={handleCreateAnotherRecord}
              >
                No
              </button>
              <button

                className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300"
                onClick={handleFileUpload}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
        
      <div className='w-full max-h-screen border px-10 py-10'>
        <div className="max-w-4xl pt-20 p-6 bg-white mx-auto rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Record</h1>
          <h4 className='mb-2'>Record your findings / experiences for revision as it may help you solving doubts in the future.</h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Category</label>
              <ReactSelect
                isMulti
                name="categories"
                options={allCategories.map((cat) => ({ value: cat, label: cat.categoryName }))}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleCategoryChange}
              />
              {errorMsg.categories && <p className="text-red-500 text-xs italic">{errorMsg.categories}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Question</label>
              <textarea
                name="question"
                placeholder="Enter a Question..."
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={record.question}
                onChange={handleChange}
              ></textarea>
              {errorMsg.question && <p className="text-red-500 text-xs italic">{errorMsg.question}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Solution</label>
              <textarea
                name="solution"
                placeholder="Enter a Solution..."
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={record.solution}
                onChange={handleChange}
              ></textarea>
              {errorMsg.solution && <p className="text-red-500 text-xs italic">{errorMsg.solution}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Logic</label>
              <input
                type="text"
                name="logic"
                placeholder="Input Logic"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={record.logic}
                onChange={handleChange}
              />
            </div>
           
            <div className="mb-6">
  <label className="block text-gray-700 mb-2">References:</label>
  {record && record.references && record.references.length > 0 ? (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Name/URI</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {record.references.map((reference, index) => (
          <tr key={reference.id}>
            <td className="border px-4 py-2">{reference.referenceNameOrURI}</td>
            <td className="border px-4 py-2">
              <button onClick={() => handleRemoveReference(index)}>
                Unlink
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No references found.</p>
  )}
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
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-pink-500"
                checked={checkedForMail}
                onChange={handleCheckBoxChange}
              />
            </div>

            <div className="flex justify-end">
              <button type="button" className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-4 hover:bg-gray-400 transition-colors duration-300" onClick={handleCreateAnotherRecord}>
                Cancel
              </button>
              <button type="submit" className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewRecordPage;
