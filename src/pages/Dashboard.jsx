import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import FloatingAddButton from "../components/FloatingAddButton";

import { motion } from "framer-motion";

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchBudget();
    }
  }, [user]);

  async function fetchExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    setExpenses(data || []);
  }

  async function fetchBudget() {
    const { data } = await supabase
      .from("budgets")
      .select("monthly_budget")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setMonthlyBudget(data?.monthly_budget || 0);
  }

  // Date helpers
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);

  // Totals
  const todayTotal = expenses
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthTotal = expenses
    .filter((e) => e.date.startsWith(month))
    .reduce((sum, e) => sum + e.amount, 0);

  // Budget calculations
  const percentage =
    monthlyBudget > 0 ? Math.min((monthTotal / monthlyBudget) * 100, 100) : 0;

  let barColor = "bg-green-500";
  if (percentage > 70) barColor = "bg-yellow-400";
  if (percentage > 90) barColor = "bg-red-500";

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-20 space-y-6">

      <SectionTitle>Dashboard</SectionTitle>

      {/* ===== Budget Card ===== */}
      <FadeIn>
        <Card>
          <div className="space-y-2">

            <div className="flex justify-between text-sm font-medium">
              <span>Monthly Budget</span>
              <span>₹ {monthTotal} / ₹ {monthlyBudget}</span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${barColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs text-slate-500">
              {percentage < 100
              ? `${percentage.toFixed(0)}% spent`
              : "Time to survive on water 💧"}
            </p>


          </div>
        </Card>
      </FadeIn>

      {/* ===== Today + Month Cards ===== */}
      <div className="grid grid-cols-2 gap-4">
        <FadeIn>
          <Card>
            <p className="text-slate-500 text-sm">Today</p>
            <p className="text-xl font-bold">₹ {todayTotal}</p>
          </Card>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card>
            <p className="text-slate-500 text-sm">This Month</p>
            <p className="text-xl font-bold">₹ {monthTotal}</p>
          </Card>
        </FadeIn>
      </div>

      {/* ===== Recent Expenses ===== */}
      <FadeIn delay={0.2}>
        <Card>
          <h2 className="font-semibold mb-3">Recent Expenses</h2>

          {expenses.slice(0, 5).map((e) => (
            <div
              key={e.id}
              className="flex justify-between border-b last:border-none py-2 text-sm"
            >
              <div>
                <p className="font-medium">{e.category}</p>
                <p className="text-slate-500 text-xs">{e.date}</p>
              </div>
              <p className="font-semibold">₹ {e.amount}</p>
            </div>
          ))}

          {expenses.length === 0 && (
            <p className="text-slate-400 text-sm">No expenses yet</p>
          )}
        </Card>
      </FadeIn>

      <FloatingAddButton />
    </div>
  );
}
