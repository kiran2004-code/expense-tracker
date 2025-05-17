import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SummaryCards({ refresh }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/expenses');
      const data = res.data;

      let incomeSum = 0;
      let expenseSum = 0;

      data.forEach((item) => {
        if (item.type === 'Income') {
          incomeSum += item.amount;
        } else if (item.type === 'Expense') {
          expenseSum += item.amount;
        }
      });

      setIncome(incomeSum);
      setExpense(expenseSum);
    } catch (err) {
      console.error('Error loading summary data', err);
    }
  };

  fetchData();
}, [refresh]); // 👈 refresh triggers reload


  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow text-center font-semibold">
        💰 Income: ₹{income}
      </div>
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow text-center font-semibold">
        💸 Expense: ₹{expense}
      </div>
      <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow text-center font-semibold">
        🧮 Balance: ₹{balance}
      </div>
    </div>
  );
}

export default SummaryCards;
