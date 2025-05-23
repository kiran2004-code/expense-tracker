// src/TodayEntries.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, CalendarDays } from 'lucide-react';

function TodayEntries() {
  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const BASE = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.get(`${BASE}/api/expenses`, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
      const today = format(new Date(), 'yyyy-MM-dd');

      const filtered = res.data.filter((entry) =>
        format(new Date(entry.date), 'yyyy-MM-dd') === today
      );

      setTodayData(filtered);
    } catch (err) {
      console.error('Error fetching today entries', err);
    }
  };

  const incomeEntries = todayData.filter((e) => e.type === 'Income');
  const expenseEntries = todayData.filter((e) => e.type === 'Expense');

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-center text-indigo-700 dark:text-indigo-300 mb-4 flex items-center justify-center gap-2">
        <CalendarDays className="text-indigo-500 dark:text-indigo-300" />
        Today’s Entries - {format(new Date(), 'dd MMMM yyyy')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Income List */}
        <div>
          <h3 className="text-green-600 dark:text-green-400 text-md font-semibold flex items-center gap-2 mb-2">
            <ArrowDownCircle className="text-green-500 dark:text-green-400" size={20} /> Income
          </h3>
          {incomeEntries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No income added today.</p>
          ) : (
            <ul className="space-y-2">
              {incomeEntries.map((entry) => (
                <li
                  key={entry._id}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500 p-3 rounded-md"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-green-700 dark:text-green-300">
                      {entry.title}
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      ₹{entry.amount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{entry.category}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Expense List */}
        <div>
          <h3 className="text-red-600 dark:text-red-400 text-md font-semibold flex items-center gap-2 mb-2">
            <ArrowUpCircle className="text-red-500 dark:text-red-400" size={20} /> Expense
          </h3>
          {expenseEntries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No expenses added today.</p>
          ) : (
            <ul className="space-y-2">
              {expenseEntries.map((entry) => (
                <li
                  key={entry._id}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500 p-3 rounded-md"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-red-700 dark:text-red-300">{entry.title}</span>
                    <span className="font-bold text-red-700 dark:text-red-300">
                      ₹{entry.amount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{entry.category}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodayEntries;
