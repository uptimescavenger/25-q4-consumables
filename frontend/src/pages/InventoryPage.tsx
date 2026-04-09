import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import QuantityCounter from "../components/QuantityCounter";
import { Search, Filter, Plus, ChevronUp, X } from "lucide-react";

type StatusFilter = "all" | "out_of_stock" | "low_quantity" | "in_stock" | "active_orders";
type Tab = "items" | "orders";

export default function InventoryPage() {
  const [tab, setTab] = useState<Tab>("items");
  const [data, setData] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});

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

  useEffect(() => {
    if (tab === "orders") {
      api.getOrders().then(setOrders).catch(console.error);
    }
  }, [tab]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedItems.size === data.data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.data.map((inv: any) => inv.id)));
    }
  };

  const handleCreateOrder = async () => {
    if (selectedItems.size === 0) return;
    const items = data.data
      .filter((inv: any) => selectedItems.has(inv.id))
      .map((inv: any) => ({
        itemId: inv.itemId,
        vendorId: inv.vendorIds[0],
        quantity: cartQuantities[inv.id] || 1,
        unitPrice: inv.price,
      }));
    await api.createOrder({ facilityId: "f1", vendorId: items[0].vendorId, items });
    setSelectedItems(new Set());
    setCartQuantities({});
    setCartOpen(false);
    fetchInventory();
  };

  const filterChips: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All Items" },
    { key: "out_of_stock", label: "Out of Stock" },
    { key: "low_quantity", label: "Low Quantity" },
    { key: "in_stock", label: "In Stock" },
    { key: "active_orders", label: "Active Orders" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Inventory/Orders" />

      {/* Gradient sub-header */}
      <div className="bg-gradient-to-r from-purple-500/5 to-transparent h-12 flex items-center px-6 border-b border-grey-200" />

      {/* Tabs */}
      <div className="flex items-center border-b border-grey-200 px-6">
        {(["items", "orders"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? "border-purple-500 text-purple-500"
                : "border-transparent text-grey-600 hover:text-grey-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "items" && (
        <div className="flex-1 flex flex-col px-6 py-4">
          {/* Filter Chips */}
          <div className="flex gap-4 mb-4">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => setStatusFilter(chip.key)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  statusFilter === chip.key
                    ? "bg-purple-500 text-white border-purple-500"
                    : "bg-white text-grey-800 border-grey-200 hover:border-purple-500"
                }`}
              >
                {chip.label} ({data?.statusCounts?.[chip.key] ?? 0})
              </button>
            ))}
          </div>

          {/* Search + Actions Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
              <input
                type="text"
                placeholder="Search by Keyword, Part Number, or Description"
                className="w-full pl-10 pr-4 py-2.5 border border-grey-200 rounded text-sm focus:outline-none focus:border-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border border-grey-200 rounded px-3 py-2.5 text-sm text-grey-800 bg-white min-w-[250px]"
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
            >
              <option value="all">Choose Vendors (All by default)</option>
              {vendors.map((v: any) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <button className="p-2.5 border border-grey-200 rounded hover:bg-grey-50">
              <Filter size={18} className="text-grey-600" />
            </button>
            <button
              className="flex items-center gap-2 bg-purple-500 text-white text-sm font-medium px-4 py-2.5 rounded hover:bg-purple-600"
              onClick={handleCreateOrder}
            >
              <Plus size={16} />
              Create New Order
            </button>
          </div>

          {/* Item count */}
          <div className="flex items-center justify-end mb-2 text-sm text-grey-600">
            {selectedItems.size} Item selected
          </div>

          {/* Table */}
          <div className="bg-white border border-grey-200 rounded overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-grey-200">
                  <th className="w-12 py-4 px-3">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={data?.data?.length > 0 && selectedItems.size === data.data.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {["Item Photo", "Item Name", "Item Description", "Vendor", "Status", "Reminders", "Price", "Quantity"].map((h) => (
                    <th key={h} className="text-left text-sm font-normal text-grey-black py-4 px-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((inv: any) => (
                  <tr
                    key={inv.id}
                    className={`border-b border-grey-200 hover:bg-grey-50 ${selectedItems.has(inv.id) ? "bg-purple-50" : ""}`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        className="accent-purple-500"
                        checked={selectedItems.has(inv.id)}
                        onChange={() => toggleSelect(inv.id)}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="w-12 h-12 bg-grey-100 rounded border border-grey-200 flex items-center justify-center text-grey-400 text-xs">
                        IMG
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs text-purple-500 cursor-pointer hover:underline">
                        {inv.item.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-grey-black max-w-[220px]">{inv.item.description}</td>
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
                            const newState = !inv.reminderEnabled;
                            inv.reminderEnabled = newState;
                            api.toggleReminder(inv.id, newState);
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
                          setCartQuantities((prev) => ({ ...prev, [inv.id]: qty }));
                          const next = new Set(selectedItems);
                          next.add(inv.id);
                          setSelectedItems(next);
                          api.updateQuantity(inv.id, qty).then(fetchInventory);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Items Bottom Bar */}
          {selectedItems.size > 0 && (
            <div className="bg-white border border-grey-200 rounded mt-4 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-grey-black">Selected Items</span>
                  <span className="bg-purple-100 text-purple-500 text-xs px-2 py-0.5 rounded-full">{selectedItems.size}</span>
                  <button onClick={() => setCartOpen(!cartOpen)}>
                    <ChevronUp size={20} className={`text-grey-600 transition-transform ${cartOpen ? "" : "rotate-180"}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-sm text-purple-500 hover:underline" onClick={() => { setSelectedItems(new Set()); setCartQuantities({}); }}>
                    Clear
                  </button>
                  <button className="border border-grey-200 text-grey-800 text-sm px-4 py-2 rounded hover:bg-grey-50">
                    Save Draft
                  </button>
                  <button className="border border-purple-500 text-purple-500 text-sm px-4 py-2 rounded hover:bg-purple-50">
                    Send for Approval
                  </button>
                  <button
                    className="bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded hover:bg-purple-600"
                    onClick={handleCreateOrder}
                  >
                    Place Order Immediately
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="flex-1 px-6 py-4">
          <div className="bg-white border border-grey-200 rounded overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-grey-200">
                  {["Order ID", "Vendor", "Status", "Items", "Total", "Created", "Actions"].map((h) => (
                    <th key={h} className="text-left text-sm font-normal text-grey-black py-4 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders?.data?.map((order: any) => (
                  <tr key={order.id} className="border-b border-grey-200 hover:bg-grey-50">
                    <td className="py-3 px-4 text-xs text-purple-500 font-mono">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-xs text-grey-black">{order.vendor?.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-3 py-0.5 rounded-full text-xs border ${
                        order.status === "delivered" ? "bg-status-green-light border-status-green" :
                        order.status === "shipped" ? "bg-purple-100 border-purple-500" :
                        order.status === "pending_approval" ? "bg-status-orange-light border-status-orange" :
                        order.status === "cancelled" ? "bg-status-red-light border-status-red" :
                        "bg-grey-100 border-grey-400"
                      } text-grey-800`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-grey-black">{order.items.length} items</td>
                    <td className="py-3 px-4 text-xs text-grey-black font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-xs text-grey-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      {order.status === "pending_approval" && (
                        <button
                          className="text-xs text-purple-500 hover:underline"
                          onClick={() => {
                            api.updateOrderStatus(order.id, "approved").then(() => api.getOrders().then(setOrders));
                          }}
                        >
                          Approve
                        </button>
                      )}
                      {order.status === "draft" && (
                        <button
                          className="text-xs text-purple-500 hover:underline"
                          onClick={() => {
                            api.updateOrderStatus(order.id, "pending_approval").then(() => api.getOrders().then(setOrders));
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
