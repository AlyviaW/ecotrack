"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setPoints(Number(localStorage.getItem("eco_points") || "0"));
    setHistory(JSON.parse(localStorage.getItem("eco_history") || "[]"));
  }, []);

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p className="mb-6 text-gray-600">Track your eco points and history.</p>
      <div className="text-4xl font-bold mb-4">{points} pts</div>
      <h2 className="font-semibold mb-2">Recent</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        {history.length ? history.map((h,i)=><li key={i}>• {h}</li>) : <li>No history yet</li>}
      </ul>
    </div>
  );
}
