// src/pages/AuthScreen.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const BASE = process.env.REACT_APP_API_BASE_URL;

function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setForm({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;

      const res = await axios.post(`${BASE}${url}`, payload);

      if (isLogin) {
        if (res.data.token && res.data.user) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          // ✅ Apply dark mode if user's preference is 'dark'
          if (res.data.user.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          // Proceed to authenticated screen
          setTimeout(() => {
            onAuthSuccess && onAuthSuccess(res.data);
          }, 100);
        } else {
          setError('❌ Invalid response from server');
        }
      } else {
        setSuccess('✅ Registered successfully. Please log in.');
        setTimeout(() => {
          setIsLogin(true);
          setForm({ name: '', email: '', password: '' });
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      setError(`❌ ${err.response?.data?.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-white px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-4 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full pl-10 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-10 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-white h-6 w-6 animate-spin"></div>
              </div>
            ) : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-white p-2 rounded-full shadow-md hover:shadow-lg">
            <FcGoogle size={24} />
          </button>
          <button className="bg-blue-600 p-2 rounded-full text-white shadow-md hover:shadow-lg">
            <FaFacebook size={24} />
          </button>
        </div>

        <div className="text-center mt-6 text-sm">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={toggleForm} className="text-blue-600 hover:underline">
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={toggleForm} className="text-blue-600 hover:underline">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
