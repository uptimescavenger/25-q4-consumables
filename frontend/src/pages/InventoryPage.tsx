import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Header from "../components/Header";
import { Search, SlidersHorizontal, Minus, Plus, Edit3, Save, X, Package } from "lucide-react";

type StatusFilter = "all" | "out_of_stock" | "low_quantity" | "in_stock" | "active_orders";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);

  const fetchInventory = useCallback(() => {
    const params: Record<string, string> = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (searchQuery) params.search = searchQuery;
    if (vendorFilter !== "all") params.vendor = vendorFilter;
    api.getInventory(params).then(setData).catch(console.error);
  }, [statusFilter, searchQuery, vendorFilter]);

  useEffect(() => {
    fetchInventory();
    api.getVendors().then((r) => setVendors(r.data));
  }, [fetchInventory]);

  const startEdit = (inv: any) => {
    setEditingId(inv.id);
    setEditQty(inv.quantityOnHand);
  };

  const saveEdit = async (inv: any) => {
    const diff = editQty - inv.quantityOnHand;
    if (diff !== 0) {
      await api.updateQuantity(inv.id, diff);
    }
    setEditingId(null);
    fetchInventory();
  };

  const statusBadge = (status: string, qty: number) => {
    const map: Record<string, string> = { out_of_stock: "badge-red", low_quantity: "badge-orange", in_stock: "badge-green", active_orders: "badge-purple" };
    const labels: Record<string, string> = { out_of_stock: "Out of Stock", low_quantity: "Low Qty", in_stock: "In Stock", active_orders: "Active Orders" };
    return <span className={`badge ${map[status]}`}>{labels[status]} ({qty})</span>;
  };

  const chips: { key: StatusFilter; label: string; color: string }[] = [
    { key: "all", label: "All Items", color: "#695EE4" },
    { key: "out_of_stock", label: "Out of Stock", color: "#EF5350" },
    { key: "low_quantity", label: "Low Quantity", color: "#FF9800" },
    { key: "in_stock", label: "In Stock", color: "#4CAF50" },
    { key: "active_orders", label: "Active Orders", color: "#695EE4" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Inventory">
        <button className="btn btn-primary" onClick={() => navigate("/orders?new=true")}>
          <Plus size={15} /> New Order
        </button>
      </Header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Filter Chips */}
        <div className="flex gap-2 mb-4">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setStatusFilter(chip.key)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
                statusFilter === chip.key
                  ? "text-white shadow-sm"
                  : "bg-white text-[#666] border-[#eee] hover:border-[#695EE4] hover:text-[#695EE4]"
              }`}
              style={statusFilter === chip.key ? { background: chip.color, borderColor: chip.color } : {}}
            >
              {chip.label} ({data?.statusCounts?.[chip.key] ?? 0})
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              className="input input-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="input w-[220px]"
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          >
            <option value="all">All Vendors</option>
            {vendors.map((v: any) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width: 50}}></th>
                <th>Item Name</th>
                <th>Description</th>
                <th>Vendor</th>
                <th>Status</th>
                <th>Qty on Hand</th>
                <th>Reorder At</th>
                <th>Price</th>
                <th>Reminders</th>
                <th style={{width: 100}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((inv: any, i: number) => (
                <tr key={inv.id} className="animate-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <td>
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] border border-[#eee] flex items-center justify-center">
                      <Package size={16} className="text-[#bbb]" />
                    </div>
                  </td>
                  <td>
                    <div className="font-medium text-[#695EE4] cursor-pointer hover:underline">{inv.item.name}</div>
                    <div className="text-[11px] text-[#999]">SKU: {inv.item.sku}</div>
                  </td>
                  <td>
                    <div className="text-[12px] text-[#666] max-w-[180px] truncate">{inv.item.description}</div>
                  </td>
                  <td>
                    <div className="text-[12px]">{inv.vendors.map((v: any) => v.name).join(", ")}</div>
                  </td>
                  <td>{statusBadge(inv.status, inv.quantityOnHand)}</td>
                  <td>
                    {editingId === inv.id ? (
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-[#f5f5f5] rounded" onClick={() => setEditQty(Math.max(0, editQty - 1))}>
                          <Minus size={14} className="text-[#999]" />
                        </button>
                        <input
                          type="number"
                          className="w-14 text-center border border-[#695EE4] rounded py-1 text-[13px] font-medium"
                          value={editQty}
                          onChange={(e) => setEditQty(Math.max(0, parseInt(e.target.value) || 0))}
                          autoFocus
                        />
                        <button className="p-1 hover:bg-[#f5f5f5] rounded" onClick={() => setEditQty(editQty + 1)}>
                          <Plus size={14} className="text-[#695EE4]" />
                        </button>
                      </div>
                    ) : (
                      <span className={`font-semibold ${inv.quantityOnHand === 0 ? "text-[#EF5350]" : inv.quantityOnHand <= inv.reorderThreshold ? "text-[#FF9800]" : "text-[#1b1b1b]"}`}>
                        {inv.quantityOnHand}
                      </span>
                    )}
                  </td>
                  <td className="text-[12px] text-[#999]">{inv.reorderThreshold}</td>
                  <td className="font-medium">${inv.price.toFixed(2)}</td>
                  <td>
                    <div
                      className={`toggle ${inv.reminderEnabled ? "on" : "off"}`}
                      onClick={() => {
                        inv.reminderEnabled = !inv.reminderEnabled;
                        api.toggleReminder(inv.id, inv.reminderEnabled);
                        setData({ ...data });
                      }}
                    />
                  </td>
                  <td>
                    {editingId === inv.id ? (
                      <div className="flex gap-1">
                        <button className="btn btn-sm btn-primary" onClick={() => saveEdit(inv)}>
                          <Save size={13} />
                        </button>
                        <button className="btn btn-sm btn-ghost" onClick={() => setEditingId(null)}>
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button className="btn btn-sm btn-ghost" onClick={() => startEdit(inv)} title="Edit quantity">
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => navigate("/orders?new=true&item=" + inv.itemId)}
                          title="Quick order"
                        >
                          Order
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data?.data?.length === 0 && (
            <div className="py-12 text-center text-[#999] text-sm">No items match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
