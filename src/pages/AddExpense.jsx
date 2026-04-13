import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function AddExpense({ user }) {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories
  ? categories
  : categories.slice(0, 6);

  // --- Load categories ---
  useEffect(() => {
    async function loadCategories() {
      setCatLoading(true);

      const { data } = await supabase
        .from("categories")
        .select("name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setCategories(data || []);
      setCatLoading(false);
    }

    loadCategories();
  }, [user.id]);

  // --- Save expense ---
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!amount || !category) {
      setError("Please enter amount and category");
      setLoading(false);
      return;
    }

    // Auto-create category if not exists
    const exists = categories.find((c) => c.name === category);

    if (!exists) {
      await supabase.from("categories").insert({
        user_id: user.id,
        name: category,
      });
    }

    // Insert expense
    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: Number(amount),
      category,
      date,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/"); // Back to dashboard
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Add Expense</SectionTitle>

      <FadeIn>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Amount */}
            <input
              type="number"
              placeholder="Amount ₹"
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            {/* Quick category chips
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setCategory(c.name)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    category === c.name
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}

              {catLoading && (
                <p className="text-sm text-slate-400">Loading...</p>
              )}
            </div> */}
            {/* Quick category chips */}
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setCategory(c.name)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    category === c.name
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}

              {/* Show More / Less toggle */}
              {categories.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="px-3 py-1 rounded-full text-sm border bg-white border-dashed border-slate-300 hover:bg-slate-50 text-slate-600"
                >
                  {showAllCategories ? "Show Less" : `+ ${categories.length - 6} More`}
                </button>
              )}
            </div>

            {/* Manual category input */}
            <input
              placeholder="Or type new category"
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            {/* Date */}
            <input
              type="date"
              className="w-full border border-slate-300 rounded-lg px-3 py-2
                         focus:ring-2 focus:ring-teal-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            {/* Submit */}
            <button
              disabled={loading}
              className="btn primary"
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </Card>
      </FadeIn>
    </div>
  );
}
