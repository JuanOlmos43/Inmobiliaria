"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * TabNavigation
 * Componente reutilizable para navegación por pestañas (tabs).
 * Proporciona una interfaz consistente para cambiar entre diferentes vistas.
 */
export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="mb-8">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-2 pb-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-(--accent)"
                  : "text-gray-500 hover:text-(--accent)"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-(--accent)"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
