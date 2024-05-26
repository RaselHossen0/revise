import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// Custom function to decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      const decodedToken = decodeJWT(user.credential);
      setProfile(decodedToken);
    }
  }, [user]);

  const handleLogin = async (email) => {
    console.log(email);
    try {
      const response = await fetch('http://ec2-54-251-143-90.ap-southeast-1.compute.amazonaws.com:8089/user/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userId": "string",
          "email": email,
          "name": "string",
          "roles": [
            {
              "id": 0,
              "roleName": "string"
            }
          ]
        }),
        'mode': 'cors',
      });
      const data = await response.json();
      // console.log(data.email);
      // alert(data);
      localStorage.setItem('email', data.email);
      localStorage.setItem('user', JSON.stringify(data));
      // alert('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in');
    }
  };

  useEffect(() => {
    if (profile) {
      handleLogin(profile.email);
    }
  }, [profile]);

  return (
    <div className="h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('https://source.unsplash.com/random')" }}>
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mt-4">
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              setUser(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
