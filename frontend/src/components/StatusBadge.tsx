interface StatusBadgeProps {
  status: string;
  quantity?: number;
}

const statusConfig: Record<string, { bg: string; border: string; label: string }> = {
  out_of_stock: { bg: "bg-status-red-light", border: "border-status-red", label: "Out of Stock" },
  low_quantity: { bg: "bg-status-orange-light", border: "border-status-orange", label: "Low Quantity" },
  in_stock: { bg: "bg-status-green-light", border: "border-status-green", label: "In Stock" },
  active_orders: { bg: "bg-purple-100", border: "border-purple-500", label: "Active Orders" },
};

export default function StatusBadge({ status, quantity }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.in_stock;
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs text-grey-800 border ${config.bg} ${config.border}`}
    >
      {config.label}{quantity !== undefined ? ` (${quantity})` : ""}
    </span>
  );
}
