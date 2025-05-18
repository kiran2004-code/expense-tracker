import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';

function ExpenseCalendar() {
  const [value, setValue] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [value, expenses]);

  const fetchExpenses = async () => {
    try {
      const BASE = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.get(`${BASE}/api/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses', err);
    }
  };

  const filterExpenses = () => {
    const selected = format(value, 'yyyy-MM-dd');
    const matched = expenses.filter(
      (exp) => format(new Date(exp.date), 'yyyy-MM-dd') === selected
    );
    setFiltered(matched);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-green-700 mb-4">📅 View Expenses by Calendar</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="bg-white">
          <Calendar
            onChange={setValue}
            value={value}
            className="rounded-lg shadow border"
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          <h3 className="text-md font-medium mb-2">
            Entries on {format(value, 'dd MMMM yyyy')}
          </h3>

          {filtered.length === 0 ? (
            <p className="text-gray-500">No entries for this date.</p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((exp) => (
                <li
                  key={exp._id}
                  className="bg-gray-50 border p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">
                      {exp.title} - ₹{exp.amount}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        exp.type === 'Income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {exp.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{exp.category}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseCalendar;
