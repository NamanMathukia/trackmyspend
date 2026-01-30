import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import useCurrency from "../hooks/useCurrency";
import ConfirmModal from "../components/ui/ConfirmModal";
import UndoToast from "../components/ui/UndoToast";

export default function Expenses({ user }) {
  // ================= STATE =================
  const [expenses, setExpenses] = useState([]);

  // modal control (ONLY for confirmation)
  const [confirmTarget, setConfirmTarget] = useState(null);

  // undo control (ONLY for undo)
  const [undoTarget, setUndoTarget] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  const currency = useCurrency(user);

  // ================= FETCH =================
  useEffect(() => {
    if (user) loadExpenses();
  }, [user]);

  async function loadExpenses() {
    const { data } = await supabase
      .from("expenses")
      .select()
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("date", { ascending: false });

    setExpenses(data || []);
  }

  // ================= DELETE =================
  async function softDeleteExpense(expense) {
    if (!expense) return;

    // close modal immediately
    setConfirmTarget(null);

    // optimistic UI
    setExpenses((prev) => prev.filter((e) => e.id !== expense.id));

    // store for undo
    setUndoTarget(expense);
    setShowUndo(true);

    await supabase
      .from("expenses")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", expense.id)
      .eq("user_id", user.id);

    // auto-clear undo after 5s
    setTimeout(() => {
      setShowUndo(false);
      setUndoTarget(null);
    }, 5000);
  }

  // ================= UNDO =================
  async function undoDelete() {
    if (!undoTarget) return;

    await supabase
      .from("expenses")
      .update({ deleted_at: null })
      .eq("id", undoTarget.id)
      .eq("user_id", user.id);

    setExpenses((prev) => [undoTarget, ...prev]);
    setUndoTarget(null);
    setShowUndo(false);
  }

  // ================= UI =================
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>All Expenses</SectionTitle>

      <FadeIn>
        <Card className="divide-y">
          {expenses.length === 0 && (
            <p className="py-4 text-slate-500 text-sm text-center">
              No expenses found.
            </p>
          )}

          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center py-3 text-sm"
            >
              <div>
                <p className="font-medium">{e.category}</p>
                <p className="text-slate-500">{e.date}</p>
              </div>

              <div className="text-right space-y-1">
                <p className="font-semibold">
                  {currency} {e.amount}
                </p>

                <div className="flex gap-3 justify-end text-xs">
                  <Link
                    to={`/edit/${e.id}`}
                    className="text-teal-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => setConfirmTarget(e)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </FadeIn>

      {/* ===== Delete Confirmation ===== */}
      <ConfirmModal
        open={!!confirmTarget}
        title="Delete expense?"
        description="This expense will be removed. You can undo this action for a short time."
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => softDeleteExpense(confirmTarget)}
      />

      {/* ===== Undo Toast ===== */}
      {showUndo && (
        <UndoToast
          message="Expense deleted"
          onUndo={undoDelete}
        />
      )}
    </div>
  );
}
