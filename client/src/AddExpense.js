import React, { useState } from 'react';
import axios from 'axios';

function AddExpense({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'Expense'
  });

  const [addStatus, setAddStatus] = useState(null); // null | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };

      if (dataToSend.type === 'Income') {
        dataToSend.category = 'Income';
      }

      const BASE = process.env.REACT_APP_API_BASE_URL;
      await axios.post(`${BASE}/api/expenses`, dataToSend);

      
      // Call parent to trigger summary refresh 👇
      onAdd && onAdd();

      setFormData({
        title: '',
        amount: '',
        category: '',
        type: 'Expense'
      });

      setAddStatus('success');
      setTimeout(() => setAddStatus(null), 3000);
    } catch (err) {
      console.error('Failed to add entry', err);
      setAddStatus('error');
      setTimeout(() => setAddStatus(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
      </div>

      {formData.type === 'Expense' && (
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Medical">Medical</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      <div>
        <button
          type="submit"
          className={`w-full font-semibold py-2 px-4 rounded-md transition text-white ${
            addStatus === 'success'
              ? 'bg-green-600'
              : addStatus === 'error'
              ? 'bg-red-600'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {addStatus === 'success' && '✅ Entry Added'}
          {addStatus === 'error' && '❌ Failed to Add'}
          {addStatus === null && 'Add Entry'}
        </button>
      </div>
    </form>
  );
}

export default AddExpense;
