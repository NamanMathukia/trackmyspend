# NotemySpend 💰

NotemySpend is a modern full-stack personal expense tracker built with React and Supabase.  
It helps you track expenses, manage categories, set budgets, visualize reports, and personalize your experience with currency and dark mode.

---

## 🚀 Features

- Supabase Authentication
- Add, Edit, Delete Expenses
- Category Management
- Monthly Budget Tracking
- Interactive Reports (Pie & Line Charts)
- Persistent Currency Preference
- Persistent Dark Mode
- Responsive Sidebar Navigation
- Smooth UI Animations
- Secure User-Specific Data (RLS)

---

## 🛠 Tech Stack

Frontend: React + Vite  
Styling: Tailwind CSS  
Backend: Supabase (PostgreSQL + Auth)  
Charts: Recharts  
Animations: Framer Motion  

---

## 📦 Installation

Clone repository:

git clone https://github.com/your-username/notemyspend.git  
cd notemyspend  

Install dependencies:

npm install  

Create a `.env` file in project root:

VITE_SUPABASE_URL=your_supabase_project_url  
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  

Run development server:

npm run dev  

Build for production:

npm run build  

---

## 🗄 Supabase Database Tables

expenses  
- id (uuid, primary key)  
- user_id (uuid)  
- amount (numeric)  
- category (text)  
- date (date)

categories  
- id (uuid, primary key)  
- user_id (uuid)  
- name (text)

budgets  
- id (uuid, primary key)  
- user_id (uuid)  
- monthly_budget (numeric)

user_preferences  
- id (uuid, primary key)  
- user_id (uuid)  
- currency (text)  
- dark_mode (boolean)

---

## 🔐 Security

- Row Level Security enabled  
- Users can access only their own data  
- Supabase Auth handles session management  

---

## 📊 Reports

- Category-wise expense breakdown (Pie Chart)  
- Daily spending timeline (Line Chart)

---

## ⚙️ Preferences

- Change default currency  
- Toggle dark mode  
- Preferences stored in Supabase  

---

## 👤 Author

Naman Mathukia

---

NotemySpend — Track smart. Spend smarter.
