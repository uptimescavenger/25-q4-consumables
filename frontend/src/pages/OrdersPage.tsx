import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Header from "../components/Header";
import {
  Plus, ShoppingCart, Truck, CheckCircle2, Clock, XCircle,
  Package, ChevronDown, ChevronUp, Minus, Trash2,
} from "lucide-react";

type OrderStatus = "all" | "draft" | "pending_approval" | "approved" | "shipped" | "delivered";

interface CartItem {
  itemId: string;
  name: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  unitPrice: number;
}

export default function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<any>(null);
  const [inventory, setInventory] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [showCreate, setShowCreate] = useState(searchParams.get("new") === "true");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [notes, setNotes] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    api.getInventory().then(setInventory);
  }, []);

  useEffect(() => {
    // Pre-add item from URL param
    const itemId = searchParams.get("item");
    if (itemId && inventory?.data) {
      const inv = inventory.data.find((i: any) => i.itemId === itemId);
      if (inv && !cart.find((c) => c.itemId === itemId)) {
        setCart([...cart, {
          itemId: inv.itemId,
          name: inv.item.name,
          vendorId: inv.vendorIds[0],
          vendorName: inv.vendors[0]?.name || "",
          quantity: 1,
          unitPrice: inv.price,
        }]);
        setShowCreate(true);
      }
    }
  }, [inventory, searchParams]);

  const fetchOrders = () => {
    const params: Record<string, string> = {};
    if (statusFilter !== "all") params.status = statusFilter;
    api.getOrders(params).then(setOrders);
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const addToCart = (inv: any) => {
    if (cart.find((c) => c.itemId === inv.itemId)) return;
    setCart([...cart, {
      itemId: inv.itemId,
      name: inv.item.name,
      vendorId: inv.vendorIds[0],
      vendorName: inv.vendors[0]?.name || "",
      quantity: 1,
      unitPrice: inv.price,
    }]);
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(cart.map((c) => c.itemId === itemId ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((c) => c.itemId !== itemId));
  };

  const cartTotal = cart.reduce((s, c) => s + c.quantity * c.unitPrice, 0);
  const cartTax = Math.round(cartTotal * 0.08 * 100) / 100;

  const submitOrder = async (status: "draft" | "pending_approval") => {
    await api.createOrder({
      facilityId: "f1",
      vendorId: cart[0]?.vendorId || "v1",
      shippingMethod,
      notes,
      items: cart.map((c) => ({
        itemId: c.itemId,
        vendorId: c.vendorId,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
      })),
    });
    // If submitting for approval, update status
    if (status === "pending_approval") {
      const ordersData = await api.getOrders();
      const latest = ordersData.data[ordersData.data.length - 1];
      if (latest) await api.updateOrderStatus(latest.id, "pending_approval");
    }
    setCart([]);
    setNotes("");
    setShowCreate(false);
    setSearchParams({});
    fetchOrders();
  };

  const statusIcon = (status: string) => {
    const map: Record<string, any> = {
      draft: <Clock size={14} className="text-[#999]" />,
      pending_approval: <Clock size={14} className="text-[#FF9800]" />,
      approved: <CheckCircle2 size={14} className="text-[#4CAF50]" />,
      ordered: <ShoppingCart size={14} className="text-[#695EE4]" />,
      shipped: <Truck size={14} className="text-[#2196F3]" />,
      delivered: <CheckCircle2 size={14} className="text-[#4CAF50]" />,
      cancelled: <XCircle size={14} className="text-[#EF5350]" />,
    };
    return map[status] || null;
  };

  const statusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      draft: "badge-grey", pending_approval: "badge-orange", approved: "badge-green",
      ordered: "badge-purple", shipped: "badge-purple", delivered: "badge-green", cancelled: "badge-red",
    };
    return map[status] || "badge-grey";
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Orders">
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Create Order
        </button>
      </Header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Create Order Panel */}
        {showCreate && (
          <div className="card mb-5 animate-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee] bg-[#FAFAFE]">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <ShoppingCart size={16} className="text-[#695EE4]" /> New Order
              </h3>
              <button className="text-[#999] hover:text-[#666]" onClick={() => { setShowCreate(false); setSearchParams({}); }}>
                <XCircle size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-0">
              {/* Item Picker */}
              <div className="col-span-2 border-r border-[#eee] p-5">
                <div className="text-[12px] font-semibold text-[#999] uppercase tracking-wide mb-3">Select Items to Order</div>
                <div className="max-h-[320px] overflow-y-auto space-y-1">
                  {inventory?.data?.map((inv: any) => {
                    const inCart = cart.find((c) => c.itemId === inv.itemId);
                    return (
                      <div
                        key={inv.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          inCart ? "bg-[#F5F4FE] border border-[#695EE4]/20" : "hover:bg-[#fafafa] border border-transparent"
                        }`}
                        onClick={() => !inCart && addToCart(inv)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                          <Package size={14} className="text-[#bbb]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium truncate">{inv.item.name}</div>
                          <div className="text-[11px] text-[#999]">{inv.vendors[0]?.name} · ${inv.price.toFixed(2)}/unit</div>
                        </div>
                        <div>
                          {inv.status === "out_of_stock" && <span className="badge badge-red text-[10px]">Out of Stock</span>}
                          {inv.status === "low_quantity" && <span className="badge badge-orange text-[10px]">Low</span>}
                        </div>
                        {inCart ? (
                          <CheckCircle2 size={18} className="text-[#695EE4] shrink-0" />
                        ) : (
                          <Plus size={16} className="text-[#bbb] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="p-5 flex flex-col">
                <div className="text-[12px] font-semibold text-[#999] uppercase tracking-wide mb-3">
                  Order Summary ({cart.length} items)
                </div>

                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-[#ccc] text-sm">
                    Click items to add them
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                      {cart.map((item) => (
                        <div key={item.itemId} className="bg-[#fafafa] rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-[12px] font-medium pr-2">{item.name}</div>
                            <button className="text-[#ccc] hover:text-[#EF5350] shrink-0" onClick={() => removeFromCart(item.itemId)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-white border border-[#eee] rounded">
                              <button className="p-1 hover:bg-[#f5f5f5]" onClick={() => updateCartQty(item.itemId, -1)}>
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-[12px] font-medium">{item.quantity}</span>
                              <button className="p-1 hover:bg-[#f5f5f5]" onClick={() => updateCartQty(item.itemId, 1)}>
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-[12px] font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping */}
                    <div className="mb-3">
                      <label className="text-[11px] font-semibold text-[#999] uppercase">Shipping</label>
                      <select className="input mt-1" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                        <option>Standard</option>
                        <option>Express</option>
                        <option>Next Day</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <label className="text-[11px] font-semibold text-[#999] uppercase">Notes</label>
                      <textarea
                        className="input mt-1 resize-none"
                        rows={2}
                        placeholder="Optional notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    {/* Totals */}
                    <div className="border-t border-[#eee] pt-3 space-y-1 mb-4">
                      <div className="flex justify-between text-[12px] text-[#666]">
                        <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[12px] text-[#666]">
                        <span>Tax (8%)</span><span>${cartTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[14px] font-bold">
                        <span>Total</span><span>${(cartTotal + cartTax).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button className="btn btn-primary w-full" onClick={() => submitOrder("pending_approval")}>
                        Submit for Approval
                      </button>
                      <button className="btn btn-outline w-full" onClick={() => submitOrder("draft")}>
                        Save as Draft
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 mb-4">
          {([
            { key: "all" as const, label: "All Orders" },
            { key: "pending_approval" as const, label: "Pending Approval" },
            { key: "approved" as const, label: "Approved" },
            { key: "shipped" as const, label: "Shipped" },
            { key: "delivered" as const, label: "Delivered" },
          ]).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setStatusFilter(chip.key)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
                statusFilter === chip.key
                  ? "bg-[#695EE4] text-white border-[#695EE4]"
                  : "bg-white text-[#666] border-[#eee] hover:border-[#695EE4]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders?.data?.map((order: any) => (
            <div key={order.id} className="card animate-in">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                {statusIcon(order.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[13px]">Order #{order.id.slice(0, 8)}</span>
                    <span className={`badge ${statusBadgeClass(order.status)}`}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#999] mt-0.5">
                    {order.vendor?.name} · {order.items.length} items · {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[14px]">${order.total.toFixed(2)}</div>
                  {order.trackingNumber && (
                    <div className="text-[11px] text-[#695EE4]">Tracking: {order.trackingNumber.slice(0, 12)}...</div>
                  )}
                </div>
                {expandedOrder === order.id ? <ChevronUp size={16} className="text-[#999]" /> : <ChevronDown size={16} className="text-[#999]" />}
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-[#eee] px-5 py-4 bg-[#fafafa] animate-in">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((oi: any) => (
                        <tr key={oi.id}>
                          <td className="font-medium">{oi.item?.name || oi.itemId}</td>
                          <td>{oi.quantity}</td>
                          <td>${oi.unitPrice.toFixed(2)}</td>
                          <td className="font-medium">${oi.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#eee]">
                    <div className="text-[12px] text-[#999]">
                      Shipping: {order.shippingMethod}
                      {order.notes && <> · Note: {order.notes}</>}
                    </div>
                    <div className="flex gap-2">
                      {order.status === "pending_approval" && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              api.updateOrderStatus(order.id, "approved").then(fetchOrders);
                            }}
                          >
                            <CheckCircle2 size={13} /> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              api.updateOrderStatus(order.id, "cancelled").then(fetchOrders);
                            }}
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      {order.status === "draft" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            api.updateOrderStatus(order.id, "pending_approval").then(fetchOrders);
                          }}
                        >
                          Submit for Approval
                        </button>
                      )}
                      {order.status === "approved" && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            api.updateOrderStatus(order.id, "shipped").then(fetchOrders);
                          }}
                        >
                          <Truck size={13} /> Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders?.data?.length === 0 && (
            <div className="card py-12 text-center text-[#999] text-sm">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}
