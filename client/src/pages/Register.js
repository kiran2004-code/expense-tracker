// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const BASE = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const res = await axios.post(`${BASE}/api/auth/register`, form);
      setSuccess(true);
      setForm({ name: '', email: '', password: '' });

      // ✅ After 2 seconds, switch to login screen
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Register</h2>

      {success && <div className="text-green-600 mb-2 text-center">✅ Registered successfully! Redirecting...</div>}
      {error && <div className="text-red-600 mb-2 text-center">❌ {error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {/* ✅ Switch to Login Link */}
      <p className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;
