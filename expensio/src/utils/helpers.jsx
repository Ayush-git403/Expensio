export const CATEGORIES = [
  "Food","Transport","Housing","Health",
  "Entertainment","Shopping","Education",
  "Travel","Utilities","Other"
];

export const COLORS = [
  "#c9a96e","#7eb8c9","#a07ec9","#c97e8c",
  "#7ec97e","#c9b77e","#7e9bc9","#c9907e",
  "#7ec9b7","#9e9e9e"
];

export const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

export const INITIAL_EXPENSES = [
  { id: 1, name: "Groceries", amount: 3200, category: "Food", date: "2026-03-01" },
  { id: 2, name: "Metro Pass", amount: 1500, category: "Transport", date: "2026-03-03" },
  { id: 3, name: "Netflix", amount: 649, category: "Entertainment", date: "2026-03-05" },
  { id: 4, name: "Electricity Bill", amount: 2100, category: "Utilities", date: "2026-03-07" },
];