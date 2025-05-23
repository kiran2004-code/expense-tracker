import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Trash2, ClipboardList } from 'lucide-react';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const BASE = process.env.REACT_APP_API_BASE_URL;

  const loadExpenses = async () => {
    try {
      const BASE = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.get(`${BASE}/api/expenses`, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
  };

  const filterExpenses = useCallback(() => {
    let filtered = [...expenses];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((exp) => exp.category === selectedCategory);
    }
    if (selectedMonth !== 'All') {
      filtered = filtered.filter(
        (exp) => new Date(exp.date).getMonth() + 1 === parseInt(selectedMonth)
      );
    }
    setFilteredExpenses(filtered);
  }, [expenses, selectedCategory, selectedMonth]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE}/api/expenses/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}});
      loadExpenses();
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const categories = [...new Set(expenses.map((exp) => exp.category))];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
        <ClipboardList size={20} /> All Expenses
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-800"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-800"
        >
          <option value="All">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No expenses found for selected filters.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((exp) => (
            <div
              key={exp._id}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="text-md font-medium text-gray-800 dark:text-white">
                  {exp.title} - ₹{exp.amount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.category} | {new Date(exp.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(exp._id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
