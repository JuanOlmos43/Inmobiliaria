"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateMockData = () => {
  const data = [];
  const today = new Date();
  // Comenzamos desde el mes pasado para cumplir con "anterior al actual"
  // Si hoy es Feb 2026, mostramos de Feb 2025 a Ene 2026

  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - 1 - i, 1);

    // Obtener nombre del mes en español
    const monthName = d.toLocaleString("es-ES", { month: "short" });
    // Capitalizar primera letra (ene -> Ene)
    const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    // Datos aleatorios simulados para el demo
    data.push({
      month: monthLabel,
      venta: Math.floor(Math.random() * 8) + 2, // Valores entre 2 y 9
      alquiler: Math.floor(Math.random() * 6) + 1, // Valores entre 1 y 6
    });
  }
  return data;
};

const data = generateMockData();

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-slate-500">{entry.name}:</span>
              <span className="font-bold text-slate-700">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function GerenciaActivityChart() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
      <h3 className="mb-4 text-lg font-bold text-[#0f172a]">
        Actividad Reciente (12 Meses)
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: -20, // Adjust left margin to minimize whitespace
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Bar
              dataKey="venta"
              name="Venta"
              stackId="a"
              fill="#0f172a"
              radius={[0, 0, 0, 0]}
              barSize={32}
            />
            <Bar
              dataKey="alquiler"
              name="Alquiler"
              stackId="a"
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
