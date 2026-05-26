"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { month: string; revenue: number; expenses: number; profit: number };

export function RevenueChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dc2626" stopOpacity={0.35} />
            <stop offset="1" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4b5563" stopOpacity={0.25} />
            <stop offset="1" stopColor="#4b5563" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="#71717a" />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          stroke="#71717a"
          tickFormatter={(v) => `$${Number(v) / 1000}k`}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
          formatter={(v) => `$${Number(v).toLocaleString()}`}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#dc2626"
          strokeWidth={2}
          fill="url(#revFill)"
          name="Revenue"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#4b5563"
          strokeWidth={2}
          fill="url(#expFill)"
          name="Expenses"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
