import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ExpenseChart() {
  const [expenses, setExpenses] = useState([]);
  const [mode, setMode] = useState('category'); // 'category' or 'type'
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (mode === 'category') buildCategoryChart();
    else buildTypeChart();
  }, [mode, expenses]);

  const loadData = async () => {
    try {
      const res = await axios.get('/api/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to load chart data', err);
    }
  };

  const buildCategoryChart = () => {
    const categoryTotals = {};
    expenses.forEach((exp) => {
      if (exp.type === 'Expense') {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });

    setChartData({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryTotals),
          backgroundColor: '#6366f1',
          borderRadius: 6
        }
      ]
    });
  };

  const buildTypeChart = () => {
    let income = 0;
    let expense = 0;

    expenses.forEach((exp) => {
      if (exp.type === 'Income') income += exp.amount;
      if (exp.type === 'Expense') expense += exp.amount;
    });

    setChartData({
      labels: ['Income', 'Expense'],
      datasets: [
        {
          label: 'Income vs Expense',
          data: [income, expense],
          backgroundColor: ['#10b981', '#ef4444'], // Green for income, red for expense
          borderRadius: 6
        }
      ]
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-purple-700">
          📊 {mode === 'category' ? 'Expenses by Category' : 'Income vs Expense'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('category')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              mode === 'category'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setMode('type')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              mode === 'type'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Income vs Expense
          </button>
        </div>
      </div>

      {chartData?.labels?.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `₹${value}`
                }
              }
            }
          }}
        />
      ) : (
        <p className="text-gray-500">No data available to show chart.</p>
      )}
    </div>
  );
}

export default ExpenseChart;
