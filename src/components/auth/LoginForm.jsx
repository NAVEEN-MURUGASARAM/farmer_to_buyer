// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = ({ setCurrentScreen }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentScreen('farmer-dashboard');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-gray-600">Enter your phone number and password to login</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};