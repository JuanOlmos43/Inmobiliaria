import { Icon } from "@/components/ui";

interface AgentPerformance {
  id: number;
  name: string;
  contracts: number;
}

// Mock Data - Top 5 Agentes por cantidad de contratos
const topAgents: AgentPerformance[] = [
  { id: 1, name: "Ana García", contracts: 20 },
  { id: 2, name: "Carlos Ruiz", contracts: 14 },
  { id: 3, name: "María López", contracts: 11 },
  { id: 4, name: "Juan Pérez", contracts: 10 },
  { id: 5, name: "Sofía Díaz", contracts: 6 },
];

export default function GerenciaTopAgents() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-1">
      <h3 className="mb-6 text-lg font-bold text-[#0f172a]">
        Top 5 Agentes (Contratos)
      </h3>

      <div className="flex-1">
        <ul className="space-y-4">
          {topAgents.map((agent, index) => {
            const isTop3 = index < 3;
            return (
              <li
                key={agent.id}
                className="group flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {/* Rank Number */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {index + 1}
                  </span>

                  <span
                    className={`text-sm font-medium ${isTop3 ? "text-slate-800" : "text-slate-600"}`}
                  >
                    {agent.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-[#14b8a6]">
                    {agent.contracts}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
