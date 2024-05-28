import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginScreen from './all/screens/auth/Login';
import HomePage from './all/screens/dashboar/HomePage';
import AddNewRecordPage from './all/screens/dashboar/AddNewRecord';
import RegisterPage from './all/screens/auth/RegisterPage';
import EditRecordPage from './all/screens/dashboar/EditRecord';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="127004398121-0tsu2r81vevb6e2u4mmehfdjd6itg8rf.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* <Route path="/login" element={<LoginScreen />} /> */}
          <Route path='/' element={<LoginScreen />} />
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/add-record" element={<AddNewRecordPage />} />
          <Route path="/edit-record" element={<EditRecordPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;