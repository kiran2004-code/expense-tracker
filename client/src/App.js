// src/App.js
import React, { useEffect, useState } from 'react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import ExpenseCalendar from './components/ExpenseCalendar';
import SummaryCards from './components/SummaryCards';
import LogoOverlay from './LogoOverlay';
import AuthScreen from './pages/AuthScreen';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TodayEntries from './components/TodayEntries';
import {
  ClipboardList,
  CalendarDays,
  BarChart2,
  MoreVertical,
  LogOut,
  Home,
  User,
  Settings as SettingsIcon,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import { Menu } from '@headlessui/react';
import axios from 'axios';

const BASE = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [view, setView] = useState('home');
  const [lastView, setLastView] = useState('home');
  const [addStatus, setAddStatus] = useState(null);
  const [refreshSummary, setRefreshSummary] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [logoutMessage, setLogoutMessage] = useState('');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');

  // Initialize theme on app start
  useEffect(() => {
    const initTheme = async () => {
      const token = localStorage.getItem('token');
      let theme = 'light';

      if (token) {
        try {
          const res = await axios.get(`${BASE}/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          theme = res.data.theme || 'light';
          const storedUser = JSON.parse(localStorage.getItem('user')) || {};
          localStorage.setItem('user', JSON.stringify({ ...storedUser, theme }));
        } catch (err) {
          console.error('Failed to fetch user theme:', err);
        }
      } else {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        theme = storedUser.theme || 'light';
      }

      document.documentElement.classList.toggle('dark', theme === 'dark');
      setCurrentTheme(theme);
      setThemeLoaded(true);
    };

    initTheme();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (target) => {
    if (['profile', 'settings'].includes(target)) setLastView(view);
    setShowTransition(true);
    setTimeout(() => {
      setView(target);
      setShowTransition(false);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setView('auth');
    setLogoutMessage('Logged out successfully');
    setTimeout(() => setLogoutMessage(''), 3000);

    document.documentElement.classList.remove('dark');
    setCurrentTheme('light');
  };

  // Safe dark mode toggle
  const handleDarkModeToggle = async () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    let token = localStorage.getItem('token');

    // Toggle theme locally
    const isDark = document.documentElement.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';

    // Update local storage immediately
    localStorage.setItem('user', JSON.stringify({ ...user, theme: newTheme }));
    setCurrentTheme(newTheme);

    // Only try backend if token exists
    if (!token) return;

    try {
      // Optional: refresh token logic if your backend supports it
      await axios.put(
        `${BASE}/api/auth/theme`,
        { theme: newTheme },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to update theme on backend:', err.response?.data || err.message);

      // If 401 Unauthorized, remove token & log out user safely
      if (err.response?.status === 401) {
        console.warn('Token invalid or expired. Logging out user.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setView('auth');
      }
    }
  };


  const renderMainApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-black dark:text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {!['profile', 'settings'].includes(view) && (
          <>
            <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md p-4 flex justify-center flex-wrap gap-6 border-b border-gray-300 dark:border-gray-700 rounded-lg">
              {view !== 'home' && <button onClick={() => handleNavigate('home')} className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 font-medium"><Home size={20} /> Home</button>}
              <button onClick={() => handleNavigate('expenses')} className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 font-medium"><ClipboardList size={20} /> All Expenses</button>
              <button onClick={() => handleNavigate('calendar')} className="flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-900 font-medium"><CalendarDays size={20} /> Calendar</button>
              <button onClick={() => handleNavigate('report')} className="flex items-center gap-2 text-purple-700 dark:text-purple-300 hover:text-purple-900 font-medium"><BarChart2 size={20} /> Report</button>
              <button onClick={() => handleNavigate('add')} className={`flex items-center gap-2 font-medium transition ${addStatus === 'success' ? 'text-green-600' : addStatus === 'error' ? 'text-red-600' : 'text-indigo-700 dark:text-indigo-300 hover:text-indigo-900'}`}>
                {addStatus === 'success' && <CheckCircle size={18} />}
                {addStatus === 'error' && <XCircle size={18} />}
                {addStatus === null && <Plus size={18} />} Add Entry
              </button>
              <Menu as="div" className="relative ml-auto">
                <Menu.Button className="text-gray-700 dark:text-white hover:text-gray-900"><MoreVertical size={24} /></Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
                  <Menu.Item>{({ active }) => <button onClick={() => handleNavigate('profile')} className={`w-full px-4 py-2 flex items-center gap-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}><User size={18} /> Profile</button>}</Menu.Item>
                  <Menu.Item>{({ active }) => <button onClick={() => handleNavigate('settings')} className={`w-full px-4 py-2 flex items-center gap-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}`}><SettingsIcon size={18} /> Settings</button>}</Menu.Item>
                  <Menu.Item>{({ active }) => <button onClick={handleLogout} className={`w-full px-4 py-2 flex items-center gap-2 text-sm text-red-600 ${active ? 'bg-red-50 dark:bg-red-900/30' : ''}`}><LogOut size={18} /> Logout</button>}</Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
            {view === 'home' && <><SummaryCards refresh={refreshSummary} /><TodayEntries /></>}
          </>
        )}
        {view === 'add' && <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-6"><h1 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">Add New Entry</h1><AddExpense onAdd={(status) => { setAddStatus(status); if (status === 'success') setRefreshSummary(prev => !prev); setTimeout(() => setAddStatus(null), 2000); }} /></div>}
        {view === 'expenses' && <ExpenseList />}
        {view === 'calendar' && <ExpenseCalendar />}
        {view === 'report' && <ExpenseChart />}
        {view === 'profile' && <Profile onBack={() => setView(lastView)} />}
        {view === 'settings' && <Settings onBack={() => setView(lastView)} onToggleDarkMode={handleDarkModeToggle} currentTheme={currentTheme} />}
      </div>
    </div>
  );

  if (!themeLoaded) return null;

  return (
    <div className="relative">
      <LogoOverlay show={showSplash || showTransition} mode={showSplash ? 'splash' : 'transition'} />
      <div className={`${showTransition ? 'blur-sm pointer-events-none' : ''}`}>
        {!showSplash && (isAuthenticated ? renderMainApp() : <>
          {logoutMessage && <div className="text-center text-green-600 font-medium mt-6">{logoutMessage}</div>}
          <AuthScreen
            onAuthSuccess={(data) => {
              if (data?.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ ...data.user, theme: data.user.theme || 'light' }));
                document.documentElement.classList.toggle('dark', data.user.theme === 'dark');
                setCurrentTheme(data.user.theme || 'light');
                setIsAuthenticated(true);
              }
            }}
          />
        </>)}
      </div>
    </div>
  );
}

export default App;
