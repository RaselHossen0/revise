import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userId', '1'); // Add this if userId is static or replace '1' with a variable if it's dynamic
        formData.append('name', name);
        formData.append('email', email);
        formData.append('roles', JSON.stringify([{ id: 0, roleName: 'USER' }])); // Replace this with the actual roles if they are dynamic
      
        try {
          const response = await fetch(`http://ec2-54-251-143-90.ap-southeast-1.compute.amazonaws.com:8089/user/init`, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                },
                
          });
          const data = await response.json();
       
          localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            alert('Registration successful');

        } catch (error) {
          console.error('Error registering:', error);
        }
      
        const data = Object.fromEntries(formData);
    
      };
  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-pink-500 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-gradient-radial from-pink-400 to-pink-600 relative">
          <div className="absolute inset-0 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("/circuit-pattern.png")' }}></div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-8 py-12 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-pink-500 mb-6">Register an account</h2>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 font-semibold mb-2">
              First Name
            </label>
            <input
  id="firstName"
  type="text"
  value={name}
  onChange={(e)=>setName(e.target.value)}
  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
/>
          </div>
          <div className="mb-4">
            <label htmlFor="companyEmail" className="block text-gray-700 font-semibold mb-2">
               Email
            </label>
            <input
              id="companyEmail"
              type="email"
              value={email}
                onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">
              Phone number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div> */}
          {/* <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div> */}
          <div className="mb-6">
            <button onClick={handleSubmit} className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition-colors duration-300">
              Register an Account
            </button>
          </div>
          <p className="text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;