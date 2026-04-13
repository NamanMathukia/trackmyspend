import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";
import UndoToast from "../components/ui/UndoToast";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const [undoTarget, setUndoTarget] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    if (user) loadCategories();
  }, [user]);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null) // ✅ hide deleted
      .order("created_at", { ascending: false });

    setCategories(data || []);
  }

  async function addCategory() {
    if (!newCat.trim()) return;

    await supabase.from("categories").insert({
      user_id: user.id,
      name: newCat.trim(),
    });

    setNewCat("");
    loadCategories();
  }

  // ✅ SOFT DELETE
  async function softDeleteCategory(category) {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));

    setUndoTarget(category);
    setShowUndo(true);

    await supabase
      .from("categories")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", category.id);

    setTimeout(() => {
      setShowUndo(false);
      setUndoTarget(null);
    }, 5000);
  }

  // ✅ UNDO DELETE
  async function undoDelete() {
    if (!undoTarget) return;

    await supabase
      .from("categories")
      .update({ deleted_at: null })
      .eq("id", undoTarget.id);

    setCategories((prev) => [undoTarget, ...prev]);

    setUndoTarget(null);
    setShowUndo(false);
  }

  async function saveEdit(id) {
    if (!editingValue.trim()) return;

    await supabase
      .from("categories")
      .update({ name: editingValue.trim() })
      .eq("id", id);

    setEditingId(null);
    setEditingValue("");
    loadCategories();
  }

  async function handleConfirmDelete() {
  if (!confirmTarget) return;

  const category = confirmTarget;
  setConfirmTarget(null);

  setCategories((prev) => prev.filter((c) => c.id !== category.id));

  setUndoTarget(category);
  setShowUndo(true);

  await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", category.id);

  setTimeout(() => {
    setShowUndo(false);
    setUndoTarget(null);
  }, 5000);
}

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-20 space-y-6">

      <SectionTitle>Categories</SectionTitle>

      {/* ==== Add Category ==== */}
      <FadeIn>
        <Card>
          <div className="flex items-center gap-3">
            <input
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Add new category"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button
              onClick={addCategory}
              className="primary py-2 px-4"
            >
              Add
            </button>
          </div>
        </Card>
      </FadeIn>

      {/* ==== Categories List ==== */}
      <FadeIn delay={0.1}>
        <Card>
          <div className="space-y-3">

            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2"
              >
                {/* Left */}
                {editingId === cat.id ? (
                  <input
                    className="border border-slate-300 rounded px-2 py-1 text-sm w-32
                               focus:ring-1 focus:ring-teal-500 outline-none"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                  />
                ) : (
                  <span className="font-medium text-sm">{cat.name}</span>
                )}

                {/* Right */}
                <div className="flex gap-3 text-xs font-semibold">

                  {editingId === cat.id ? (
                    <button
                      onClick={() => saveEdit(cat.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingValue(cat.name);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => setConfirmTarget(cat)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">
                No categories yet. Add one above.
              </p>
            )}

          </div>
        </Card>
      </FadeIn>

      {/* ==== Undo Toast ==== */}
      {showUndo && (
        <UndoToast
          message="Category deleted"
          onUndo={undoDelete}
        />
      )}

      <ConfirmModal
        open={!!confirmTarget}
        title="Delete category?"
        description="This category will be removed. You can undo this action within 5 seconds."
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
}
