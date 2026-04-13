import { Router, Request, Response } from "express";
import crypto from "crypto";
import { automationRules, consumableItems, vendors } from "../data/mockData";

const uuidv4 = () => crypto.randomUUID();

const router = Router();

// GET /api/automations
router.get("/", (req: Request, res: Response) => {
  const { facilityId = "f1" } = req.query;
  const rules = automationRules
    .filter((r) => r.facilityId === facilityId)
    .map((r) => ({
      ...r,
      item: consumableItems.find((ci) => ci.id === r.itemId),
      vendor: r.preferredVendorId ? vendors.find((v) => v.id === r.preferredVendorId) : null,
    }));
  res.json({ data: rules });
});

// POST /api/automations
router.post("/", (req: Request, res: Response) => {
  const rule = { id: uuidv4(), ...req.body, createdBy: "u1" };
  automationRules.push(rule);
  res.status(201).json(rule);
});

// PATCH /api/automations/:id
router.patch("/:id", (req: Request, res: Response) => {
  const rule = automationRules.find((r) => r.id === req.params.id);
  if (!rule) return res.status(404).json({ error: "Not found" });
  Object.assign(rule, req.body);
  res.json(rule);
});

// DELETE /api/automations/:id
router.delete("/:id", (req: Request, res: Response) => {
  const idx = automationRules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  automationRules.splice(idx, 1);
  res.json({ success: true });
});

export default router;
