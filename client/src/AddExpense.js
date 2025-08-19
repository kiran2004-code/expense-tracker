import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Tag,
  DollarSign,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import SummaryCards from "./SummaryCards";

function AddExpense({ onAdd }) {
  const [type, setType] = useState(""); // "Expense" or "Income"
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [status, setStatus] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(false);

  const BASE = process.env.REACT_APP_API_BASE_URL;

  // ✅ Fetch categories (only for Expense)
  useEffect(() => {
    const fetchCategories = async () => {
      if (!BASE || type !== "Expense") return;

      try {
        const res = await axios.get(`${BASE}/api/categories`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const filtered = res.data
          .filter((c) => c.kind === "Expense")
          .map((c) => c.name);

        const unique = Array.from(new Set(filtered)).sort((a, b) =>
          a.localeCompare(b)
        );
        setCategories([...unique, "Other"]);
        setFetchError(null);
      } catch (err) {
        console.error("❌ Failed to fetch categories", err);
        setFetchError("Failed to load categories. Please try again.");
        setCategories(["Other"]);
      }
    };

    fetchCategories();
  }, [BASE, type]);

  // ✅ Auto-select first category when Expense type chosen
  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCategory = category;

    // ✅ Handle custom category creation
    if (type === "Expense" && category === "Other") {
      const name = customCategory.trim();
      if (!name) {
        setStatus("error");
        setTimeout(() => setStatus(null), 2000);
        return;
      }

      try {
        await axios.post(
          `${BASE}/api/categories`,
          { name, kind: "Expense" },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        // Update dropdown with new category
        setCategories((prev) => {
          const withoutOther = prev.filter((c) => c !== "Other");
          const set = new Set([...withoutOther, name]);
          return [...Array.from(set).sort((a, b) => a.localeCompare(b)), "Other"];
        });

        setCategory(name);
        finalCategory = name;
      } catch (err) {
        console.error("❌ Failed to save new category", err);
        setStatus("error");
        setTimeout(() => setStatus(null), 2000);
        return;
      }
    }

    try {
      const entry = {
        title,
        amount: parseFloat(amount),
        category: type === "Expense" ? finalCategory : "Income",
        type,
        date: new Date(),
        userId: localStorage.getItem("userId"), // ✅ Required
      };

      await axios.post(`${BASE}/api/expenses`, entry, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // ✅ Reset form
      setTitle("");
      setAmount("");
      setCategory("");
      setCustomCategory("");
      setType("");
      setStatus("success");

      // ✅ Refresh summary
      setRefreshKey((prev) => !prev);

      if (onAdd) onAdd("success");
    } catch (err) {
      console.error("❌ Error saving expense:", err.response?.data || err.message);
      setStatus("error");
      if (onAdd) onAdd("error");
    }

    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="space-y-6">
      <SummaryCards refresh={refreshKey} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Expense / Income Toggle */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => setType("Expense")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
              type === "Expense"
                ? "bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-300"
                : "border-gray-300 dark:border-gray-600 hover:border-red-400"
            }`}
          >
            <ArrowDownCircle size={18} /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType("Income")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
              type === "Income"
                ? "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                : "border-gray-300 dark:border-gray-600 hover:border-green-400"
            }`}
          >
            <ArrowUpCircle size={18} /> Income
          </button>
        </div>

        {type && (
          <>
            {/* ✅ Title */}
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

            {/* ✅ Amount */}
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

            {/* ✅ Category only for Expense */}
            {type === "Expense" && (
              <div className="space-y-2">
                {fetchError && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{fetchError}</p>
                )}
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

                {/* ✅ Custom category input */}
                {category === "Other" && (
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

        {/* ✅ Submit */}
        <button
          type="submit"
          className={`w-full py-2 rounded-md font-medium transition ${
            status === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : status === "error"
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {status === "success"
            ? "Entry Added"
            : status === "error"
            ? "Failed to Add"
            : "Add Entry"}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
