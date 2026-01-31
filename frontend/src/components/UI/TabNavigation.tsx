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
export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="mb-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-4 px-2 font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#14b8a6]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#14b8a6]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
