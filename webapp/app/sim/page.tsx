"use client";
import { useEffect, useMemo, useState } from "react";

type Alt = { name: string; url?: string; note?: string };

async function estimate(payload: any) {
  const res = await fetch("/api/estimate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function getAlternatives(title: string): Promise<Alt[]> {
  const res = await fetch("/api/alternatives?title=" + encodeURIComponent(title));
  return res.json();
}

export default function SimPage() {
  const [mode, setMode] = useState<"express" | "standard">("standard");
  const [emissions, setEmissions] = useState<number | null>(null);
  const [alts, setAlts] = useState<Alt[]>([]);
  const title = "Wireless Headphones Pro 3000";
  const weightKg = 0.8;

  useEffect(() => {
    // 调用后端估算接口
    estimate({
      origin: { lat: 50.1109, lon: 8.6821 },        // Frankfurt (demo)
      destination: { lat: 51.5074, lon: -0.1278 },  // London (demo)
      weightKg,
      mode,
    }).then((est) => setEmissions(est.emissions_g));
  }, [mode]);

  useEffect(() => {
    getAlternatives(title).then(setAlts);
  }, []);

  function addPoints(n: number, reason: string) {
    const current = Number(localStorage.getItem("eco_points") || "0");
    const next = current + n;
    localStorage.setItem("eco_points", String(next));
    const hist = JSON.parse(localStorage.getItem("eco_history") || "[]");
    const nextHist = [`+${n} · ${reason}`].concat(hist).slice(0, 20);
    localStorage.setItem("eco_history", JSON.stringify(nextHist));
    alert(`+${n} pts · ${reason}`);
  }

  const kg = useMemo(() => {
    if (emissions == null) return null;
    return (emissions / 1000).toFixed(2);
  }, [emissions]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* 左侧：商品 + 配送选择 + 碳排显示 */}
      <section className="card p-6">
        <div className="text-sm text-gray-500 mb-2">Shop Simulator</div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="text-gray-500">Brand: EcoSound · Weight: {weightKg} kg</div>

        <div className="mt-6">
          <div className="font-medium mb-2">选择配送速度</div>
          <div className="flex gap-3">
            <button
              className={"btn " + (mode === "express" ? "btn-primary" : "btn-ghost")}
              onClick={() => setMode("express")}
            >
              极速（次日）
            </button>
            <button
              className={"btn " + (mode === "standard" ? "btn-primary" : "btn-ghost")}
              onClick={() => setMode("standard")}
            >
              标准（经济）
            </button>
          </div>
        </div>

        <div className="mt-6 card p-5">
          <div className="text-sm text-gray-600 mb-1">预计运输碳排</div>
          <div className="text-3xl font-bold">{kg ? kg + " kg CO₂e" : "计算中…"}</div>
          <div className="text-gray-500 mt-1">切换配送速度对比差异。</div>
          <div className="mt-4">
            <button
              className="btn btn-primary"
              onClick={() => addPoints(3, "Choose slower delivery")}
            >
              选择「更慢/低碳」配送（+3）
            </button>
          </div>
        </div>
      </section>

      {/* 右侧：更环保替代品 + 二手/翻新加分按钮 */}
      <aside className="card p-6">
        <h2 className="text-xl font-semibold mb-3">更环保的替代品</h2>
        <div className="grid gap-3">
          {alts.length ? (
            alts.slice(0, 3).map((a, i) => (
              <a
                key={i}
                href={a.url || "#"}
                target="_blank"
                className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50"
              >
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-gray-600">{a.note || ""}</div>
              </a>
            ))
          ) : (
            <div className="text-gray-500">加载中…</div>
          )}
        </div>

        <div className="mt-6">
          <button
            className="btn btn-primary"
            onClick={() => addPoints(15, "Choose refurbished/second-hand")}
          >
            选择二手/翻新（+15）
          </button>
        </div>
      </aside>
    </div>
  );
}
