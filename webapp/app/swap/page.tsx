"use client";
import { useEffect, useState } from "react";

type Item = { id: string; title: string; desc: string; cost: number };

const SEED: Item[] = [
  { id: "seed1", title: "Refurbished Bluetooth Speaker", desc: "Gently used. Pickup in zone 2.", cost: 40 },
  { id: "seed2", title: "Books Exchange (2 credits)", desc: "Bring 2 books, take 2.", cost: 15 },
  { id: "seed3", title: "DIY Repair Workshop Ticket", desc: "Fix your small appliance with guidance.", cost: 25 },
];

export default function SwapPage() {
  const [points, setPoints] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [mine, setMine] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cost, setCost] = useState(20);

  useEffect(() => {
    setPoints(Number(localStorage.getItem("eco_points") || "0"));
    const local = JSON.parse(localStorage.getItem("swap_items") || "[]") as Item[];
    const acquired = JSON.parse(localStorage.getItem("swap_acquired") || "[]") as Item[];

    const map: Record<string, Item> = {};
    [...SEED, ...local].forEach(x => (map[x.id] = x));
    setItems(Object.values(map));
    setMine(acquired);
  }, []);

  function saveItems(next: Item[]) {
    setItems(next);
    const custom = next.filter(i => !i.id.startsWith("seed"));
    localStorage.setItem("swap_items", JSON.stringify(custom));
  }

  function saveMine(next: Item[]) {
    setMine(next);
    localStorage.setItem("swap_acquired", JSON.stringify(next));
  }

  function addListing() {
    if (!title.trim()) return alert("Please enter a title");
    if (cost < 1) return alert("Cost must be ≥ 1");
    const item: Item = { id: String(Date.now()), title: title.trim(), desc: desc.trim(), cost };
    const next = [item].concat(items);
    saveItems(next);
    setTitle(""); setDesc(""); setCost(20);
    alert("Listing added (local demo)");
  }

  function redeem(it: Item) {
    if (points < it.cost) return alert("Not enough points");
    if (!confirm(`Redeem "${it.title}" for ${it.cost} pts?`)) return;

    const nextPts = points - it.cost;
    setPoints(nextPts);
    localStorage.setItem("eco_points", String(nextPts));

    const nextMine = [it].concat(mine);
    saveMine(nextMine);

    const nextList = items.filter(x => x.id !== it.id);
    saveItems(nextList);

    const h = [`- ${it.cost} · Redeem ${it.title}`].concat(JSON.parse(localStorage.getItem("eco_history") || "[]")).slice(0, 20);
    localStorage.setItem("eco_history", JSON.stringify(h));

    alert("Redeemed!");
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 card p-6">
        <h1 className="text-2xl font-semibold mb-2">Community Swap</h1>
        <p className="text-gray-600 mb-6">Use your eco points to redeem items or opportunities. Add your own listing to share with others (demo only, stored locally).</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(it => (
            <div key={it.id} className="border border-gray-100 rounded-xl p-4 flex flex-col">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-600 flex-1 mt-1">{it.desc || "—"}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-eco-700 font-semibold">{it.cost} pts</div>
                <button className="btn btn-primary" onClick={() => redeem(it)}>Redeem</button>
              </div>
            </div>
          ))}
          {!items.length && <div className="text-gray-500">No listings yet.</div>}
        </div>
      </section>

      <aside className="card p-6">
        <div className="text-sm text-gray-600">Your points</div>
        <div className="text-4xl font-bold">{points}</div>

        <h3 className="font-semibold mt-6 mb-2">Add a listing</h3>
        <div className="space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="border rounded-xl px-3 py-2 w-full"
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Short description"
            className="border rounded-xl px-3 py-2 w-full min-h-[90px]"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Cost</span>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(Number(e.target.value))}
              className="border rounded-xl px-3 py-2 w-24"
              min={1}
            />
            <span className="text-sm text-gray-600">pts</span>
          </div>
          <button className="btn btn-primary w-full" onClick={addListing}>Add</button>
        </div>

        <h3 className="font-semibold mt-8 mb-2">My acquisitions</h3>
        <ul className="text-sm text-gray-700 space-y-1 max-h-[220px] overflow-auto pr-1">
          {mine.length
            ? mine.map(m => <li key={m.id}>• {m.title} <span className="text-gray-500">({m.cost} pts)</span></li>)
            : <li>None yet</li>}
        </ul>
      </aside>
    </div>
  );
}
