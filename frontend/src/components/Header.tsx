import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-[57px] flex items-center justify-between px-6 bg-white border-b border-grey-200">
      <h1 className="text-[20px] font-medium text-grey-black">{title}</h1>
      <div className="flex items-center gap-4">
        {subtitle && <span className="text-sm text-grey-600">{subtitle}</span>}
        <button className="relative p-2 hover:bg-grey-50 rounded-full">
          <Bell size={20} className="text-grey-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-red rounded-full" />
        </button>
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 text-sm font-bold">
          I
        </div>
      </div>
    </header>
  );
}
