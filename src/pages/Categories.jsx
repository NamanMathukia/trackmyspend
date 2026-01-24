import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (user) loadCategories();
  }, [user]);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
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

  async function deleteCategory(id) {
    await supabase.from("categories").delete().eq("id", id);
    loadCategories();
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

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-20 space-y-6">

      <SectionTitle>Categories</SectionTitle>

      {/* ==== Add Category Bar ==== */}
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
                {/* Left side */}
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

                {/* Right side actions */}
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
                    onClick={() => deleteCategory(cat.id)}
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

    </div>
  );
}
