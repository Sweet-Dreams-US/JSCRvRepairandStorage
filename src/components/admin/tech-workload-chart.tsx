"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { name: string; active: number; completed: number; color: string };

export function TechWorkloadChart({ data }: { data: Row[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} stroke="#71717a" />
        <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#71717a" />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="active" name="Active" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell key={`active-${idx}`} fill={entry.color} />
          ))}
        </Bar>
        <Bar dataKey="completed" name="Completed" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
