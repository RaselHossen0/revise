import axios from 'axios';

// const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8089';

const baseURL = 'http://ec2-54-251-143-90.ap-southeast-1.compute.amazonaws.com:8089';

const api = axios.create({
  baseURL: baseURL,
});

const makeRequest = async (method, url, data = null, params = null, contentType) => {
  try {
const headers = {};
    if(contentType){
      headers['Content-Type'] = contentType;
    }else{
      headers['Content-Type'] = 'application/json';
    }
    const response = await api.request({
      method: method,
      url: url,
      data: data,
      params: params,
      headers: headers,
    });
    console.log(response);

    if (response.status === 200) {
      // console.log(response);
      return response.data;
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    throw new Error('Network error');
  }
};

const addRecordToDB = async (record) => {
  console.log(record);
  const url = '/records/addtodb';
  return makeRequest('post', url, record);
};

const uploadFile = async (file, recordId) => {
  const url = `/file/upload?recordId=${recordId}`;
  const formData = new FormData();
  formData.append('file', file);
  return makeRequest('post', url, formData, null,
    'multipart/form-data'
  );
};


const searchRecords = async (searchModel) => {
  const url = '/revise/search';
  return makeRequest('post', url, searchModel);
};




const getRecordDetails = async (recordId) => {
  const url = `/records/getarecorddetail?recordid=${recordId}`;
  return makeRequest('get', url);
};

const getRevisionDetails = async () => {
  const email = localStorage.getItem('email')
  const url = `/revise/letusrevise?usermail=${email}`;
  return makeRequest('get', url);
};


const getAllCategories = async () => {
  const mailId = localStorage.getItem('email')
  const url = `/revise/getallcategories?usermail=${mailId}`;
  return makeRequest('get', url);
};

// Function to fetch suggestions from the backend
const fetchSuggestionsApi = async (term) => {
  const mailId = localStorage.getItem('email')
  const url = `/revise/getsuggestions?key=${term}&usermail=${mailId}`;
  return makeRequest('get', url);
};


const fetchRecordsByIds = async (mailids) => {
  const url = `/records/getrecordsbyids?recordids=${mailids}`;
  return makeRequest('get', url);
};

const applyConfigChangesApi = async (updateConfigurationModels) => {
  const url = `/config/configuration`;
  return makeRequest('post', url, updateConfigurationModels);
};

const fetchConfigurationsApi = async (term) => {
  const mailId = localStorage.getItem('email')
  const url = `/config/configuration?usermail=${mailId}`;
  return makeRequest('get', url);
};

const deleteReferenceFromRecord = async (recordId, referenceId) => {
  const url = `/file/record/${recordId}/references/${referenceId}`;
  return makeRequest('delete', url);
};

const deleteARecord = async (recordId) => {
  const url = `/records/deleterecordbyid?recordid=${recordId}`;
  return makeRequest('delete', url);
};

export { addRecordToDB, uploadFile, searchRecords, getRecordDetails, applyConfigChangesApi,fetchRecordsByIds,
  getAllCategories, deleteReferenceFromRecord,fetchConfigurationsApi, getRevisionDetails, fetchSuggestionsApi,deleteARecord };
