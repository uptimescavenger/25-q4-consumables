import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import QuantityCounter from "../components/QuantityCounter";
import { Flag, ChevronDown, Settings, Package, AlertTriangle, ShoppingCart, Zap, DollarSign } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [facility, setFacility] = useState("f1");
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard(facility).then(setData).catch(console.error);
  }, [facility]);

  if (!data) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Home" />
      <div className="bg-gradient-to-r from-purple-500/5 to-transparent h-16 flex items-center px-6">
        <h2 className="text-2xl font-medium text-grey-black">
          Hello, {data.user.name}
        </h2>
        <div className="ml-auto flex items-center gap-3">
          <select
            className="border border-grey-200 rounded px-3 py-2 text-sm text-grey-800 bg-white"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
          >
            {data.facilities.map((f: any) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button className="p-2 hover:bg-grey-100 rounded">
            <Settings size={18} className="text-grey-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4">
          {[
            { label: "Total Items", value: data.stats.totalItems, icon: Package, color: "text-purple-500" },
            { label: "Out of Stock", value: data.stats.outOfStock, icon: AlertTriangle, color: "text-status-red" },
            { label: "Low Quantity", value: data.stats.lowQuantity, icon: AlertTriangle, color: "text-status-orange" },
            { label: "Pending Orders", value: data.stats.pendingOrders, icon: ShoppingCart, color: "text-purple-500" },
            { label: "Active Automations", value: data.stats.activeAutomations, icon: Zap, color: "text-status-green" },
            { label: "Budget Used", value: `${data.stats.budgetUtilization}%`, icon: DollarSign, color: data.stats.budgetUtilization > 80 ? "text-status-red" : "text-status-green" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-grey-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-grey-600">{stat.label}</span>
              </div>
              <span className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Consumables Section */}
        <div className="bg-white border border-grey-200 rounded-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Package size={20} className="text-purple-500" />
              </div>
              <h3 className="text-base font-medium text-grey-black">Consumables</h3>
            </div>
            <button
              className="border border-purple-500 text-purple-500 text-sm font-medium px-4 py-2 rounded hover:bg-purple-50"
              onClick={() => navigate("/consumables")}
            >
              Show All
            </button>
          </div>

          <div className="px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-grey-800 mb-4">
              <Flag size={16} className="text-status-red" />
              <span>
                Out of Stock & Low Quality ({Math.min(5, data.criticalCount)} of {data.criticalCount} shown)
              </span>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-y border-grey-200">
                  {["Item Photo", "Item Name", "Item Description", "Vendor", "Status", "Reminders", "Price", "Quantity"].map((h) => (
                    <th key={h} className="text-left text-sm font-normal text-grey-black py-3 px-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.criticalInventory.slice(0, 5).map((inv: any) => (
                  <tr key={inv.id} className="border-b border-grey-200 hover:bg-grey-50">
                    <td className="py-3 px-2">
                      <div className="w-12 h-12 bg-grey-100 rounded border border-grey-200 flex items-center justify-center text-grey-400 text-xs">
                        IMG
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        className="text-xs text-purple-500 hover:underline text-left"
                        onClick={() => navigate("/consumables")}
                      >
                        {inv.item.name}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-xs text-grey-black max-w-[200px]">{inv.item.description}</td>
                    <td className="py-3 px-2 text-xs text-grey-black">
                      {inv.vendors.map((v: any) => v.name).join(" / ")}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge status={inv.status} quantity={inv.quantityOnHand} />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <button
                          className={`w-9 h-5 rounded-full relative transition-colors ${
                            inv.reminderEnabled ? "bg-purple-500" : "bg-grey-400"
                          }`}
                          onClick={() => {
                            inv.reminderEnabled = !inv.reminderEnabled;
                            api.toggleReminder(inv.id, inv.reminderEnabled);
                            setData({ ...data });
                          }}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              inv.reminderEnabled ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-xs text-grey-black">${inv.price.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <QuantityCounter
                        onAdd={(qty) => {
                          api.updateQuantity(inv.id, qty).then(() => api.getDashboard(facility).then(setData));
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white border border-grey-200 rounded-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Package size={20} className="text-purple-500" />
              </div>
              <h3 className="text-base font-medium text-grey-black">
                Tasks <span className="text-grey-600 font-normal text-sm">(due yesterday and today at all facilities)</span>
              </h3>
            </div>
            <button className="border border-purple-500 text-purple-500 text-sm font-medium px-4 py-2 rounded hover:bg-purple-50">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 px-6 py-4">
            {/* To Do */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flag size={14} className="text-status-orange" />
                <span className="text-sm font-medium text-grey-black">To Do</span>
                <span className="text-xs text-grey-600">({data.tasks.todo.length} of {data.tasks.todoTotal} shown)</span>
              </div>
              <div className="space-y-3">
                {data.tasks.todo.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="bg-grey-50 border border-grey-200 rounded-lg p-4">
                    <p className="text-sm text-grey-black mb-2">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-grey-600">
                      <span className="bg-purple-100 text-purple-500 px-2 py-0.5 rounded">{task.facilityId === "f1" ? "Facility from Munich" : "Dental clinic"}</span>
                      <span className="bg-grey-100 px-2 py-0.5 rounded">{task.category}</span>
                      <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>{new Date(task.dueDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="bg-grey-100 px-2 py-0.5 rounded">{task.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overdue */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flag size={14} className="text-status-red" />
                <span className="text-sm font-medium text-grey-black">Overdue</span>
                <span className="text-xs text-grey-600">({data.tasks.overdue.length} of {data.tasks.overdueTotal} shown)</span>
              </div>
              <div className="space-y-3">
                {data.tasks.overdue.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="bg-grey-50 border border-grey-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-grey-black">{task.title}</p>
                      {task.subtaskCount > 0 && (
                        <span className="text-xs text-grey-600">{task.subtaskCompleted} of {task.subtaskCount}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-grey-600">
                      <span className="bg-purple-100 text-purple-500 px-2 py-0.5 rounded">{task.facilityId === "f3" ? "Dental clinic" : "Facility from Munich"}</span>
                      <span className="bg-grey-100 px-2 py-0.5 rounded">{task.category}</span>
                      <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>{new Date(task.dueDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="bg-grey-100 px-2 py-0.5 rounded">{task.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
