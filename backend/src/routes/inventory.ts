import { Router, Request, Response } from "express";
import { consumableItems, inventory, vendors, automationRules } from "../data/mockData";

const router = Router();

// GET /api/inventory - list all inventory with item + vendor details
router.get("/", (req: Request, res: Response) => {
  const { facilityId = "f1", status, search, vendor: vendorFilter } = req.query;

  let records = inventory.filter((inv) => inv.facilityId === facilityId);

  if (status && status !== "all") {
    records = records.filter((inv) => inv.status === status);
  }

  const enriched = records.map((inv) => {
    const item = consumableItems.find((ci) => ci.id === inv.itemId)!;
    const itemVendors = inv.vendorIds.map((vid) => vendors.find((v) => v.id === vid)!);
    const rule = automationRules.find((r) => r.itemId === inv.itemId && r.facilityId === inv.facilityId);
    return { ...inv, item, vendors: itemVendors, automationRule: rule || null };
  });

  let filtered = enriched;
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.item.name.toLowerCase().includes(q) ||
        r.item.description.toLowerCase().includes(q) ||
        r.item.sku.toLowerCase().includes(q)
    );
  }
  if (vendorFilter && vendorFilter !== "all") {
    filtered = filtered.filter((r) => r.vendors.some((v) => v.id === vendorFilter));
  }

  const statusCounts = {
    all: inventory.filter((inv) => inv.facilityId === facilityId).length,
    out_of_stock: inventory.filter((inv) => inv.facilityId === facilityId && inv.status === "out_of_stock").length,
    low_quantity: inventory.filter((inv) => inv.facilityId === facilityId && inv.status === "low_quantity").length,
    in_stock: inventory.filter((inv) => inv.facilityId === facilityId && inv.status === "in_stock").length,
    active_orders: inventory.filter((inv) => inv.facilityId === facilityId && inv.status === "active_orders").length,
  };

  res.json({ data: filtered, statusCounts });
});

// GET /api/inventory/:id
router.get("/:id", (req: Request, res: Response) => {
  const inv = inventory.find((i) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ error: "Not found" });
  const item = consumableItems.find((ci) => ci.id === inv.itemId)!;
  const itemVendors = inv.vendorIds.map((vid) => vendors.find((v) => v.id === vid)!);
  res.json({ ...inv, item, vendors: itemVendors });
});

// PATCH /api/inventory/:id/quantity - update quantity (for "Add" button)
router.patch("/:id/quantity", (req: Request, res: Response) => {
  const inv = inventory.find((i) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ error: "Not found" });
  const { quantity } = req.body;
  if (typeof quantity !== "number") return res.status(400).json({ error: "quantity required" });

  inv.quantityOnHand = Math.max(0, inv.quantityOnHand + quantity);
  if (inv.quantityOnHand === 0) inv.status = "out_of_stock";
  else if (inv.quantityOnHand <= inv.reorderThreshold) inv.status = "low_quantity";
  else inv.status = "in_stock";

  res.json(inv);
});

// PATCH /api/inventory/:id/reminder
router.patch("/:id/reminder", (req: Request, res: Response) => {
  const inv = inventory.find((i) => i.id === req.params.id);
  if (!inv) return res.status(404).json({ error: "Not found" });
  inv.reminderEnabled = !!req.body.enabled;
  res.json(inv);
});

export default router;
