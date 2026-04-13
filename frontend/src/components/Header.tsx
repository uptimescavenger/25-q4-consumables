import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="h-[56px] flex items-center justify-between px-6 bg-white border-b border-[#eee] shrink-0 sticky top-0 z-10">
      <h1 className="text-[18px] font-semibold text-[#1b1b1b]">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <div className="relative">
          <button
            className="relative p-2 hover:bg-[#F5F4FE] rounded-lg transition-colors"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={18} className="text-[#666]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF5350] rounded-full" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-1 w-[320px] card shadow-lg p-0 animate-in z-50">
              <div className="px-4 py-3 border-b border-[#eee] font-medium text-sm">Notifications</div>
              {[
                { text: "Nitrile Gloves is out of stock", time: "2h ago", type: "alert" },
                { text: "Order #o2 needs approval ($129.60)", time: "5h ago", type: "action" },
                { text: "Budget is 85% spent this quarter", time: "1d ago", type: "warning" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer">
                  <div className="text-[13px] text-[#1b1b1b]">{n.text}</div>
                  <div className="text-[11px] text-[#999] mt-1">{n.time}</div>
                </div>
              ))}
              <div className="px-4 py-2 text-center">
                <button className="text-[12px] text-[#695EE4] font-medium">View All</button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 pl-2 border-l border-[#eee]">
          <div className="w-8 h-8 bg-[#EFEEFC] rounded-full flex items-center justify-center text-[#695EE4] text-[12px] font-bold">
            IR
          </div>
          <div className="text-[12px]">
            <div className="font-medium text-[#1b1b1b]">Iryna</div>
            <div className="text-[#999]">Admin</div>
          </div>
          <ChevronDown size={14} className="text-[#999]" />
        </div>
      </div>
    </header>
  );
}
