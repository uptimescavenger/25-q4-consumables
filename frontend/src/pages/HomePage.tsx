import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Header from "../components/Header";
import {
  Package, AlertTriangle, ShoppingCart, Zap, DollarSign,
  ArrowRight, Clock,
} from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard("f1").then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[#999] text-sm">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    { label: "Total Items", value: data.stats.totalItems, icon: Package, color: "#695EE4", bg: "#EFEEFC" },
    { label: "Out of Stock", value: data.stats.outOfStock, icon: AlertTriangle, color: "#EF5350", bg: "#FFEBEE" },
    { label: "Low Quantity", value: data.stats.lowQuantity, icon: AlertTriangle, color: "#FF9800", bg: "#FFF3E0" },
    { label: "Pending Orders", value: data.stats.pendingOrders, icon: ShoppingCart, color: "#695EE4", bg: "#EFEEFC" },
    { label: "Automations", value: data.stats.activeAutomations, icon: Zap, color: "#4CAF50", bg: "#E8F5E9" },
    { label: "Budget Used", value: `${data.stats.budgetUtilization}%`, icon: DollarSign, color: data.stats.budgetUtilization > 80 ? "#EF5350" : "#4CAF50", bg: data.stats.budgetUtilization > 80 ? "#FFEBEE" : "#E8F5E9" },
  ];

  const statusBadge = (status: string, qty: number) => {
    const map: Record<string, string> = {
      out_of_stock: "badge-red",
      low_quantity: "badge-orange",
      in_stock: "badge-green",
      active_orders: "badge-purple",
    };
    const labels: Record<string, string> = {
      out_of_stock: "Out of Stock",
      low_quantity: "Low Qty",
      in_stock: "In Stock",
      active_orders: "Active Orders",
    };
    return <span className={`badge ${map[status] || "badge-grey"}`}>{labels[status]} ({qty})</span>;
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Dashboard" />

      <div className="flex-1 overflow-y-auto">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-[#695EE4] to-[#8B83F0] px-6 py-5">
          <h2 className="text-white text-xl font-semibold">Welcome back, {data.user.name}</h2>
          <p className="text-white/70 text-sm mt-1">Here's what needs your attention today</p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-6 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="card p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                    <s.icon size={16} style={{ color: s.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-[#999] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Critical Items + Quick Actions */}
          <div className="grid grid-cols-3 gap-5">
            {/* Critical Items */}
            <div className="col-span-2 card">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee]">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#EF5350]" />
                  <h3 className="text-sm font-semibold">Items Needing Attention</h3>
                  <span className="badge badge-red">{data.criticalCount}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate("/inventory")}>
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="p-0">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Vendor</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.criticalInventory.slice(0, 5).map((inv: any) => (
                      <tr key={inv.id}>
                        <td>
                          <div className="font-medium text-[13px]">{inv.item.name}</div>
                          <div className="text-[11px] text-[#999] mt-0.5">{inv.item.description.slice(0, 50)}...</div>
                        </td>
                        <td className="text-[12px] text-[#666]">{inv.vendors.map((v: any) => v.name).join(", ")}</td>
                        <td>{statusBadge(inv.status, inv.quantityOnHand)}</td>
                        <td className="font-medium">${inv.price.toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate("/orders?add=" + inv.itemId)}
                          >
                            Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions + Budget */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-primary w-full btn-lg" onClick={() => navigate("/orders?new=true")}>
                    <ShoppingCart size={16} /> Create New Order
                  </button>
                  <button className="btn btn-outline w-full" onClick={() => navigate("/inventory")}>
                    <Package size={16} /> Update Inventory
                  </button>
                  <button className="btn btn-outline w-full" onClick={() => navigate("/automations")}>
                    <Zap size={16} /> Setup Automation
                  </button>
                </div>
              </div>

              {/* Budget */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-3">Q4 Budget</h3>
                {data.budgets.map((b: any) => (
                  <div key={b.id} className="mb-3">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-[#666]">{b.category}</span>
                      <span className="font-medium">${b.spentAmount.toLocaleString()} / ${b.allocatedAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (b.spentAmount / b.allocatedAmount) * 100)}%`,
                          background: (b.spentAmount / b.allocatedAmount) > 0.8 ? "#EF5350" : "#695EE4",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Approvals */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-[#FF9800]" />
                  <h3 className="text-sm font-semibold">Pending Approvals</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#FFF8E1] rounded-lg">
                    <div>
                      <div className="text-[12px] font-medium">Order #o2</div>
                      <div className="text-[11px] text-[#999]">$129.60 · Patterson</div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate("/orders")}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
