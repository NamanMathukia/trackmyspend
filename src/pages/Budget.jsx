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
    <div className="max-w-md mx-auto px-4 py-6 space-y-5">

      <SectionTitle>Budget</SectionTitle>

      {/* 🚨 FIRST TIME MESSAGE */}
      {isFirstTime && (
        <div className="bg-teal-50 dark:bg-teal-900/30 
                        border border-teal-200 dark:border-teal-700
                        text-teal-700 dark:text-teal-300
                        px-4 py-3 rounded-xl text-sm">
          🚀 Set your monthly budget to start using the app
        </div>
      )}

      {/* 💰 HERO CARD */}
      <FadeIn>
        <Card className="p-6 flex items-center justify-between 
                         bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
  Monthly Budget
</p>

<p className="text-3xl font-bold text-slate-900 dark:text-white">
  {currency} {budget || 0}
</p>
          </div>
          <div className="text-4xl opacity-80">💰</div>
        </Card>
      </FadeIn>

      {/* ✨ INPUT SECTION */}
      <FadeIn delay={0.1}>
        <Card className="space-y-5 p-6 
                         bg-white dark:bg-slate-800 
                         border border-slate-200 dark:border-slate-700">

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
              Set Monthly Budget
            </p>

            <div className="flex items-center rounded-xl px-4 py-3
                            bg-white dark:bg-slate-900
                            border border-slate-300 dark:border-slate-600
                            focus-within:ring-2 focus-within:ring-teal-500">

              <span className="text-slate-600 dark:text-slate-300 mr-2">
                {currency}
              </span>

              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 outline-none bg-transparent
                           text-slate-900 dark:text-white
                           placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!budget || loading}
            className="w-full py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-teal-500 to-cyan-500
                       hover:opacity-90 active:scale-95 transition
                       disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : isFirstTime
              ? "Set Budget & Continue"
              : "Save Budget"}
          </button>

          {/* 💡 TIP */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            💡 Tip: Set a realistic budget to track spending better
          </p>

        </Card>
      </FadeIn>

      {/* 📊 PROGRESS PLACEHOLDER */}
      {/* <FadeIn delay={0.2}>
        <Card className="p-4 
                         bg-white dark:bg-slate-800 
                         border border-slate-200 dark:border-slate-700">

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Spending Progress
          </p>

          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-[10%] bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            No expenses yet
          </p>
        </Card>
      </FadeIn> */}

      {/* ✅ SUCCESS TOAST */}
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