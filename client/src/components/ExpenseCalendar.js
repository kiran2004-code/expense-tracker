import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // base calendar styles
import API from "../utils/axios";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

// Dynamic style injection for calendar theme
function loadCalendarTheme() {
  const existing = document.getElementById("calendar-theme");
  if (existing) existing.remove();

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.id = "calendar-theme";

  const isDark = document.documentElement.classList.contains("dark");
  style.href = isDark ? "/calendar-dark.css" : "/calendar-light.css";

  document.head.appendChild(style);
}

function ExpenseCalendar() {
  const [value, setValue] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Load theme when component mounts
  useEffect(() => {
    loadCalendarTheme();

    // Watch for theme changes
    const observer = new MutationObserver(() => loadCalendarTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Use shared API instead of raw axios
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get("/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses", err);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const selectedDate = format(value, "yyyy-MM-dd");
    const matched = expenses.filter(
      (exp) => format(new Date(exp.date), "yyyy-MM-dd") === selectedDate
    );
    setFiltered(matched);
  }, [value, expenses]);

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
        <CalendarDays className="text-green-500" size={20} />
        View Expenses by Calendar
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="animate-fade-in duration-700 transform transition-all">
          <Calendar
            onChange={setValue}
            value={value}
            showNeighboringMonth={false}
            className="rounded-lg"
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          <h3 className="text-md font-medium mb-2">
            Entries on {format(value, "dd MMMM yyyy")}
          </h3>

          {filtered.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No entries for this date.
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((exp) => (
                <li
                  key={exp._id}
                  className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-600 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {exp.title} - ₹{exp.amount}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        exp.type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {exp.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {exp.category}
                  </div>
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
