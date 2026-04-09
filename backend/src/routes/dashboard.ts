import { Router, Request, Response } from "express";
import {
  users, facilities, inventory, consumableItems, vendors,
  orders, tasks, notifications, budgets, automationRules,
} from "../data/mockData";

const router = Router();

// GET /api/dashboard - home page data
router.get("/", (req: Request, res: Response) => {
  const facilityId = (req.query.facilityId as string) || "f1";
  const user = users.find((u) => u.facilityId === facilityId) || users[0];

  // Critical items: out of stock + low quantity
  const criticalInventory = inventory
    .filter((inv) => inv.facilityId === facilityId && (inv.status === "out_of_stock" || inv.status === "low_quantity"))
    .map((inv) => ({
      ...inv,
      item: consumableItems.find((ci) => ci.id === inv.itemId)!,
      vendors: inv.vendorIds.map((vid) => vendors.find((v) => v.id === vid)!),
    }));

  const facilityTasks = tasks.filter(
    (t) => t.facilityId === facilityId || t.facilityId === "f1"
  );
  const todoTasks = facilityTasks.filter((t) => t.status === "todo");
  const overdueTasks = facilityTasks.filter((t) => t.status === "overdue");

  const unreadNotifications = notifications.filter((n) => n.userId === user.id && !n.isRead);

  const facilityBudgets = budgets.filter((b) => b.facilityId === facilityId);

  const activeAutomations = automationRules.filter((r) => r.facilityId === facilityId && r.isActive).length;

  res.json({
    user,
    facility: facilities.find((f) => f.id === facilityId),
    facilities,
    criticalInventory,
    criticalCount: criticalInventory.length,
    tasks: { todo: todoTasks, overdue: overdueTasks, todoTotal: todoTasks.length + 5, overdueTotal: overdueTasks.length + 70 },
    notifications: unreadNotifications,
    budgets: facilityBudgets,
    stats: {
      totalItems: inventory.filter((i) => i.facilityId === facilityId).length,
      outOfStock: inventory.filter((i) => i.facilityId === facilityId && i.status === "out_of_stock").length,
      lowQuantity: inventory.filter((i) => i.facilityId === facilityId && i.status === "low_quantity").length,
      pendingOrders: orders.filter((o) => o.facilityId === facilityId && ["draft", "pending_approval", "approved", "ordered", "shipped"].includes(o.status)).length,
      activeAutomations,
      budgetUtilization: facilityBudgets.length > 0
        ? Math.round((facilityBudgets.reduce((s, b) => s + b.spentAmount, 0) / facilityBudgets.reduce((s, b) => s + b.allocatedAmount, 0)) * 100)
        : 0,
    },
  });
});

// GET /api/dashboard/metrics - real-time metrics for Streamlit
router.get("/metrics", (_req: Request, res: Response) => {
  const allInv = inventory;
  const totalValue = allInv.reduce((s, inv) => s + inv.quantityOnHand * inv.price, 0);
  const totalItems = allInv.reduce((s, inv) => s + inv.quantityOnHand, 0);
  res.json({
    totalInventoryValue: totalValue,
    totalItemsInStock: totalItems,
    uniqueProducts: consumableItems.length,
    activeVendors: vendors.length,
    openOrders: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
    totalOrderValue: orders.reduce((s, o) => s + o.total, 0),
    automationRulesActive: automationRules.filter((r) => r.isActive).length,
    facilitiesCount: facilities.length,
    budgets: budgets.map((b) => ({
      facility: facilities.find((f) => f.id === b.facilityId)?.name,
      category: b.category,
      allocated: b.allocatedAmount,
      spent: b.spentAmount,
      utilization: Math.round((b.spentAmount / b.allocatedAmount) * 100),
    })),
    inventoryByStatus: {
      outOfStock: allInv.filter((i) => i.status === "out_of_stock").length,
      lowQuantity: allInv.filter((i) => i.status === "low_quantity").length,
      inStock: allInv.filter((i) => i.status === "in_stock").length,
      activeOrders: allInv.filter((i) => i.status === "active_orders").length,
    },
  });
});

// GET /api/vendors
router.get("/vendors", (_req: Request, res: Response) => {
  res.json({ data: vendors });
});

// GET /api/notifications
router.get("/notifications", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "u1";
  res.json({ data: notifications.filter((n) => n.userId === userId) });
});

export default router;
