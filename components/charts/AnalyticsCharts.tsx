"use client";
// components/charts/AnalyticsCharts.tsx
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CONDITIONS } from "@/lib/utils";

const PIE_COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-foreground">{label || payload[0].name}</p>
        <p className="text-teal-600 dark:text-teal-400 font-bold">
          {payload[0].value} report{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts() {
  const { activeReports } = useApp();

  // Reports by shift
  const shiftData = [
    {
      name: "Morning",
      value: activeReports.filter((r) => {
        const h = new Date(r.timestamp).getHours();
        return h >= 8 && h < 16;
      }).length,
    },
    {
      name: "Afternoon",
      value: activeReports.filter((r) => {
        const h = new Date(r.timestamp).getHours();
        return h >= 16;
      }).length,
    },
    {
      name: "Night",
      value: activeReports.filter((r) => {
        const h = new Date(r.timestamp).getHours();
        return h < 8;
      }).length,
    },
  ];

  // Condition distribution
  const condData = CONDITIONS.map((c) => ({
    name: c,
    value: activeReports.filter((r) => r.condition === c).length,
  })).filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Bar Chart — Reports by Shift */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center">
            <BarChart2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <p className="text-sm font-bold text-foreground">Reports by Shift</p>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart
            data={shiftData}
            margin={{ top: 0, right: 4, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#0d9488" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart — Condition Distribution */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <p className="text-sm font-bold text-foreground">
            Condition Distribution
          </p>
        </div>

        {condData.length === 0 ? (
          <div className="h-[140px] flex items-center justify-center text-muted-foreground text-sm">
            No data yet
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={condData}
                  cx={55}
                  cy={55}
                  innerRadius={32}
                  outerRadius={52}
                  dataKey="value"
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {condData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {condData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground flex-1">
                    {d.name}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
