import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import FadeIn from "../components/ui/FadeIn";

export default function Settings({ user }) {
  const [currency, setCurrency] = useState("₹");
  const [theme, setTheme] = useState("light");
  const [prefId, setPrefId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    if (user) loadPreferences();
  }, [user]);

  async function loadPreferences() {
    const { data } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setCurrency(data.currency || "₹");
      setTheme(data.theme || "light");
      setPrefId(data.id);

      // apply theme immediately
      document.documentElement.classList.toggle(
        "dark",
        data.theme === "dark"
      );
    }
  }

  // ================= SAVE =================
  async function savePreferences(updated) {
    if (!user) return;
    setLoading(true);

    let payload = {
      currency,
      theme,
      ...updated,
    };

    if (prefId) {
      await supabase
        .from("user_preferences")
        .update(payload)
        .eq("id", prefId);
    } else {
      const { data } = await supabase
        .from("user_preferences")
        .insert({
          user_id: user.id,
          ...payload,
        })
        .select()
        .single();

      if (data) setPrefId(data.id);
    }

    // local updates
    if (updated.currency) setCurrency(updated.currency);
    if (updated.theme) {
      setTheme(updated.theme);
      document.documentElement.classList.toggle(
        "dark",
        updated.theme === "dark"
      );
    }

    setLoading(false);
  }

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <SectionTitle>Settings</SectionTitle>

      {/* === Profile === */}
      <FadeIn>
        <Card>
          <h2 className="font-semibold mb-2">Profile</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Name: {user?.user_metadata?.full_name || "User"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Email: {user?.email}
          </p>
        </Card>
      </FadeIn>

      {/* === Preferences === */}
      <FadeIn delay={0.1}>
        <Card>
          <h2 className="font-semibold mb-4">Preferences</h2>

          {/* Currency */}
          <div className="flex justify-between items-center text-sm mb-5">
            <label className="text-slate-600 dark:text-slate-400">
              Default Currency
            </label>

            <select
              value={currency}
              onChange={(e) =>
                savePreferences({ currency: e.target.value })
              }
              className="rounded-lg px-2 py-1 bg-transparent border"
            >
              <option value="₹">₹ Rupee</option>
              <option value="$">$ Dollar</option>
              <option value="€">€ Euro</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Appearance
            </span>

            <button
              onClick={() =>
                savePreferences({
                  theme: theme === "light" ? "dark" : "light",
                })
              }
              className="relative w-12 h-7 rounded-full transition
                         bg-slate-300 dark:bg-slate-700"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full
                bg-white transition-transform
                ${theme === "dark" ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          {loading && (
            <p className="text-xs text-slate-400 mt-3">
              Saving...
            </p>
          )}
        </Card>
      </FadeIn>

      {/* === About === */}
      <FadeIn delay={0.2}>
        <Card className="text-sm text-slate-600 dark:text-slate-400">
          NotemySpend v1.1 <br />
          Simple expense tracker built with React + Supabase.
        </Card>
      </FadeIn>
    </div>
  );
}
