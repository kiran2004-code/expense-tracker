import React, { useState, useEffect } from 'react';
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
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [customCategory, setCustomCategory] = useState('');
  const [status, setStatus] = useState(null);
  const [refreshKey, setRefreshKey] = useState(false); // For SummaryCards refresh

  const BASE = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE}/api/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Keep categories sorted and always push "Other" at last
      const fetched = res.data.map(c => c.name);
      const withOther = [...fetched, 'Other'];
      setCategories(withOther);
      if (withOther.length > 0) {
  setCategory(withOther[0]); // auto-select first
}

      setCategories([...fetched, 'Other']);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  fetchCategories();
}, [BASE]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCategory = category;
    if (category === 'Other' && customCategory.trim() !== '') {
  finalCategory = customCategory.trim();

  // Save new category to DB if not already saved
  try {
    await axios.post(`${BASE}/api/categories`, 
      { name: finalCategory, type: "Expense" }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setCategories(prev => {
        const withoutOther = prev.filter(c => c !== 'Other');
        return [...withoutOther, finalCategory, 'Other'];
      });
      setCategory(finalCategory);
  } catch (err) {
    console.error("Failed to save new category", err);
  }
}


    try {
      const entry = {
        title,
        amount: parseFloat(amount),
        category: type === 'Income' ? 'Income' : finalCategory,
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
      setCategory('');
      setCustomCategory('');
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
        {/* Expense / Income Toggle */}
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
            {/* Title Input */}
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

            {/* Amount Input */}
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

            {/* Category Select */}
            {type === 'Expense' && (
              <div className="space-y-2">
                <div className="relative">
                  <Tag className="absolute top-3 left-3 text-gray-400" size={18} />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-blue-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* If "Other", show custom input */}
                {category === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full pl-3 pr-4 py-2 border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:outline-blue-400"
                  />
                )}
              </div>
            )}
          </>
        )}

        {/* Submit Button */}
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
