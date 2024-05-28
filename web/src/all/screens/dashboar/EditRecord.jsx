import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  addRecordToDB,
  getRecordDetails,
  uploadFile,
  getAllCategories,
  deleteReferenceFromRecord,
  deleteARecord
} from '../../apis/api.js';
import NavBar from '../NavBar';
import ReactSelect from 'react-select';
import ConfirmationModal from '../components/ConfirmationModal';

const EditRecordPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const readOnly=state.readOnly;
  console.log(state);

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
    checkedForMail: false
  });

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedForMail, setCheckedForMail] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [preview, setPreview] = useState(null);

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

  useEffect(() => {
    const recordId = state.id;
    setRecordId(recordId);
    getRecordDetails(recordId)
      .then((response) => {
        const recordData = response;
        setRecord({
          categories: recordData.categories,
          question: recordData.question,
          solution: recordData.solution,
          logic: recordData.logic,
          references: recordData.references,
          checkedForMail: recordData.checkedForMail
        });
        setCheckedForMail(recordData.checkedForMail);
        setSelectedCategories(recordData.categories);
      })
      .catch((error) => {
        console.error('Error fetching record details:', error);
      });
  }, [state.id]);

  const handleFileChange = (e) => {
    if (readOnly) return; // Prevent file change if in read-only mode

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

  const handleFileUpload = async () => {
    try {
      const updateRecord = await uploadFile(selectedFile, recordId);
      setRecord(updateRecord);
    } catch (error) {
      console.log('Error uploading file:', error);
    }
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    if (readOnly) return; // Prevent field change if in read-only mode

    const { name, value } = e.target;
    setRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    if (readOnly) return; // Prevent category change if in read-only mode

    const categories = selectedOptions.map(option => option.value);
    setSelectedCategories(categories);
    setErrorMsg((prevErrorMsg) => ({ ...prevErrorMsg, categories: '' }));
  };

  const handleCheckBoxChange = (event) => {
    if (readOnly) return; // Prevent checkbox change if in read-only mode

    setCheckedForMail(event.target.checked);
  }

  const handleDeleteChange = () => {
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteARecord(recordId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (readOnly) return; // Prevent form submission if in read-only mode

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
        id: state.id,
        categories: selectedCategories,
        question: record.question,
        solution: record.solution,
        logic: record.logic,
        references: record.references,
        createdByUser: user,
        checkedForMail: checkedForMail
      };

      await addRecordToDB(recordData);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveReference = async (referenceIndex) => {
    if (readOnly) return; // Prevent removing reference if in read-only mode

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
    <div className="">
      <NavBar />
      <div className='w-full h-screen  '>
        <div className="max-w-4xl  p-6 bg-white mx-auto rounded-lg border shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Record</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Category</label>
              <ReactSelect
                isMulti
                name="categories"
                options={allCategories.map((cat) => ({ value: cat, label: cat.categoryName }))}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedCategories.map((cat) => ({ value: cat, label: cat.categoryName }))}
                onChange={handleCategoryChange}
                isDisabled={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
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
                readOnly={readOnly}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">References:</label>
              {record.references.length > 0 ? (
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
                          {!readOnly && (
                            
                            <button
                            className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                            onClick={() => handleRemoveReference(index)}
                          >
                            Unlink
                          </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No references linked.</p>
          )}
        </div>

        {!readOnly && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Link New Reference</label>
            <input
              type="file"
              name="file"
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <button
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
                onClick={handleFileUpload}
              >
                Upload
              </button>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Notify Team by Email</label>
          <input
            type="checkbox"
            name="checkedForMail"
            checked={checkedForMail}
            onChange={handleCheckBoxChange}
            className="form-checkbox h-5 w-5 text-pink-500"
            disabled={readOnly}
          />
        </div>

        {!readOnly && (
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors duration-300"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
              onClick={handleDeleteChange}
            >
              Delete
            </button>
          </div>
        )}
      </form>
    </div>
    {isDeleteModalOpen && (
      <ConfirmationModal
        open={isDeleteModalOpen}
        handleClose={() => setIsDeleteModalOpen(false)}
        handleConfirm={handleConfirmDelete}
      />
    )}
  </div>
</div>
);
};

export default EditRecordPage;
