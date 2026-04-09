import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface QuantityCounterProps {
  initial?: number;
  onAdd?: (qty: number) => void;
}

export default function QuantityCounter({ initial = 1, onAdd }: QuantityCounterProps) {
  const [qty, setQty] = useState(initial);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-purple-100 rounded">
        <button
          className="p-2 hover:bg-grey-50 text-grey-400"
          onClick={() => setQty(Math.max(1, qty - 1))}
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center text-sm text-grey-900">{qty}</span>
        <button
          className="p-2 hover:bg-grey-50 text-purple-500"
          onClick={() => setQty(qty + 1)}
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        className="border border-purple-500 text-purple-500 text-sm font-medium px-4 py-2 rounded hover:bg-purple-50 w-[80px]"
        onClick={() => onAdd?.(qty)}
      >
        Add
      </button>
    </div>
  );
}
