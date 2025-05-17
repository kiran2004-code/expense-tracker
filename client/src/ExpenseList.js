import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [selectedCategory, selectedMonth, expenses]);

  const loadExpenses = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      loadExpenses();
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  };

  const filterExpenses = () => {
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
  };

  // Extract unique categories
  const categories = [...new Set(expenses.map((exp) => exp.category))];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">📋 All Expenses</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md text-gray-700"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-md text-gray-700"
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
        <p className="text-gray-500">No expenses found for selected filters.</p>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((exp) => (
            <div
              key={exp._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
            >
              <div>
                <p className="text-md font-medium text-gray-800">
                  {exp.title} - ₹{exp.amount}
                </p>
                <p className="text-sm text-gray-600">
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
