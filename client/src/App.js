import React, { useEffect, useState } from 'react';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import ExpenseChart from './ExpenseChart';
import ExpenseCalendar from './ExpenseCalendar';
import SummaryCards from './SummaryCards';
import LogoOverlay from './LogoOverlay';
import { ClipboardList, CalendarDays, BarChart2 } from 'lucide-react';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [view, setView] = useState('home'); // views: home, expenses, calendar, report
  const [addStatus, setAddStatus] = useState(null); // null | 'success' | 'error'
  const [refreshSummary, setRefreshSummary] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (target) => {
    setShowTransition(true);
    setTimeout(() => {
      setView(target);
      setShowTransition(false);
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Logo animation overlay */}
      <LogoOverlay show={showSplash || showTransition} mode={showSplash ? 'splash' : 'transition'} />

      {/* Main app content with blur during transition */}
      <div className={`${showTransition ? 'blur-sm pointer-events-none' : ''}`}>
        {!showSplash && (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Sticky NavBar */}
              <div className="sticky top-0 z-40 bg-white shadow-md p-4 flex justify-center flex-wrap gap-6 border-b rounded-lg">
                <button
                  onClick={() => handleNavigate('expenses')}
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
                >
                  <ClipboardList size={20} /> All Expenses
                </button>

                <button
                  onClick={() => handleNavigate('calendar')}
                  className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
                >
                  <CalendarDays size={20} /> Calendar
                </button>

                <button
                  onClick={() => handleNavigate('report')}
                  className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
                >
                  <BarChart2 size={20} /> Report
                </button>

                <button
                  onClick={() => handleNavigate('add')}
                  className={`flex items-center gap-2 font-medium transition ${
                    addStatus === 'success'
                      ? 'text-green-600'
                      : addStatus === 'error'
                      ? 'text-red-600'
                      : 'text-indigo-700 hover:text-indigo-900'
                  }`}
                >
                  {addStatus === 'success' && '✅'}
                  {addStatus === 'error' && '❌'}
                  {addStatus === null && '➕'} Add Entry
                </button>

              </div>


              {/* Summary Cards */}
              <SummaryCards refresh={refreshSummary} />
              {/* Header */}
              {/* Conditional Views */}
              {view === 'add' && (
                <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                  <h1 className="text-2xl font-bold text-center text-blue-700">Add New Entry</h1>
                  <AddExpense onAdd={() => setRefreshSummary(prev => !prev)} />
                </div>
              )}

              {view === 'expenses' && <ExpenseList />}
              {view === 'calendar' && <ExpenseCalendar />}
              {view === 'report' && <ExpenseChart />}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
