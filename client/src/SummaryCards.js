import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Wallet, CreditCard, CircleDollarSign } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

function SummaryCards({ refresh }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE = process.env.REACT_APP_API_BASE_URL;
        const res = await axios.get(`${BASE}/api/expenses`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

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
  }, [refresh]);

  const balance = income - expense;

  const boxClasses =
    'flex items-center justify-center gap-3 p-4 rounded-xl shadow transition transform hover:scale-105';

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Income */}
      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-xl">
        <div className={boxClasses}>
          <Wallet className="text-green-600 dark:text-green-300" size={24} />
          <span className="text-lg font-semibold">
            ₹<CountUp end={income} duration={1.5} />
          </span>
        </div>
      </div>

      {/* Expense */}
      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-xl">
        <div className={boxClasses}>
          <CreditCard className="text-red-600 dark:text-red-300" size={24} />
          <span className="text-lg font-semibold">
            ₹<CountUp end={expense} duration={1.5} />
          </span>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-xl">
        <div className={boxClasses}>
          <CircleDollarSign className="text-blue-600 dark:text-blue-300" size={24} />
          <span className="text-lg font-semibold">
            ₹<CountUp end={balance} duration={1.5} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default SummaryCards;
