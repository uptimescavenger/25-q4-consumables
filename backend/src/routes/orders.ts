import { Router, Request, Response } from "express";
import { orders, consumableItems, vendors } from "../data/mockData";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// GET /api/orders
router.get("/", (req: Request, res: Response) => {
  const { facilityId = "f1", status } = req.query;
  let filtered = orders.filter((o) => o.facilityId === facilityId);
  if (status) filtered = filtered.filter((o) => o.status === status);

  const enriched = filtered.map((o) => ({
    ...o,
    vendor: vendors.find((v) => v.id === o.vendorId),
    items: o.items.map((oi) => ({
      ...oi,
      item: consumableItems.find((ci) => ci.id === oi.itemId),
    })),
  }));

  res.json({ data: enriched });
});

// POST /api/orders - create new order from selected items
router.post("/", (req: Request, res: Response) => {
  const { facilityId, vendorId, items, shippingMethod, notes } = req.body;
  const orderItems = (items || []).map((item: any) => ({
    id: uuidv4(),
    orderId: "",
    itemId: item.itemId,
    vendorId: item.vendorId || vendorId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.quantity * item.unitPrice,
  }));
  const subtotal = orderItems.reduce((s: number, oi: any) => s + oi.totalPrice, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const order = {
    id: uuidv4(),
    facilityId: facilityId || "f1",
    createdBy: "u1",
    vendorId: vendorId || "v1",
    status: "draft" as const,
    shippingMethod: shippingMethod || "Standard",
    trackingNumber: null,
    subtotal,
    tax,
    total: Math.round((subtotal + tax) * 100) / 100,
    notes: notes || "",
    createdAt: new Date().toISOString(),
    approvedAt: null,
    deliveredAt: null,
    items: orderItems,
  };
  orderItems.forEach((oi: any) => (oi.orderId = order.id));
  orders.push(order);
  res.status(201).json(order);
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", (req: Request, res: Response) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  const { status } = req.body;
  order.status = status;
  if (status === "approved") order.approvedAt = new Date().toISOString();
  if (status === "delivered") order.deliveredAt = new Date().toISOString();
  res.json(order);
});

export default router;
