import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import useCurrency from "../hooks/useCurrency";

export default function Budget({ user, onBudgetSet }) {
  const [budget, setBudget] = useState("");
  const [savedBudgetId, setSavedBudgetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const currency = useCurrency(user);

  const isFirstTime = !savedBudgetId;

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
    setShowToast(true);

    if (onBudgetSet) onBudgetSet();

    setTimeout(() => {
      navigate("/");
    }, 1200);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">

      <SectionTitle>Budget</SectionTitle>

      {/* First time helper */}
      {isFirstTime && (
        <div className="bg-teal-50 dark:bg-teal-900/30 
                        border border-teal-200 dark:border-teal-700
                        text-teal-700 dark:text-teal-300
                        px-4 py-3 rounded-xl text-sm">
          🚀 Set your monthly budget to start using the app
        </div>
      )}

      {/* Current Budget */}
      <FadeIn>
        <Card>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Monthly Budget</p>
            <p className="text-2xl font-bold">
              {currency} {budget || 0}
            </p>
          </div>
        </Card>
      </FadeIn>

      {/* Input Section */}
      <FadeIn delay={0.1}>
        <Card className="space-y-4">

          {/* <div> */}
            <p className="text-sm text-slate-500 mb-1">
              Set Monthly Budget
            </p>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                {currency}
              </span>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-slate-300 rounded-lg px-3 py-2
                          focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

          <button
            onClick={handleSave}
            disabled={!budget || loading}
            className="btn primary"
          >
            {loading
              ? "Saving..."
              : isFirstTime
              ? "Set Budget & Continue"
              : "Save Budget"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Helps you stay on track each month
          </p>

        </Card>
      </FadeIn>

      {/* Success Toast */}
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