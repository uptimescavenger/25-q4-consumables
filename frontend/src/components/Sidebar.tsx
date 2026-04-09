import { NavLink } from "react-router-dom";
import {
  Home, LayoutDashboard, Building2, Package, Monitor,
  ClipboardList, Logs, Wrench, Users, FileText, Settings,
  ChevronDown, MessageCircle, HelpCircle,
} from "lucide-react";

const mainNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "#", label: "Dashboards", icon: LayoutDashboard, chevron: true },
  { to: "#", label: "Facilities", icon: Building2 },
  { to: "/consumables", label: "Consumables", icon: Package, chevron: true, children: [
    { to: "/consumables", label: "Inventory/Orders" },
    { to: "/consumables/catalog", label: "Catalog" },
  ]},
  { to: "#", label: "Devices", icon: Monitor },
  { to: "#", label: "Tasks", icon: ClipboardList, badge: 32 },
  { to: "#", label: "Logs", icon: Logs },
  { to: "#", label: "Service Requests", icon: Wrench, badge: 32 },
  { to: "#", label: "Technicians", icon: Users },
  { to: "#", label: "Documents", icon: FileText },
  { to: "#", label: "Settings", icon: Settings, chevron: true },
];

export default function Sidebar() {
  return (
    <aside className="w-[289px] min-h-screen bg-white border-r border-grey-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-[73px] flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <span className="text-[18px] font-medium text-grey-black">
            <span className="text-purple-500">uptime</span>health
          </span>
        </div>
      </div>

      {/* Organization */}
      <div className="h-[72px] flex items-center px-5 gap-3 border-b border-grey-200">
        <div className="w-[50px] h-[50px] bg-purple-100 rounded-full flex items-center justify-center text-purple-500 font-bold text-lg">
          UB
        </div>
        <span className="text-sm font-medium text-grey-black">Uptime Business</span>
      </div>

      <div className="mx-5 my-0 border-b border-grey-200" />

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {mainNav.map((item) => (
          <div key={item.label}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center h-[56px] px-5 gap-3 text-sm transition-colors relative ${
                  isActive && item.to !== "#"
                    ? "text-purple-500 bg-purple-50 border-l-[4px] border-purple-500"
                    : "text-grey-600 hover:bg-grey-50 border-l-[4px] border-transparent"
                }`
              }
            >
              <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-status-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
              {item.chevron && <ChevronDown size={16} className="text-grey-400" />}
            </NavLink>
            {item.children && (
              <div className="ml-[72px]">
                {item.children.map((child) => (
                  <NavLink
                    key={child.label}
                    to={child.to}
                    className={({ isActive }) =>
                      `block py-2 text-sm ${
                        isActive ? "text-purple-500 font-medium" : "text-grey-600 hover:text-purple-500"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom links */}
      <div className="border-t border-grey-200 py-2">
        <button className="flex items-center h-[56px] px-5 gap-3 text-sm text-grey-600 hover:bg-grey-50 w-full">
          <MessageCircle size={20} />
          <span>Chat Support</span>
        </button>
        <button className="flex items-center h-[56px] px-5 gap-3 text-sm text-grey-600 hover:bg-grey-50 w-full">
          <HelpCircle size={20} />
          <span>Help Center</span>
        </button>
      </div>
    </aside>
  );
}
