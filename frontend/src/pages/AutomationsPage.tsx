import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import Header from "../components/Header";
import {
  Zap, Plus, Edit3, Trash2, Save, X, RefreshCw, TrendingDown,
  Package, ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
} from "lucide-react";

type RuleType = "all" | "threshold" | "recurring";

export default function AutomationsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<RuleType>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const emptyForm = {
    ruleType: "threshold" as "threshold" | "recurring",
    itemId: "",
    facilityId: "f1",
    isActive: true,
    triggerQuantity: 5,
    reorderQuantity: 20,
    preferredVendorId: "",
    autoApprove: false,
    maxUnitPrice: 0,
    frequency: "monthly" as string,
    nextRunDate: "",
    quantity: 10,
    dayOfWeek: 1,
    dayOfMonth: 1,
  };
  const [form, setForm] = useState(emptyForm);

  const fetchRules = useCallback(() => {
    api.getAutomations().then((r) => setRules(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchRules();
    api.getInventory().then((r) => setInventory(r.data));
    api.getVendors().then((r) => setVendors(r.data));
  }, [fetchRules]);

  const filtered = rules.filter((r) => filterType === "all" || r.ruleType === filterType);

  const thresholdCount = rules.filter((r) => r.ruleType === "threshold").length;
  const recurringCount = rules.filter((r) => r.ruleType === "recurring").length;
  const activeCount = rules.filter((r) => r.isActive).length;

  const openCreate = (type: "threshold" | "recurring") => {
    setForm({ ...emptyForm, ruleType: type });
    setShowCreate(true);
    setEditingId(null);
  };

  const openEdit = (rule: any) => {
    setForm({
      ruleType: rule.ruleType,
      itemId: rule.itemId,
      facilityId: rule.facilityId,
      isActive: rule.isActive,
      triggerQuantity: rule.triggerQuantity ?? 5,
      reorderQuantity: rule.reorderQuantity ?? 20,
      preferredVendorId: rule.preferredVendorId ?? "",
      autoApprove: rule.autoApprove ?? false,
      maxUnitPrice: rule.maxUnitPrice ?? 0,
      frequency: rule.frequency ?? "monthly",
      nextRunDate: rule.nextRunDate ?? "",
      quantity: rule.quantity ?? 10,
      dayOfWeek: rule.dayOfWeek ?? 1,
      dayOfMonth: rule.dayOfMonth ?? 1,
    });
    setEditingId(rule.id);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!form.itemId) return;
    const payload: any = {
      facilityId: form.facilityId,
      itemId: form.itemId,
      ruleType: form.ruleType,
      isActive: form.isActive,
      preferredVendorId: form.preferredVendorId || undefined,
      autoApprove: form.autoApprove,
    };

    if (form.ruleType === "threshold") {
      payload.triggerQuantity = form.triggerQuantity;
      payload.reorderQuantity = form.reorderQuantity;
      payload.maxUnitPrice = form.maxUnitPrice || undefined;
    } else {
      payload.frequency = form.frequency;
      payload.quantity = form.quantity;
      payload.nextRunDate = form.nextRunDate || new Date().toISOString().split("T")[0];
      if (form.frequency === "weekly" || form.frequency === "biweekly") payload.dayOfWeek = form.dayOfWeek;
      if (form.frequency === "monthly") payload.dayOfMonth = form.dayOfMonth;
    }

    if (editingId) {
      await api.updateAutomation(editingId, payload);
    } else {
      await api.createAutomation(payload);
    }
    setShowCreate(false);
    setEditingId(null);
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    await api.deleteAutomation(id);
    fetchRules();
  };

  const toggleActive = async (rule: any) => {
    await api.updateAutomation(rule.id, { isActive: !rule.isActive });
    fetchRules();
  };

  const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const freqLabels: Record<string, string> = { daily: "Daily", weekly: "Weekly", biweekly: "Every 2 Weeks", monthly: "Monthly" };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Automations">
        <button className="btn btn-outline" onClick={() => openCreate("threshold")}>
          <TrendingDown size={15} /> Threshold Rule
        </button>
        <button className="btn btn-primary" onClick={() => openCreate("recurring")}>
          <RefreshCw size={15} /> Recurring Order
        </button>
      </Header>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Rules", value: rules.length, icon: Zap, color: "#695EE4", bg: "#EFEEFC" },
            { label: "Threshold Rules", value: thresholdCount, icon: TrendingDown, color: "#FF9800", bg: "#FFF3E0" },
            { label: "Recurring Orders", value: recurringCount, icon: RefreshCw, color: "#4CAF50", bg: "#E8F5E9" },
            { label: "Active", value: activeCount, icon: ToggleRight, color: "#695EE4", bg: "#EFEEFC" },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <span className="text-[12px] text-[#999]">{s.label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-4">
          {([
            { key: "all", label: "All Rules", color: "#695EE4" },
            { key: "threshold", label: "Threshold", color: "#FF9800" },
            { key: "recurring", label: "Recurring", color: "#4CAF50" },
          ] as { key: RuleType; label: string; color: string }[]).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setFilterType(chip.key)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-all ${
                filterType === chip.key
                  ? "text-white shadow-sm"
                  : "bg-white text-[#666] border-[#eee] hover:border-[#695EE4] hover:text-[#695EE4]"
              }`}
              style={filterType === chip.key ? { background: chip.color, borderColor: chip.color } : {}}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {filtered.map((rule, i) => (
            <div
              key={rule.id}
              className="card animate-in overflow-hidden"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Rule Header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: rule.ruleType === "threshold" ? "#FFF3E0" : "#E8F5E9",
                  }}
                >
                  {rule.ruleType === "threshold" ? (
                    <TrendingDown size={18} className="text-[#FF9800]" />
                  ) : (
                    <RefreshCw size={18} className="text-[#4CAF50]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[14px]">{rule.item?.name || "Unknown Item"}</span>
                    <span className={`badge ${rule.ruleType === "threshold" ? "badge-orange" : "badge-green"}`}>
                      {rule.ruleType === "threshold" ? "Threshold" : "Recurring"}
                    </span>
                    {!rule.isActive && <span className="badge" style={{ background: "#f5f5f5", color: "#999" }}>Paused</span>}
                  </div>
                  <div className="text-[12px] text-[#999] mt-0.5">
                    {rule.ruleType === "threshold"
                      ? `Reorder ${rule.reorderQuantity} units when stock drops below ${rule.triggerQuantity}`
                      : `Order ${rule.quantity} units ${freqLabels[rule.frequency] || rule.frequency}`}
                    {rule.vendor && ` · via ${rule.vendor.name}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`toggle ${rule.isActive ? "on" : "off"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActive(rule);
                    }}
                  />
                  {expandedId === rule.id ? <ChevronUp size={16} className="text-[#999]" /> : <ChevronDown size={16} className="text-[#999]" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === rule.id && (
                <div className="px-5 py-4 border-t border-[#eee] bg-[#fafafa]">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {rule.ruleType === "threshold" ? (
                      <>
                        <div>
                          <div className="text-[11px] text-[#999] mb-1">Trigger Quantity</div>
                          <div className="text-[14px] font-medium">{rule.triggerQuantity} units</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#999] mb-1">Reorder Quantity</div>
                          <div className="text-[14px] font-medium">{rule.reorderQuantity} units</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#999] mb-1">Max Unit Price</div>
                          <div className="text-[14px] font-medium">
                            {rule.maxUnitPrice ? `$${rule.maxUnitPrice.toFixed(2)}` : "No limit"}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-[11px] text-[#999] mb-1">Frequency</div>
                          <div className="text-[14px] font-medium">{freqLabels[rule.frequency] || rule.frequency}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#999] mb-1">Order Quantity</div>
                          <div className="text-[14px] font-medium">{rule.quantity} units</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#999] mb-1">Next Run</div>
                          <div className="text-[14px] font-medium">{rule.nextRunDate || "—"}</div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[12px] text-[#999]">
                      Auto-approve: <span className="font-medium text-[#1b1b1b]">{rule.autoApprove ? "Yes" : "No"}</span>
                    </div>
                    {rule.vendor && (
                      <div className="text-[12px] text-[#999]">
                        Preferred vendor: <span className="font-medium text-[#1b1b1b]">{rule.vendor.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-[#eee]">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(rule)}>
                      <Edit3 size={13} /> Edit Rule
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rule.id)}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card py-16 text-center">
            <Zap size={40} className="mx-auto text-[#ddd] mb-3" />
            <div className="text-[15px] font-medium text-[#999] mb-1">No automation rules yet</div>
            <div className="text-[13px] text-[#bbb] mb-4">
              Set up threshold alerts or recurring orders to automate your procurement
            </div>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-outline" onClick={() => openCreate("threshold")}>
                <TrendingDown size={15} /> Create Threshold Rule
              </button>
              <button className="btn btn-primary" onClick={() => openCreate("recurring")}>
                <RefreshCw size={15} /> Create Recurring Order
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eee]">
              <h3 className="text-[16px] font-semibold">
                {editingId ? "Edit" : "Create"} {form.ruleType === "threshold" ? "Threshold Rule" : "Recurring Order"}
              </h3>
              <button className="p-1 hover:bg-[#f5f5f5] rounded" onClick={() => setShowCreate(false)}>
                <X size={18} className="text-[#999]" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Rule Type Tabs */}
              {!editingId && (
                <div className="flex border border-[#eee] rounded-lg overflow-hidden">
                  <button
                    className={`flex-1 py-2.5 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors ${
                      form.ruleType === "threshold" ? "bg-[#FFF3E0] text-[#FF9800]" : "hover:bg-[#fafafa] text-[#666]"
                    }`}
                    onClick={() => setForm({ ...form, ruleType: "threshold" })}
                  >
                    <TrendingDown size={15} /> Threshold
                  </button>
                  <button
                    className={`flex-1 py-2.5 text-[13px] font-medium flex items-center justify-center gap-2 transition-colors ${
                      form.ruleType === "recurring" ? "bg-[#E8F5E9] text-[#4CAF50]" : "hover:bg-[#fafafa] text-[#666]"
                    }`}
                    onClick={() => setForm({ ...form, ruleType: "recurring" })}
                  >
                    <RefreshCw size={15} /> Recurring
                  </button>
                </div>
              )}

              {/* Item Select */}
              <div>
                <label className="text-[12px] font-medium text-[#666] mb-1 block">Item</label>
                <select
                  className="input w-full"
                  value={form.itemId}
                  onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                >
                  <option value="">Select an item...</option>
                  {inventory.map((inv: any) => (
                    <option key={inv.itemId} value={inv.itemId}>
                      {inv.item.name} — {inv.quantityOnHand} in stock
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Select */}
              <div>
                <label className="text-[12px] font-medium text-[#666] mb-1 block">Preferred Vendor</label>
                <select
                  className="input w-full"
                  value={form.preferredVendorId}
                  onChange={(e) => setForm({ ...form, preferredVendorId: e.target.value })}
                >
                  <option value="">Any vendor</option>
                  {vendors.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Threshold-specific fields */}
              {form.ruleType === "threshold" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-medium text-[#666] mb-1 block">Trigger Below (qty)</label>
                      <input
                        type="number"
                        className="input w-full"
                        value={form.triggerQuantity}
                        onChange={(e) => setForm({ ...form, triggerQuantity: parseInt(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-[#666] mb-1 block">Reorder Quantity</label>
                      <input
                        type="number"
                        className="input w-full"
                        value={form.reorderQuantity}
                        onChange={(e) => setForm({ ...form, reorderQuantity: parseInt(e.target.value) || 0 })}
                        min={1}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-[#666] mb-1 block">Max Unit Price ($)</label>
                    <input
                      type="number"
                      className="input w-full"
                      value={form.maxUnitPrice}
                      onChange={(e) => setForm({ ...form, maxUnitPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0 = no limit"
                      step="0.01"
                      min={0}
                    />
                  </div>
                </>
              )}

              {/* Recurring-specific fields */}
              {form.ruleType === "recurring" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-medium text-[#666] mb-1 block">Frequency</label>
                      <select
                        className="input w-full"
                        value={form.frequency}
                        onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Every 2 Weeks</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[12px] font-medium text-[#666] mb-1 block">Order Quantity</label>
                      <input
                        type="number"
                        className="input w-full"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                        min={1}
                      />
                    </div>
                  </div>
                  {(form.frequency === "weekly" || form.frequency === "biweekly") && (
                    <div>
                      <label className="text-[12px] font-medium text-[#666] mb-1 block">Day of Week</label>
                      <select
                        className="input w-full"
                        value={form.dayOfWeek}
                        onChange={(e) => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })}
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <option key={d} value={d}>{dayNames[d]}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {form.frequency === "monthly" && (
                    <div>
                      <label className="text-[12px] font-medium text-[#666] mb-1 block">Day of Month</label>
                      <input
                        type="number"
                        className="input w-full"
                        value={form.dayOfMonth}
                        onChange={(e) => setForm({ ...form, dayOfMonth: parseInt(e.target.value) || 1 })}
                        min={1}
                        max={28}
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-[12px] font-medium text-[#666] mb-1 block">Next Run Date</label>
                    <input
                      type="date"
                      className="input w-full"
                      value={form.nextRunDate}
                      onChange={(e) => setForm({ ...form, nextRunDate: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* Auto-approve toggle */}
              <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
                <div>
                  <div className="text-[13px] font-medium">Auto-approve orders</div>
                  <div className="text-[11px] text-[#999]">Skip manual approval for automated orders</div>
                </div>
                <div
                  className={`toggle ${form.autoApprove ? "on" : "off"}`}
                  onClick={() => setForm({ ...form, autoApprove: !form.autoApprove })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#eee]">
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.itemId}>
                <Save size={15} /> {editingId ? "Save Changes" : "Create Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
