import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Package, ShoppingCart, Zap, BarChart3,
  MessageCircle, HelpCircle,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/automations", label: "Automations", icon: Zap },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-[#eee] flex flex-col shrink-0 sticky top-0">
      {/* Logo */}
      <div className="h-[64px] flex items-center px-5 border-b border-[#eee]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#695EE4] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <div className="leading-tight">
            <span className="text-[15px] font-semibold text-[#1b1b1b]">
              <span className="text-[#695EE4]">uptime</span>health
            </span>
          </div>
        </div>
      </div>

      {/* Org */}
      <div className="px-5 py-3 border-b border-[#eee]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#EFEEFC] rounded-full flex items-center justify-center text-[#695EE4] font-bold text-xs">
            UB
          </div>
          <div>
            <div className="text-[13px] font-medium text-[#1b1b1b]">Uptime Business</div>
            <div className="text-[11px] text-[#999]">Dental Clinic</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3">
        <div className="text-[10px] font-semibold text-[#bbb] uppercase tracking-wider px-3 mb-2">Main Menu</div>
        {nav.map((item) => {
          const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-[#695EE4] text-white shadow-sm shadow-[#695EE4]/25"
                  : "text-[#666] hover:bg-[#F5F4FE] hover:text-[#695EE4]"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#eee] p-3">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[#666] hover:bg-[#F5F4FE] w-full">
          <MessageCircle size={16} />
          Support
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[#666] hover:bg-[#F5F4FE] w-full">
          <HelpCircle size={16} />
          Help Center
        </button>
      </div>
    </aside>
  );
}
