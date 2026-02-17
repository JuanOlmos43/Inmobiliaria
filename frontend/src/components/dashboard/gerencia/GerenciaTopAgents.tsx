import { TopAgent } from "@/types/api";

interface GerenciaTopAgentsProps {
  agents: TopAgent[];
  isLoading?: boolean;
}

export default function GerenciaTopAgents({
  agents,
  isLoading,
}: GerenciaTopAgentsProps) {
  if (isLoading) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-1">
        <h3 className="mb-6 text-lg font-bold text-[#0f172a]">
          Top 5 Agentes (Contratos)
        </h3>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#0f172a]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-1">
      <h3 className="mb-6 text-lg font-bold text-[#0f172a]">
        Top 5 Agentes (Contratos)
      </h3>

      <div className="flex-1">
        {agents.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No hay datos disponibles
          </p>
        ) : (
          <ul className="space-y-4">
            {agents.map((agent, index) => {
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
        )}
      </div>
    </div>
  );
}
