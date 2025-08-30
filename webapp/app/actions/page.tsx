"use client";
import { useEffect, useMemo, useState } from "react";

type ActionLog = { id: string; name: string; points: number; cat: string; at: number };

const PRESETS: { cat: string; items: { name: string; points: number }[] }[] = [
  { cat: "Energy", items: [
    { name: "Cold wash laundry", points: 3 },
    { name: "Shorter shower (≤5min)", points: 3 },
    { name: "Turn off standby all day", points: 2 },
  ]},
  { cat: "Transport", items: [
    { name: "Bike/Walk commute", points: 8 },
    { name: "Public transport instead of car", points: 6 },
  ]},
  { cat: "Waste", items: [
    { name: "Reusable cup/bottle", points: 2 },
    { name: "Proper recycling", points: 2 },
    { name: "Food waste composting", points: 4 },
  ]},
  { cat: "Community", items: [
    { name: "Donate / Swap an item", points: 6 },
    { name: "Volunteer 30–60 min", points: 10 },
  ]},
];

export default function ActionsPage() {
  const [points, setPoints] = useState(0);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [customName, setCustomName] = useState("");
  const [customCat, setCustomCat] = useState("Custom");
  const [customPts, setCustomPts] = useState(3);

  // 初始化
  useEffect(() => {
    setPoints(Number(localStorage.getItem("eco_points") || "0"));
    setLogs(JSON.parse(localStorage.getItem("eco_actions") || "[]"));
  }, []);

  function addPoints(n: number, reason: string, cat: string) {
    const next = points + n;
    setPoints(next);
    localStorage.setItem("eco_points", String(next));

    const log: ActionLog = { id: String(Date.now()), name: reason, points: n, cat, at: Date.now() };
    const nextLogs = [log].concat(logs).slice(0, 200);
    setLogs(nextLogs);
    localStorage.setItem("eco_actions", JSON.stringify(nextLogs));

    // 同步到 Dashboard 简要历史
    const h = [`+${n} · ${reason}`].concat(JSON.parse(localStorage.getItem("eco_history") || "[]")).slice(0, 20);
    localStorage.setItem("eco_history", JSON.stringify(h));

    alert(`+${n} pts · ${reason}`);
  }

  function addCustom() {
    if (!customName.trim()) return alert("Please enter an action name");
    if (customPts < 1 || customPts > 50) return alert("Points should be 1–50");
    addPoints(customPts, customName.trim(), customCat);
    setCustomName("");
  }

  const groupedByDay = useMemo(() => {
    const by: Record<string, ActionLog[]> = {};
    for (const l of logs) {
      const key = new Date(l.at).toLocaleDateString();
      if (!by[key]) {
        by[key] = [];
      }
      by[key].push(l);
    }
    return by;
  }, [logs]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Presets + Custom */}
      <section className="lg:col-span-2 card p-6">
        <h1 className="text-2xl font-semibold mb-2">Log your sustainable actions</h1>
        <p className="text-gray-600 mb-6">Choose a preset or add a custom action. Points add up to unlock swaps and rewards.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {PRESETS.map(group => (
            <div key={group.cat} className="border border-gray-100 rounded-xl p-4">
              <div className="font-medium mb-2">{group.cat}</div>
              <div className="grid gap-2">
                {group.items.map(item => (
                  <button
                    key={item.name}
                    className="btn btn-primary justify-between"
                    onClick={() => addPoints(item.points, item.name, group.cat)}
                  >
                    <span>{item.name}</span>
                    <span>+{item.points}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 card p-5">
          <div className="font-medium mb-3">Custom action</div>
          <div className="flex flex-wrap gap-3">
            <input
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="e.g., Meat-free meal"
              className="border rounded-xl px-3 py-2 flex-1 min-w-[220px]"
            />
            <select
              value={customCat}
              onChange={e => setCustomCat(e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              <option>Custom</option>
              <option>Energy</option>
              <option>Transport</option>
              <option>Waste</option>
              <option>Community</option>
            </select>
            <input
              type="number"
              value={customPts}
              onChange={e => setCustomPts(Number(e.target.value))}
              className="border rounded-xl px-3 py-2 w-24"
              min={1}
              max={50}
            />
            <button className="btn btn-primary" onClick={addCustom}>Add</button>
          </div>
        </div>
      </section>

      {/* Sidebar */}
      <aside className="card p-6">
        <div className="text-sm text-gray-600">Current points</div>
        <div className="text-4xl font-bold">{points}</div>

        <h3 className="font-semibold mt-6 mb-2">Recent logs</h3>
        <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
          {Object.entries(groupedByDay).map(([day, items]) => (
            <div key={day}>
              <div className="text-xs text-gray-500 mb-1">{day}</div>
              <ul className="space-y-1">
                {items.map(i => (
                  <li
                    key={i.id}
                    className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
                  >
                    <div className="truncate">
                      <span className="text-xs bg-eco-50 text-eco-700 px-2 py-0.5 rounded mr-2">{i.cat}</span>
                      {i.name}
                    </div>
                    <div className="font-semibold text-eco-700">+{i.points}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!logs.length && <div className="text-gray-500">No actions yet.</div>}
        </div>
      </aside>
    </div>
  );
}
