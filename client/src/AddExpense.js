import React, { useState } from 'react';
import axios from 'axios';
import {
  Tag,
  DollarSign,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import SummaryCards from './SummaryCards';

function AddExpense({ onAdd }) {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [status, setStatus] = useState(null);
  const [refreshKey, setRefreshKey] = useState(false); // For SummaryCards refresh

  const BASE = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const entry = {
        title,
        amount: parseFloat(amount),
        category: type === 'Income' ? 'Income' : category,
        type,
        date: new Date(),
      };

      await axios.post(`${BASE}/api/expenses`, entry, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setTitle('');
      setAmount('');
      setCategory('Food');
      setType('');
      setStatus('success');
      setRefreshKey((prev) => !prev); // refresh SummaryCards
      onAdd && onAdd('success');
    } catch (err) {
      setStatus('error');
      onAdd && onAdd('error');
    }

    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ✅ Summary Cards on Top */}
      <SummaryCards refresh={refreshKey} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => setType('Expense')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
              type === 'Expense'
                ? 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-red-400'
            }`}
          >
            <ArrowDownCircle size={18} /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType('Income')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
              type === 'Income'
                ? 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
            <ArrowUpCircle size={18} /> Income
          </button>
        </div>

        {type && (
          <>
            <div className="relative">
              <FileText className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-blue-400"
              />
            </div>

            <div className="relative">
              <DollarSign className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-blue-400"
              />
            </div>

            {type === 'Expense' && (
              <div className="relative">
                <Tag className="absolute top-3 left-3 text-gray-400" size={18} />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-blue-400"
                >
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Internet">Internet</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Transport">Transport</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded-md font-medium transition ${
            status === 'success'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : status === 'error'
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'success'
            ? 'Entry Added'
            : status === 'error'
            ? 'Failed to Add'
            : 'Add Entry'}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
