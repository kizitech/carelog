"use client";
// components/charts/AnalyticsCharts.tsx
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2, Building2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DEPARTMENTS } from "@/lib/utils";

const PIE_COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-foreground">{label || payload[0].name}</p>
        <p className="text-blue-600 dark:text-blue-400 font-bold">{payload[0].value} report{payload[0].value !== 1 ? "s" : ""}</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts() {
  const { activeReports } = useApp();

  const shiftData = [
    { name: "Morning", value: activeReports.filter(r => r.shift === "Morning").length },
    { name: "Afternoon", value: activeReports.filter(r => r.shift === "Afternoon").length },
    { name: "Night", value: activeReports.filter(r => r.shift === "Night").length },
  ];

  const deptData = DEPARTMENTS.map(d => ({
    name: d.replace(" Ward", "").replace("General", "Gen."),
    full: d,
    value: activeReports.filter(r => r.department === d).length,
  })).filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Bar Chart — By Shift */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
            <BarChart2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-bold text-foreground">Reports by Shift</p>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={shiftData} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie — Department Distribution */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-bold text-foreground">Reports by Department</p>
        </div>
        {deptData.length === 0 ? (
          <div className="h-[140px] flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={deptData} cx={55} cy={55} innerRadius={32} outerRadius={52} dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {deptData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13 }} formatter={(v, n, p) => [v + " reports", p.payload.full]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5 min-w-0">
              {deptData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-xs text-muted-foreground flex-1 truncate">{d.name}</span>
                  <span className="text-xs font-bold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
