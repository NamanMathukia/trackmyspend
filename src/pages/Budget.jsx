import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import useCurrency from "../hooks/useCurrency";

export default function Budget({ user }) {
  const [budget, setBudget] = useState("");
  const [savedBudgetId, setSavedBudgetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const currency = useCurrency(user);

  useEffect(() => {
    if (user) loadBudget();
  }, [user]);

  async function loadBudget() {
    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setBudget(data.monthly_budget.toString());
      setSavedBudgetId(data.id);
    }
  }

  async function handleSave() {
    if (!budget || !user) return;
    setLoading(true);

    if (savedBudgetId) {
      await supabase
        .from("budgets")
        .update({ monthly_budget: Number(budget) })
        .eq("id", savedBudgetId);
    } else {
      const { data } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          monthly_budget: Number(budget),
        })
        .select()
        .single();

      if (data) setSavedBudgetId(data.id);
    }

    setLoading(false);

    // === Show success toast ===
    setShowToast(true);

    // === Redirect to Dashboard after short delay ===
    setTimeout(() => {
      navigate("/");
    }, 1200);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

      <SectionTitle>Budget</SectionTitle>

      {/* === Current Budget Card === */}
      <FadeIn>
        <Card>
          <p className="text-slate-500 text-sm">Monthly Budget</p>
          <p className="text-xl font-bold">
            {currency} {budget || 0}
          </p>
        </Card>
      </FadeIn>

      {/* === Set / Update Budget === */}
      <FadeIn delay={0.1}>
        <Card className="space-y-4">
          <p className="text-slate-600 text-sm">
            Set or update your monthly spending limit.
          </p>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-slate-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-teal-500 outline-none"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-teal-500 text-white py-2 rounded-lg
                       font-semibold hover:bg-teal-600 transition
                       disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Budget"}
          </button>
        </Card>
      </FadeIn>

      {/* === Success Toast === */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 
                        bg-slate-900 text-white text-sm px-4 py-2 
                        rounded-full shadow-lg">
          Budget saved successfully ✅
        </div>
      )}
    </div>
  );
}
